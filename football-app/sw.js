const V = 'fc-v4';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'data.js', 'extra.js', 'leagues-data.js', 'fullnames.js', 'league.js', 'profile.js', 'manifest.json', 'icon.svg', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const ok = r => r && (r.ok || r.type === 'opaque');
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // API JSON: 네트워크 우선, 오프라인이면 마지막 응답
  if (url.hostname.endsWith('thesportsdb.com')) {
    e.respondWith(fetch(req).then(r => { if (ok(r)) { const c = r.clone(); caches.open(V).then(x => x.put(req, c)); } return r; })
      .catch(() => caches.match(req)));
    return;
  }
  // 앱 파일·이미지: 캐시 먼저 보여주고 뒤에서 갱신
  e.respondWith(caches.match(req, {ignoreSearch: false}).then(hit => {
    const net = fetch(req).then(r => { if (ok(r)) { const c = r.clone(); caches.open(V).then(x => x.put(req, c)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
