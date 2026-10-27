"""Run against compose.test.yaml only. All email is captured by the test SMTP sink."""
import base64, http.cookiejar, json, time, urllib.request, urllib.error, urllib.parse, uuid
from pathlib import Path
BASE='http://127.0.0.1:3110'
TEST_IP='test-'+str(uuid.uuid4())
TEST_NAME='Тест интеграции '+str(uuid.uuid4())[:8]
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args): return None
public=urllib.request.build_opener(NoRedirect)
admin=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()),NoRedirect)
def request(path,method='GET',data=None,client=public,origin=BASE,headers=None):
    h={'Origin':origin,'X-Real-IP':TEST_IP,**(headers or {})}
    if isinstance(data,dict):h['Content-Type']='application/json';data=json.dumps(data).encode()
    req=urllib.request.Request(BASE+path,method=method,data=data,headers=h)
    try:r=client.open(req,timeout=30)
    except urllib.error.HTTPError as e:r=e
    body=r.read()
    try:body=json.loads(body)
    except (ValueError,UnicodeDecodeError):pass
    return r.status,body
values={k:json.loads(v) for k,v in (s.split('=',1) for s in Path('.env').read_text().splitlines() if s and not s.startswith('#'))}
status,data=request('/api/health');assert status==200 and data['ok']
status,data=request('/api/catalog');assert status==200 and len(data['countries'])==4
assert request('/api/cars','POST',{})[0]==401
assert request('/api/uploads','POST',b'')[0]==401
assert request('/api/admin/leads')[0]==401
csrf=request('/api/auth/csrf',client=admin)[1]['csrfToken']
body=urllib.parse.urlencode({'csrfToken':csrf,'email':values['ADMIN_EMAIL'],'password':values['ADMIN_PASSWORD'],'callbackUrl':BASE+'/admin','json':'true'}).encode()
assert request('/api/auth/callback/credentials','POST',body,admin,headers={'Content-Type':'application/x-www-form-urlencoded'})[0]==200
assert request('/api/auth/session',client=admin)[1]['user']['isAdmin']
assert request('/admin/requests',client=admin)[0]==200
assert request('/api/cars','POST',{},admin,origin='https://invalid.test')[0]==403
print('Authentication and same-origin write protection: PASS',flush=True)
# A generated real PNG, no external fixtures or downloads.
import struct,zlib
chunk=lambda t,b:struct.pack('!I',len(b))+t+b+struct.pack('!I',zlib.crc32(t+b)&0xffffffff)
png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',2,2,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(b'\x00'+b'\xff\x00\x00'*2+b'\x00'+b'\x00\xff\x00'*2))+chunk(b'IEND',b'')
def upload(content,name='test.png'):
    boundary='integration-'+str(uuid.uuid4())
    payload=(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{name}"\r\nContent-Type: image/png\r\n\r\n').encode()+content+f'\r\n--{boundary}--\r\n'.encode()
    return request('/api/uploads','POST',payload,admin,headers={'Content-Type':'multipart/form-data; boundary='+boundary})
status,data=upload(png);assert status==201,(status,data)
image=data['url'];assert request(image)[0]==200
assert upload(b'<svg onload="alert(1)"></svg>','test.svg')[0]==400
car={'country_id':'china','brand':'Integration','model':'Test','year':2026,'category':'Кроссоверы','price':1000000,'equipment':'Проверка','images':[image],'available':True,'specs':{'mileage':0,'engineVolume':2,'horsePower':150,'fuelType':'Бензин','transmission':'Автомат','driveType':'Передний','color':'Белый','generation':'I','features':[]}}
status,record=request('/api/cars','POST',car,admin);assert status==201,(status,record)
carid=record['id'];assert request('/catalog/integration-test-2026-'+carid)[0]==200
status,duplicate=request('/api/cars','POST',car,admin);assert status==201 and duplicate['id']!=carid
assert request('/catalog/integration-test-2026-'+duplicate['id'])[0]==200
assert request('/api/cars/'+duplicate['id'],'DELETE',client=admin)[0]==200
car['price']=2000000;assert request('/api/cars/'+carid,'PUT',car,admin)[0]==200
bad={**car,'images':['/media/'+str(uuid.uuid4())+'.webp']};assert request('/api/cars/'+carid,'PUT',bad,admin)[0]==400
stored=[c for c in request('/api/catalog')[1]['cars'] if c['id']==carid][0];assert stored['images']==[image] and stored['price']==2000000
Path('/tmp/asiamotors-test-car-id').write_text(carid)
Path('/tmp/asiamotors-test-image-path').write_text(image)
print('Image upload, catalog, detail, edit and rollback protection: PASS',flush=True)
key=str(uuid.uuid4())
lead={'request_key':key,'consent':True,'consent_version':'2026-10-27','form_name':'Форма заказа автомобиля','user_name':TEST_NAME,'user_phone':'+7 (999) 000-00-00','car_model':'Integration Test','message':'Автоматический тест, SMTP только локальный'}
assert request('/api/leads','POST',{**lead,'consent':False})[0]==400
assert request('/api/leads','POST',lead,origin='https://invalid.test')[0]==403
assert request('/api/leads','POST',lead)[0]==202
assert request('/api/leads','POST',lead)[0]==202
matches=[]
for _ in range(20):
    time.sleep(1)
    matches=[r for r in request('/api/admin/leads',client=admin)[1]['leads'] if r['payload']['user_name']==TEST_NAME]
    if matches and matches[0]['mail_status']=='sent':break
assert len(matches)==1 and matches[0]['mail_status']=='sent',[(r['mail_status'],r['last_error']) for r in matches]
leadid=matches[0]['id'];assert request('/api/admin/leads/'+leadid,'PATCH',{'status':'processing'},admin)[0]==200
assert request('/api/admin/leads/'+leadid,'DELETE',client=admin)[0]==200
print('Lead validation, consent, deduplication, SMTP delivery, admin and deletion: PASS',flush=True)
# 2 accepted requests consumed the per-IP budget; next three pass, sixth is rejected.
for _ in range(3):assert request('/api/leads','POST',{**lead,'request_key':str(uuid.uuid4())})[0]==202
assert request('/api/leads','POST',{**lead,'request_key':str(uuid.uuid4())})[0]==429
print('Persistent request rate limit: PASS',flush=True)
# Retain one test car for separate restart/backup restoration checks.
# A temporary SMTP outage must not lose the saved request.
import subprocess
compose=['docker','compose','-p','asiamotors-test','-f','compose.yaml','-f','compose.test.yaml']
TEST_IP='retry-'+str(uuid.uuid4())
retry_name='Тест повтора '+str(uuid.uuid4())[:8]
subprocess.run(compose+['stop','smtp'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    assert request('/api/leads','POST',{**lead,'request_key':str(uuid.uuid4()),'user_name':retry_name})[0]==202
    pending=None
    for _ in range(25):
        time.sleep(1)
        pending=next((r for r in request('/api/admin/leads',client=admin)[1]['leads'] if r['payload']['user_name']==retry_name),None)
        if pending and pending['attempts']>=1:break
    assert pending and pending['mail_status']=='pending' and pending['attempts']>=1
finally:
    subprocess.run(compose+['start','smtp'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
assert pending
subprocess.run(compose+['exec','-T','db','psql','-U','postgres','-d','asiamotors','-c',"UPDATE mail_outbox SET next_attempt_at=now() WHERE lead_id='"+str(uuid.UUID(pending['id']))+"'"],check=True,stdout=subprocess.DEVNULL)
for _ in range(20):
    time.sleep(1)
    current=next((r for r in request('/api/admin/leads',client=admin)[1]['leads'] if r['id']==pending['id']),None)
    if current and current['mail_status']=='sent':break
assert current and current['mail_status']=='sent'
print('SMTP outage preserves request; delivery recovers after retry: PASS',flush=True)

print('ALL INTEGRATION CHECKS PASSED',flush=True)
