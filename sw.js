// GitHub Pages 用：相対パス前提・キャッシュ名は変更すると更新がかかります
const STATIC_CACHE = 'static-v2';
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

// 取得戦略：
// ・ページ本体(HTML)は「ネット優先→失敗ならキャッシュ」
// ・その他(画像/JS/CSS等)は「キャッシュ優先→なければネット」
self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const copy = r.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(e.request, copy));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((r) => {
        const copy = r.clone();
        caches.open(STATIC_CACHE).then((c) => c.put(e.request, copy));
        return r;
      });
    })
  );
});
