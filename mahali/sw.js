const CACHE_NAME = 'rihla-mahali-review-v9';
const FONT_CACHE = 'rihla-mahali-fonts-v1';
const CACHE_PREFIX = 'rihla-mahali-';
const APP_SHELL = [
  './', './index.html', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png',
  './assets/panorama.webp', './assets/ibn-battuta.webp', './assets/treasure-map.webp'
];
const FONT_ORIGINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME && k !== FONT_CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const scope = new URL(self.registration.scope);
  const isApp = url.origin === scope.origin && url.pathname.startsWith(scope.pathname);
  const isFont = FONT_ORIGINS.includes(url.origin);
  if (!isApp && !isFont) return;
  if (req.mode === 'navigate') {
    const isShell = url.pathname === scope.pathname || url.pathname === scope.pathname + 'index.html';
    if (!isShell) return;
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(req);
        if (response.ok) {
          // Refresh the canonical shell too, even when the entry URL has a PWA query.
          const copy=response.clone();
          event.waitUntil(cache.put(new URL('index.html', scope).href, copy).catch(() => {}));
          return response;
        }
        return await cache.match(new URL('index.html', scope).href) || response;
      } catch (e) {
        return await cache.match(new URL('index.html', scope).href) || new Response('الموقع غير متاح دون اتصال. افتحه مرة عند توفر الإنترنت.', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(isFont ? FONT_CACHE : CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) return cached;
    const response = await fetch(req);
    if (response.ok || (isFont && response.type === 'opaque')) {
      event.waitUntil(cache.put(req, response.clone()).catch(() => {}));
    }
    return response;
  })());
});
