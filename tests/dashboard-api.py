"""Dashboard auth and aggregate invariants, isolated localhost stack only."""
from pathlib import Path
from datetime import datetime
exec(Path('tests/selfhost-integration.py').read_text().split("status,data=request('/api/health')")[0])
assert BASE == 'http://127.0.0.1:3110'
assert request('/api/admin/dashboard')[0]==401
csrf=request('/api/auth/csrf',client=admin)[1]['csrfToken']
body=urllib.parse.urlencode({'csrfToken':csrf,'email':values['ADMIN_EMAIL'],'password':values['ADMIN_PASSWORD'],'callbackUrl':BASE+'/admin/dashboard','json':'true'}).encode()
assert request('/api/auth/callback/credentials','POST',body,admin,headers={'Content-Type':'application/x-www-form-urlencoded'})[0]==200
assert request('/api/admin/dashboard?period=365',client=admin)[0]==400
previous=-1
for period in ['7','30','90','all']:
 status,data=request('/api/admin/dashboard?period='+period,client=admin)
 assert status==200,(status,data)
 assert data['period']==period and data['timezone']=='Asia/Vladivostok'
 assert data['requests']['total']==sum(data['requests'][key] for key in ['new','processing','closed'])
 assert data['requests']['total']>=previous
 previous=data['requests']['total']
 assert sum(data['mail'].values())<=data['requests']['total']
 assert sum(item['total'] for item in data['daily'])==data['requests']['total']
 assert sum(item['total'] for item in data['sources'])==data['requests']['total']
 assert data['cars']['available']+data['cars']['onOrder']==data['cars']['published']
 assert data['cars']['draft']+data['cars']['hidden']+data['cars']['published']==data['cars']['total']
 assert data['articles']['archive']==28
 if period!='all':
  local=datetime.fromisoformat(data['since'].replace('Z','+00:00')).astimezone(__import__('datetime').timezone(__import__('datetime').timedelta(hours=10)))
  assert local.hour==local.minute==local.second==0
 assert data['backlog']['new']>=data['requests']['new']
assert request('/admin/dashboard',client=admin)[0]==200
print('Dashboard auth, period bounds, backlog and aggregate invariants: PASS')
