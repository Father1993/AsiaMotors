"""Rollback guard checks with mocked Docker only."""
import os, shutil, subprocess, tempfile, json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
for column,pending,expected in [('t','0',0),('t','2',1),('f','0',0)]:
 with tempfile.TemporaryDirectory() as directory:
  base=Path(directory);(base/'scripts').mkdir();(base/'bin').mkdir()
  shutil.copy(root/'scripts/rollback.sh',base/'scripts/rollback.sh')
  (base/'rollback.json').write_text('{}')
  mock=base/'bin/docker';mock.write_text('''#!/usr/bin/python3
import sys,os,json
args=sys.argv[1:]
with open(os.environ['ROLLBACK_LOG'],'a') as f:f.write(json.dumps(args)+'\\n')
if 'psql' in args:print(os.environ['ROLLBACK_COLUMN'] if 'information_schema.columns' in args[-1] else os.environ['ROLLBACK_PENDING'])
''');mock.chmod(0o755)
  env={**os.environ,'PATH':str(base/'bin')+os.pathsep+os.environ['PATH'],'ROLLBACK_LOG':str(base/'calls'),'ROLLBACK_COLUMN':column,'ROLLBACK_PENDING':pending}
  result=subprocess.run(['sh',str(base/'scripts/rollback.sh'),'rollback.json'],env=env,capture_output=True,text=True)
  assert result.returncode==expected,result.stderr
  calls=[json.loads(line) for line in (base/'calls').read_text().splitlines()]
  assert calls[0]==['compose','stop','web']
  activated=any(x[:2]==['compose','-f'] for x in calls)
  assert activated==(expected==0)
  if expected:assert ['compose','start','web'] in calls
  assert all(not (x[:2]==['compose','stop'] and 'mail-worker' in x) for x in calls)
print('Rollback refuses pending publications, restarts current web, keeps mail worker running: PASS')
