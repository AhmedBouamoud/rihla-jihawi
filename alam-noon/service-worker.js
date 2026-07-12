
const CACHE = 'alam-noon-release-v4';
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
  "./assets/img/social-preview.webp",
  "./assets/js/voice-map.js",
  "./assets/audio/done1.mp3",
  "./assets/audio/done2.mp3",
  "./assets/audio/done3.mp3",
  "./assets/audio/done4.mp3",
  "./assets/audio/done5.mp3",
  "./assets/audio/fix5-balloon.mp3",
  "./assets/audio/fix5-mawz.mp3",
  "./assets/audio/fix5-milaaqa.mp3",
  "./assets/audio/fix5-najma.mp3",
  "./assets/audio/fix5-nar.mp3",
  "./assets/audio/intro-home.mp3",
  "./assets/audio/intro-parents.mp3",
  "./assets/audio/intro-station1.mp3",
  "./assets/audio/intro-station2.mp3",
  "./assets/audio/intro-station3.mp3",
  "./assets/audio/intro-station4.mp3",
  "./assets/audio/intro-station5.mp3",
  "./assets/audio/l-b.mp3",
  "./assets/audio/l-ba.mp3",
  "./assets/audio/l-bu.mp3",
  "./assets/audio/l-l.mp3",
  "./assets/audio/l-m.mp3",
  "./assets/audio/l-ma.mp3",
  "./assets/audio/l-s.mp3",
  "./assets/audio/more4.mp3",
  "./assets/audio/no1-bab.mp3",
  "./assets/audio/no1-samaka.mp3",
  "./assets/audio/no1-tuffaha.mp3",
  "./assets/audio/no2.mp3",
  "./assets/audio/no3.mp3",
  "./assets/audio/ok1-maa.mp3",
  "./assets/audio/ok1-mawz.mp3",
  "./assets/audio/ok1-milaaqa.mp3",
  "./assets/audio/ok5-balloon.mp3",
  "./assets/audio/ok5-mawz.mp3",
  "./assets/audio/ok5-milaaqa.mp3",
  "./assets/audio/ok5-najma.mp3",
  "./assets/audio/ok5-nar.mp3",
  "./assets/audio/q-b.mp3",
  "./assets/audio/q-m.mp3",
  "./assets/audio/q-n.mp3",
  "./assets/audio/wait3.mp3",
  "./assets/audio/word-bab.mp3",
  "./assets/audio/word-balloon.mp3",
  "./assets/audio/word-maa.mp3",
  "./assets/audio/word-mawz.mp3",
  "./assets/audio/word-milaaqa.mp3",
  "./assets/audio/word-najma.mp3",
  "./assets/audio/word-nar.mp3",
  "./assets/audio/word-samaka.mp3",
  "./assets/audio/word-tuffaha.mp3"
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
