// GitHub Pages 用：相対パス前提・キャッシュ名を変えると更新がかかります
const STATIC_CACHE = 'static-v4';
const STATIC_ASSETS = [
  '.',                 // ルート
  'index.html',
  'manifest.webmanifest',
  'icons/icon.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@phosphor-icons/web@2.0.3/dist/phosphor.js'
];

// 初回インストール：必要ファイルをキャッシュ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then((c) => c.addAll(STATIC_ASSETS))
  );
});

// 古いキャッシュを掃除
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))
    )
  );
});

// ネットワーク優先 → キャッシュ fallback
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
