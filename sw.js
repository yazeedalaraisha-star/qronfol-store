const CACHE = 'qronfol-v2';
const STATIC = [
  '/', '/index.html', '/product.html', '/admin.html', '/login.html', '/order-confirmed.html',
  '/css/style.css',
  '/js/products.js', '/js/cart.js', '/js/app.js',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {}))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/')) return;
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok && res.type === 'basic') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => {
      if (url.pathname === '/') return caches.match('/index.html');
      if (url.pathname === '/admin.html') return caches.match('/admin.html');
      if (url.pathname.startsWith('/product.html')) return caches.match('/product.html');
      return new Response('غير متصل', { status: 503 });
    }))
  );
});
