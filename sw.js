const CACHE_NAME = 'rihla-mahali-gold-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/panorama.webp',
  './assets/ibn-battuta.webp',
  './assets/treasure-map.webp'
];

/* خطوط Google — نُخزّنها عند أول طلب (cache-first) */
const FONT_CACHE = 'rihla-mahali-fonts-v1';
const FONT_ORIGINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== FONT_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  /* لا نعترض طلبات POST */
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* خطوط Google — cache-first مع fallback للشبكة */
  if (FONT_ORIGINS.some(o => url.origin === o || req.url.startsWith(o))) {
    event.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(req).then(cached => {
          if (cached) return cached;
          return fetch(req).then(res => {
            cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  /* التنقل بين الصفحات — network-first مع fallback إلى index.html */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  /* باقي الأصول — cache-first */
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
