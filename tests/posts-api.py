"""Blog lifecycle and security on isolated localhost test stack only."""
from pathlib import Path
import hashlib
exec(Path('tests/selfhost-integration.py').read_text().split('status,data=request(\'/api/health\')')[0])
assert BASE == 'http://127.0.0.1:3110'
for filename,digest in json.loads(Path('tests/legacy-posts.json').read_text()).items():
    assert hashlib.sha256(Path('public',filename).read_bytes()).hexdigest()==digest,filename
assert request('/api/admin/posts')[0]==401
csrf=request('/api/auth/csrf',client=admin)[1]['csrfToken']
body=urllib.parse.urlencode({'csrfToken':csrf,'email':values['ADMIN_EMAIL'],'password':values['ADMIN_PASSWORD'],'callbackUrl':BASE+'/admin','json':'true'}).encode()
assert request('/api/auth/callback/credentials','POST',body,admin,headers={'Content-Type':'application/x-www-form-urlencoded'})[0]==200
assert request('/api/admin/posts','POST',{},admin,origin='https://invalid.test')[0]==403
identifier=str(uuid.uuid4());slug='article-test-'+identifier
empty={'title':'Проверка статьи','excerpt':'','author':'AsiaMotors','cover':'','coverAlt':'','tags':[],'seoTitle':'','seoDescription':'','showCta':True,'content':{'type':'doc','content':[{'type':'paragraph'}]}}
payload={'id':identifier,'slug':slug,'document':empty}
status,row=request('/api/admin/posts','POST',payload,admin);assert status==201,(status,row)
assert request('/api/admin/posts','POST',payload,admin)[1]['id']==identifier
path='/api/admin/posts/'+identifier
assert request('/blog/'+slug)[0]==404
assert request(path,'PATCH',{'version':row['version'],'action':'publish'},admin)[0]==400
assert request(path,'PUT',{'slug':slug,'document':empty,'version':row['version']+1},admin)[0]==409
bad={**empty,'content':{'type':'doc','content':[{'type':'paragraph','content':[{'type':'text','text':'test','marks':[{'type':'link','attrs':{'href':'javascript:alert(1)'}}]}]}]}}
assert request(path,'PUT',{'slug':slug,'document':bad,'version':row['version']},admin)[0]==400
assert request(path,'PUT',b'x'*(1024*1024+1),admin,headers={'Content-Type':'application/json'})[0]==413
assert request('/api/admin/posts','POST',{**payload,'id':str(uuid.uuid4()),'slug':'byd-song-pro'},admin)[0]==409
# Reuse an uploaded real PNG from the existing upload regression fixture generator.
source=Path('tests/selfhost-integration.py').read_text()
exec(source[source.index('import struct,zlib'):source.index("status,data=upload(png)")])
status,image=upload(png);assert status==201
full={**empty,'excerpt':'Обзор автомобиля из Китая и условий поставки.','cover':image['url'],'coverAlt':'Автомобиль','content':{'type':'doc','content':[{'type':'paragraph','content':[{'type':'text','text':'Сравнение автомобилей из Китая под заказ и в наличии. Проверяем сроки, комплектации и стоимость.'}]}]}}
status,row=request(path,'PUT',{'slug':slug,'document':full,'version':row['version']},admin);assert status==200,(status,row)
status,row=request(path,'PATCH',{'version':row['version'],'action':'publish'},admin);assert status==200,(status,row)
status,html=request('/blog/'+slug)
assert status==200
html=html.decode()
assert html.count('<h1')==1
assert 'href="https://asiamotors.su/blog/'+slug+'"' in html
assert 'application/ld+json' in html and 'datePublished' in html
assert slug in request('/sitemap.xml')[1].decode()
assert request(path,'DELETE',{'version':row['version']},admin)[0]==409
oldversion=row['version'];changed={**full,'title':'Неопубликованная правка'}
status,row=request(path,'PUT',{'slug':slug,'document':changed,'version':oldversion},admin);assert status==200
assert 'Неопубликованная правка' not in request('/blog/'+slug)[1].decode()
assert request(path,'PATCH',{'version':oldversion,'action':'hide'},admin)[0]==409
status,row=request(path,'PATCH',{'version':row['version'],'action':'hide'},admin);assert status==200
assert request('/blog/'+slug)[0]==404
assert slug not in request('/sitemap.xml')[1].decode()
status,row=request(path,'PATCH',{'version':row['version'],'action':'restore'},admin);assert status==200
assert 'Неопубликованная правка' not in request('/blog/'+slug)[1].decode()
assert request(path,'PUT',{'slug':slug+'-renamed','document':changed,'version':row['version']},admin)[0]==409
# Leave no public synthetic article; published records are deliberately non-deletable.
status,row=request(path,'PATCH',{'version':row['version'],'action':'hide'},admin);assert status==200
other=str(uuid.uuid4())
status,draft=request('/api/admin/posts','POST',{'id':other,'slug':'draft-'+other,'document':empty},admin);assert status==201
assert request('/api/admin/posts/'+other,'DELETE',{'version':draft['version']},admin)[0]==200
print('Archive fingerprints, authentication, unsafe content, draft/publish snapshots, version conflicts, immutable URLs, hide/restore and sitemap: PASS')
