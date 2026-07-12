
const CACHE = 'alam-noon-release-v3';
const ASSETS = [
  "./",
  "./index.html",
  "./station1.html",
  "./station2.html",
  "./station3.html",
  "./station4.html",
  "./station5.html",
  "./parents.html",
  "./404.html",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./manifest.json",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/img/home-world.webp",
  "./assets/img/station1-bakery.webp",
  "./assets/img/station2-enchanted-forest.webp",
  "./assets/img/station3-musical-path.webp",
  "./assets/img/station4-cave.webp",
  "./assets/img/station5-celestial-palace.webp",
  "./assets/img/finale-celebration.webp",
  "./assets/img/social-preview.webp"
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if(response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached || caches.match('./404.html'));
      return cached || network;
    })
  );
});
