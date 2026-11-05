"""Verify read-only backup parsing and log extraction without Docker or production."""
import importlib.util
from pathlib import Path
import tempfile
import gzip

spec = importlib.util.spec_from_file_location('catalog_audit', Path(__file__).resolve().parents[1] / 'scripts/catalog-audit.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
header = 'COPY public.cars (id, brand, model, status, version, created_at, updated_at) FROM stdin;\n'
identifier = 'b2a8d3e1-eef9-4a30-b479-0a6b20cdd600'
fixture = header + identifier + '\tChangan\tUNI-Z\\tPlus\tpublished\t1\t2026-10-28\t2026-10-28\n\\.\n'
rows = audit.backup_cars(fixture)
assert len(rows) == 1 and rows[0]['id'] == identifier
assert rows[0]['model'] == 'UNI-Z\tPlus'
assert audit.backup_cars(header + '\\.\n') == []
for invalid in ['', header, header + 'incomplete\n\\.\n']:
    try:
        audit.backup_cars(invalid)
        raise AssertionError('Incomplete backup must not be reported as an empty table')
    except ValueError:
        pass
assert audit.copy_value(r'\N') is None
assert audit.copy_value(r'back\\slash\ntext\040space') == 'back\\slash\ntext space'
with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    line = '127.0.0.1 - - [05/Nov/2026:00:42:00 +0000] "DELETE /api/cars/' + identifier + ' HTTP/1.1" 200 12 "-" "client"\n'
    (root / 'access.log').write_text(line + line.replace('DELETE', 'GET'))
    with gzip.open(root / 'access.log.1.gz', 'wt') as stream:
        stream.write(line.replace(' 200 ', ' 401 '))
    found = audit.deletion_requests(root)
    assert len(found) == 2 and {row['status'] for row in found} == {200, 401}
    assert all(set(row) == {'time', 'path', 'status', 'log'} for row in found)
print('PASS: COPY data/null/escaping, empty vs incomplete backups, rotated logs; no writes or credentials')
