"""Admin catalog checks against local dev3110 and isolated Compose test database."""
import base64, http.cookiejar, json, time, urllib.request, urllib.error, urllib.parse, uuid
from pathlib import Path
BASE='http://127.0.0.1:3110'
assert BASE == 'http://127.0.0.1:3110'
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
ids=[]
def create(data):
    identifier=str(uuid.uuid4());ids.append(identifier)
    status,record=request('/api/cars','POST',{'id':identifier,**data},admin)
    assert status==201,(status,record)
    return record
try:
    assert request('/api/cars')[0]==401
    row=create({'brand':'API Draft','model':'Minimal'})
    assert row['status']=='draft' and row['year'] is None and row['price'] is None and row['country_id'] is None and row['specs']=={}
    identifier=row['id'];path='/api/cars/'+identifier
    assert request(path)[0]==401
    assert request(path,client=admin)[1]['id']==identifier
    assert not any(c['id']==identifier for c in request('/api/catalog')[1]['cars'])
    status,errors=request(path,'PATCH',{'status':'published','version':1},admin)
    assert status==400 and errors['fieldErrors']['images'] and errors['fieldErrors']['year'],(status,errors)
    assert request('/api/cars','POST',{'id':identifier,'brand':'Do not overwrite','model':'Retry'},admin)[1]['brand']=='API Draft'
    assert request(path,'PUT',{**row,'price':-1},admin)[0]==400
    updated={**row,'model':'Saved draft'}
    status,row=request(path,'PUT',updated,admin);assert status==200 and row['version']==2
    assert request(path,'PUT',updated,admin)[0]==409
    assert request(path,'DELETE',{'version':1},admin)[0]==409
    assert request(path,'PATCH',{'status':'hidden','version':1},admin)[0]==409
    full={**row,'country_id':'japan','year':2026,'category':'Седан','price':1000000,'images':[image],'specs':{'mileage':0,'engineVolume':2,'horsePower':150,'fuelType':'Бензин','transmission':'Автомат','driveType':'Передний'},'status':'published'}
    status,row=request(path,'PUT',full,admin);assert status==200,(status,row)
    assert row['version']==3
    oldpath='/catalog/api-draft-saved-draft-2026-'+identifier
    assert request(oldpath)[0]==200
    status,row=request(path,'PUT',{**row,'model':'Changed model'},admin);assert status==200
    assert request(oldpath)[0]==308
    newpath='/catalog/api-draft-changed-model-2026-'+identifier
    assert request(newpath)[0]==200
    assert any(c['id']==identifier for c in request('/api/catalog')[1]['cars'])
    status,row=request(path,'PATCH',{'status':'hidden','version':row['version']},admin);assert status==200
    assert request(oldpath)[0]==404 and request(newpath)[0]==404
    assert not any(c['id']==identifier for c in request('/api/catalog')[1]['cars'])
    status,row=request(path,'PATCH',{'status':'published','version':row['version']},admin);assert status==200
    stored_version=row['version']
    assert request(path,'PUT',{**row,'images':['/media/'+str(uuid.uuid4())+'.webp']},admin)[0]==400
    assert request(path,client=admin)[1]['version']==stored_version
    assert request(path,client=admin)[1]['images']==[image]
    assert request(path,'PUT',row,admin,origin='https://invalid.test')[0]==403
    missing='/api/cars/'+str(uuid.uuid4())
    assert request(missing,'PUT',row,admin)[0]==404
    assert request(missing,'DELETE',{'version':1},admin)[0]==404
    marker='Pagination'+str(uuid.uuid4())[:8]
    for i in range(26):create({'brand':marker,'model':f'Model {i}'})
    query=urllib.parse.urlencode({'q':marker,'status':'draft','page':1})
    listed=request('/api/cars?'+query,client=admin)[1]
    assert listed['total']==26 and len(listed['cars'])==25 and listed['pageSize']==25
    page2=request('/api/cars?'+query.replace('page=1','page=2'),client=admin)[1]
    assert len(page2['cars'])==1 and page2['total']==26
    assert request('/api/cars?'+urllib.parse.urlencode({'q':marker+'%'}),client=admin)[1]['total']==0
    assert request('/api/cars?'+urllib.parse.urlencode({'q':marker,'country':'japan'}),client=admin)[1]['total']==0
    assert request('/api/cars?'+urllib.parse.urlencode({'q':'API Draft Changed model','status':'published','country':'japan','available':'true'}),client=admin)[1]['total']==1
    assert request('/api/cars?page=0',client=admin)[0]==400
    print('PASS: drafts, field validation, publication, conflicts, idempotence, media rollback, pagination, filters and auth')
finally:
    for identifier in ids:
        path='/api/cars/'+identifier
        status,row=request(path,client=admin)
        if status==200:assert request(path,'DELETE',{'version':row['version']},admin)[0]==200
