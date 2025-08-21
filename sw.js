 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/sw.js b/sw.js
index 917392819864e7d91c596213eecbe994a3c1149f..1ee5e91816beaf9c51d383c843936a7ed0d4d85b 100644
--- a/sw.js
+++ b/sw.js
@@ -1,27 +1,27 @@
 // GitHub Pages 用：相対パス前提・キャッシュ名は変更すると更新がかかります
-const STATIC_CACHE = 'static-v2';
+const STATIC_CACHE = 'static-v3';
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
 
 
EOF
)
