const CACHE_NAME = 'empreinte24-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/logo-pro.png',
  './assets/logo-empreinte24.svg',
  './assets/exterior-night-pro.png',
  './assets/night-ambiance.png',
  './assets/workspace-laptop.png',
  './assets/espresso-closeup.png',
  './assets/exterior-corner.jpg',
  './assets/interior-premium.jpg',
  './assets/interior-chairs.jpg',
  './assets/interior-seating.jpg',
  './assets/match-evening.jpg',
  './assets/match-audience.jpg',
  './assets/real-exterior-night.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
