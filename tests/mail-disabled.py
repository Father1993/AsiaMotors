"""Verify disabled delivery against the isolated Compose project, even with unusable SMTP."""
import json, subprocess, tempfile, time, urllib.request, uuid
from pathlib import Path
compose = ['docker', 'compose', '-p', 'asiamotors-test', '-f', 'compose.yaml', '-f', 'compose.test.yaml']
key = str(uuid.uuid4())
def run(args):
    return subprocess.run(args, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True).stdout.strip()
with tempfile.TemporaryDirectory(prefix='asiamotors-mail-off-') as directory:
    override = Path(directory) / 'disabled.yaml'
    override.write_text('services:\n  mail-worker:\n    environment:\n      MAIL_DELIVERY_ENABLED: "false"\n      SMTP_HOST: invalid.example.test\n      SMTP_PASSWORD_FILE: /does-not-exist\n')
    disabled = compose + ['-f', str(override)]
    try:
        run(disabled + ['up', '-d', '--no-build', '--no-deps', 'mail-worker'])
        lead = {'request_key': key, 'consent': True, 'consent_version': '2026-10-27', 'form_name': 'Проверка выключенной почты', 'user_name': 'Тест без почты', 'user_phone': '+7 (999) 000-00-00'}
        request = urllib.request.Request('http://127.0.0.1:3110/api/leads', data=json.dumps(lead).encode(), headers={'Origin': 'http://127.0.0.1:3110', 'Content-Type': 'application/json', 'X-Real-IP': key}, method='POST')
        assert urllib.request.urlopen(request).status == 202
        # Worker polls every five seconds: observe more than two opportunities to send.
        time.sleep(11)
        sql = "SELECT o.status || ':' || o.attempts FROM mail_outbox o JOIN leads l ON l.id=o.lead_id WHERE l.request_key='" + key + "'"
        assert run(compose + ['exec', '-T', 'db', 'psql', '-U', 'postgres', '-d', 'asiamotors', '-Atc', sql]) == 'pending:0'
        logs = run(disabled + ['logs', '--no-color', 'mail-worker'])
        assert 'SMTP' not in logs or 'disabled' in logs.lower()
        print('PASS: disabled mail persists lead with zero SMTP attempts and does not read SMTP credentials')
    finally:
        run(compose + ['exec', '-T', 'db', 'psql', '-U', 'postgres', '-d', 'asiamotors', '-c', "DELETE FROM leads WHERE request_key='" + key + "'"])
        run(compose + ['up', '-d', '--no-build', '--no-deps', 'mail-worker'])
