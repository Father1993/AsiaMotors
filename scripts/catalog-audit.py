#!/usr/bin/env python3
"""Read-only catalog incident report. Run from the production checkout with sudo.

pg_restore has no database argument: it only decodes backup data to stdout.
Never prints environment files, credentials, request bodies or client addresses.
"""
import gzip
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
COMPOSE = ['docker', 'compose']
CAR_FIELDS = ('id', 'brand', 'model', 'status', 'version', 'created_at', 'updated_at')


def command(args, stdin=None):
    return subprocess.run(args, cwd=ROOT, stdin=stdin, capture_output=True, check=True).stdout.decode('utf-8')


def copy_value(value):
    if value == r'\N':
        return None
    escapes = {'b': '\b', 'f': '\f', 'n': '\n', 'r': '\r', 't': '\t', 'v': '\v', '\\': '\\'}
    return re.sub(r'\\([0-7]{1,3}|x[0-9a-fA-F]{1,2}|.)', lambda match:
                  chr(int(match[1], 8)) if match[1][0].isdigit() else
                  chr(int(match[1][1:], 16)) if match[1].startswith('x') and len(match[1]) > 1 else
                  escapes.get(match[1], match[1]), value)


def backup_cars(sql):
    columns = None
    rows = []
    for line in sql.splitlines():
        if columns is None:
            header = re.fullmatch(r'COPY public\.cars \(([^)]+)\) FROM stdin;', line)
            if header:
                columns = [name.strip().strip('"') for name in header[1].split(',')]
            continue
        if line == r'\.':
            return rows
        values = line.split('\t')
        if len(values) != len(columns):
            raise ValueError('Unexpected cars COPY row')
        row = dict(zip(columns, map(copy_value, values)))
        rows.append({key: row.get(key) for key in CAR_FIELDS})
    # An empty table still has a COPY header and terminator. Do not confuse a
    # failed table selection or an unsupported dump format with zero cars.
    raise ValueError('Complete public.cars COPY section not found')


def backup_report(directory):
    dump = directory / 'database.dump'
    result = {'backup': directory.name, 'bytes': dump.stat().st_size}
    checksums = directory / 'SHA256SUMS'
    expected = re.search(r'^([a-f0-9]{64})\s+\*?database\.dump$', checksums.read_text(), re.M) if checksums.exists() else None
    if expected:
        with dump.open('rb') as source:
            actual = hashlib.file_digest(source, 'sha256').hexdigest()
        result['checksumValid'] = actual == expected[1]
        if not result['checksumValid']:
            return {**result, 'error': 'Backup checksum mismatch'}
    with dump.open('rb') as source:
        sql = command(COMPOSE + ['exec', '-T', 'db', 'pg_restore', '--data-only', '--schema=public', '--table=cars', '--file=-'], stdin=source)
    cars = backup_cars(sql)
    return {**result, 'carCount': len(cars), 'cars': cars}


def deletion_requests(directory):
    found = []
    pattern = re.compile(r'\[([^\]]+)\]\s+"DELETE (/api/cars/[0-9a-f-]{36})(?:\?[^ ]*)? HTTP/[0-9.]+"\s+(\d{3})')
    for path in sorted(directory.glob('access.log*')):
        if not path.is_file():
            continue
        opener = gzip.open if path.suffix == '.gz' else open
        with opener(path, 'rt', errors='replace') as source:
            for line in source:
                match = pattern.search(line)
                if match:
                    found.append({'time': match[1], 'path': match[2], 'status': int(match[3]), 'log': path.name})
    return found


def main():
    container = command(COMPOSE + ['ps', '-q', 'db']).strip()
    if not container:
        raise ValueError('Database container is not running')
    mounts = json.loads(command(['docker', 'inspect', '--format', '{{json .Mounts}}', container]))
    sql = """SELECT jsonb_build_object(
      'database',current_database(),'serverStartedAt',pg_postmaster_start_time(),
      'carCount',(SELECT count(*) FROM cars),
      'cars',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',id,'brand',brand,'model',model,
         'status',status,'version',version,'created_at',created_at,'updated_at',updated_at)
         ORDER BY created_at,id) FROM cars),'[]'::jsonb),
      'leadCount',(SELECT count(*) FROM leads),'mediaCount',(SELECT count(*) FROM media),
      'migrations',(SELECT jsonb_agg(jsonb_build_object('name',name,'applied_at',applied_at) ORDER BY name) FROM schema_migrations))"""
    current = json.loads(command(COMPOSE + ['exec', '-T', '-e', 'PGOPTIONS=-c default_transaction_read_only=on', 'db',
                                             'psql', '-X', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'asiamotors', '-Atc', sql]))
    backups = []
    for dump in sorted((ROOT / 'backups').glob('*/database.dump')):
        try:
            backups.append(backup_report(dump.parent))
        except (ValueError, OSError, subprocess.CalledProcessError) as error:
            backups.append({'backup': dump.parent.name, 'error': type(error).__name__})
    report = {
        'readOnly': True,
        'dbContainerDates': command(['docker', 'inspect', '--format', '{{.Created}} / {{.State.StartedAt}}', container]).strip(),
        'dbVolumes': [{'name': m.get('Name'), 'destination': m['Destination']} for m in mounts if m['Destination'] == '/var/lib/postgresql/data'],
        'current': current, 'backups': backups,
        'carDeletionRequests': deletion_requests(Path('/var/log/nginx')),
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print('Read-only catalog audit failed: ' + type(error).__name__, file=sys.stderr)
        sys.exit(1)
