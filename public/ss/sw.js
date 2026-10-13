// Service worker: guarda a "casca" do app para abrir rápido e funcionar como
// app instalado. Os dados (/api) nunca vão para o cache.
const VERSAO = 'halo-ss-v2';
const CASCA = ['/ss/', '/ss/app.css', '/ss/app.js', '/ss/manifest.webmanifest',
  '/ss/icons/logo.svg', '/ss/icons/icon-192.png', '/ss/icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(CASCA)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Rede primeiro (sempre a versão mais nova); cache só quando estiver sem sinal.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith('/ss/') || url.pathname.startsWith('/ss/api/')) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r.ok) { const copia = r.clone(); caches.open(VERSAO).then((c) => c.put(e.request, copia)); }
        return r;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('/ss/'))),
  );
});
