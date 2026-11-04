"""Scheduling auth, version guards, frozen snapshots and cancellation; localhost only."""
from pathlib import Path
from datetime import datetime,timedelta,timezone
exec(Path('tests/selfhost-integration.py').read_text().split("status,data=request('/api/health')")[0])
assert BASE=='http://127.0.0.1:3110'
csrf=request('/api/auth/csrf',client=admin)[1]['csrfToken']
body=urllib.parse.urlencode({'csrfToken':csrf,'email':values['ADMIN_EMAIL'],'password':values['ADMIN_PASSWORD'],'callbackUrl':BASE+'/admin','json':'true'}).encode()
assert request('/api/auth/callback/credentials','POST',body,admin,headers={'Content-Type':'application/x-www-form-urlencoded'})[0]==200
source=Path('tests/selfhost-integration.py').read_text()
exec(source[source.index('import struct,zlib'):source.index('status,data=upload(png)')])
status,image=upload(png);assert status==201
identifier=str(uuid.uuid4());slug='scheduled-api-'+identifier;path='/api/admin/posts/'+identifier
full={'title':'Frozen schedule','excerpt':'Обзор автомобиля из Китая и сроков поставки.','author':'AsiaMotors','cover':image['url'],'coverAlt':'Автомобиль','tags':[],'seoTitle':'','seoDescription':'','showCta':True,'content':{'type':'doc','content':[{'type':'paragraph','content':[{'type':'text','text':'Сравнение автомобилей из Китая под заказ и в наличии. Проверяем сроки, комплектации и стоимость.'}]}]}}
status,row=request('/api/admin/posts','POST',{'id':identifier,'slug':slug,'document':full},admin);assert status==201
try:
 future=(datetime.now(timezone.utc)+timedelta(minutes=5)).isoformat()
 assert request(path,'PATCH',{'version':row['version'],'action':'schedule','scheduledAt':future})[0]==401
 assert request(path,'PATCH',{'version':row['version'],'action':'schedule','scheduledAt':'2000-01-01T00:00:00Z'},admin)[0]==400
 status,row=request(path,'PATCH',{'version':row['version'],'action':'schedule','scheduledAt':future},admin);assert status==200,(status,row)
 assert row['scheduled_at'] and row['scheduled_document']['title']==full['title']
 assert request('/blog/'+slug)[0]==404
 version=row['version']
 changed={**full,'title':'Later draft edit','cover':''}
 status,row=request(path,'PUT',{'version':version,'slug':slug,'document':changed},admin);assert status==200,(status,row)
 assert row['draft']['title']==changed['title'] and row['scheduled_document']['title']==full['title']
 assert row['scheduled_document']['cover']==image['url']
 assert request(path,'PUT',{'version':row['version'],'slug':slug+'-changed','document':changed},admin)[0]==409
 assert request(path,'PATCH',{'version':version,'action':'cancelSchedule'},admin)[0]==409
 status,row=request(path,'PATCH',{'version':row['version'],'action':'cancelSchedule'},admin);assert status==200
 assert row['scheduled_at'] is None and row['scheduled_document'] is None
 # Re-scheduling explicitly validates and freezes the current working version.
 assert request(path,'PATCH',{'version':row['version'],'action':'schedule','scheduledAt':future},admin)[0]==400
 status,row=request(path,'PUT',{'version':row['version'],'slug':slug,'document':{**changed,'cover':image['url']}},admin);assert status==200
 status,row=request(path,'PATCH',{'version':row['version'],'action':'schedule','scheduledAt':future},admin);assert status==200
 assert row['scheduled_document']['title']==changed['title']
 print('Scheduling auth, future time, frozen snapshots, stale versions, slug lock and cancellation: PASS')
finally:
 status,current=request(path,client=admin)
 if status==200 and current['published_at'] is None:
  assert request(path,'DELETE',{'version':current['version']},admin)[0]==200
