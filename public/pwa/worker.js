/* Only neutral, explicitly listed files enter CacheStorage. Never cache runtime responses. */
const CACHE = 'asiamotors-pwa-__BUILD_ID__'
const OFFLINE = ['/pwa/offline.html', '/pwa/manager-offline.html']
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(OFFLINE)))
})
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('asiamotors-pwa-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()))
})
self.addEventListener('message', event => {
 if(event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting()
})
self.addEventListener('fetch', event => {
 const request = event.request
 if(request.method !== 'GET' || request.mode !== 'navigate') return
 const url = new URL(request.url)
 if(url.origin !== self.location.origin) return
 // Let browser and server handle API/auth/RSC/prefetch without interception.
 if(url.pathname.startsWith('/api/') || request.headers.get('RSC') === '1' || url.searchParams.has('_rsc')) return
 event.respondWith(fetch(request, {cache: 'no-store'}).catch(async () => {
  const manager = url.pathname === '/admin' || url.pathname.startsWith('/admin/') || url.pathname.startsWith('/auth/')
  return (await (await caches.open(CACHE)).match(manager ? OFFLINE[1] : OFFLINE[0])) || new Response('Нет подключения к интернету',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})
 }))
})
