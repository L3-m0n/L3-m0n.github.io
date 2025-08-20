const STATIC_CACHE = 'static-v1';
const STATIC_ASSETS = [
  '.', 'index.html', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@phosphor-icons/web@2.0.3/dist/phosphor.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(STATIC_CACHE).then(c => c.addAll(STATIC_ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== STATIC_CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(r => {
        caches.open(STATIC_CACHE).then(c => c.put(e.request, r.clone()));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      caches.open(STATIC_CACHE).then(c => c.put(e.request, r.clone()));
      return r;
    }))
  );
});
