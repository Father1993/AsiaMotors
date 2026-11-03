"""Exercise deploy ordering with mocked Docker; never touches a running stack."""
import json, os, shutil, subprocess, tempfile
from pathlib import Path
root = Path(__file__).resolve().parents[1]
for missing in ('0', '1'):
    with tempfile.TemporaryDirectory() as directory:
        base = Path(directory)
        (base / 'scripts').mkdir()
        (base / 'bin').mkdir()
        shutil.copy(root / 'scripts/deploy.sh', base / 'scripts/deploy.sh')
        (base / '.env').write_text('MAIL_DELIVERY_ENABLED=false\n')
        docker = base / 'bin/docker'
        docker.write_text('''#!/usr/bin/python3
import json,os,sys
args=sys.argv[1:]
with open(os.environ['DEPLOY_TEST_LOG'],'a') as f:f.write(json.dumps(args)+'\\n')
if args[:3]==['compose','ps','-q']:print('old-container' if args[-1]=='web' else 'worker-container')
elif args[:2]==['inspect','--format']:print('sha256:old-image' if args[-1]=='old-container' else 'worker:latest')
elif args[:2]==['image','tag'] and args[2]=='sha256:old-image' and os.environ['DEPLOY_TEST_MISSING']=='1':sys.exit(1)
elif args==['compose','config','--format','json']:print(json.dumps({'services':{'web':{'build':'.'},'mail-worker':{'build':'.'}}}))
''')
        docker.chmod(0o755)
        curl = base / 'bin/curl'
        curl.write_text('#!/bin/sh\nprintf \'{"ok":true}\\n\'\n')
        curl.chmod(0o755)
        env = {**os.environ, 'PATH': str(base/'bin')+os.pathsep+os.environ['PATH'], 'DEPLOY_TEST_LOG': str(base/'calls.jsonl'), 'DEPLOY_TEST_MISSING': missing}
        result = subprocess.run(['sh', str(base/'scripts/deploy.sh'), '--with-mail'],env=env,capture_output=True,text=True)
        assert result.returncode == 0, result.stderr
        calls=[json.loads(x) for x in (base/'calls.jsonl').read_text().splitlines()]
        pin=next(i for i,x in enumerate(calls) if x[:2]==['image','tag'])
        build=next(i for i,x in enumerate(calls) if x[:2]==['compose','build'])
        assert pin < build
        activation=['compose','up','-d','--no-deps','--wait','--wait-timeout','180','web']
        assert activation in calls
        rollbacks=list((base/'backups').glob('release-*/rollback.compose.json'))
        assert bool(rollbacks)==(missing=='0')
        if rollbacks:
            config=json.loads(rollbacks[0].read_text())
            assert config['services']['web']['image'].startswith('asiamotors-web-rollback:')
            assert config['services']['mail-worker']['image'].startswith('asiamotors-worker-rollback:')
print('PASS: image pinned before build; missing old image does not block web activation')
