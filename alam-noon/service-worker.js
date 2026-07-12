
const CACHE = 'alam-noon-release-v5';
const ASSETS = [
  "./",
  "./index.html",
  "./station1.html",
  "./station2.html",
  "./station3.html",
  "./station4.html",
  "./station5.html",
  "./station6.html",
  "./station7.html",
  "./spirits.html",
  "./parents.html",
  "./404.html",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./assets/js/voice-map.js",
  "./manifest.json",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/img/city-home.webp",
  "./assets/img/finale-celebration.webp",
  "./assets/img/home-world.webp",
  "./assets/img/social-preview.webp",
  "./assets/img/spirit-b.webp",
  "./assets/img/spirit-d.webp",
  "./assets/img/spirit-f.webp",
  "./assets/img/spirit-m.webp",
  "./assets/img/spirit-n.webp",
  "./assets/img/spirit-r.webp",
  "./assets/img/spirit-s.webp",
  "./assets/img/spirit-w.webp",
  "./assets/img/station1-bakery.webp",
  "./assets/img/station2-enchanted-forest.webp",
  "./assets/img/station2-forest.webp",
  "./assets/img/station3-bridge.webp",
  "./assets/img/station3-musical-path.webp",
  "./assets/img/station4-cave.webp",
  "./assets/img/station5-celestial-palace.webp",
  "./assets/img/station5-palace.webp",
  "./assets/img/station6-river.webp",
  "./assets/img/station7-workshop.webp",
  "./assets/audio/build-bab.mp3",
  "./assets/audio/build-mawz.mp3",
  "./assets/audio/build-nur.mp3",
  "./assets/audio/done1.mp3",
  "./assets/audio/done2.mp3",
  "./assets/audio/done3.mp3",
  "./assets/audio/done4.mp3",
  "./assets/audio/done5.mp3",
  "./assets/audio/done6.mp3",
  "./assets/audio/done7.mp3",
  "./assets/audio/fix5-balloon.mp3",
  "./assets/audio/fix5-mawz.mp3",
  "./assets/audio/fix5-milaaqa.mp3",
  "./assets/audio/fix5-najma.mp3",
  "./assets/audio/fix5-nar.mp3",
  "./assets/audio/hunt-b.mp3",
  "./assets/audio/hunt-m.mp3",
  "./assets/audio/hunt-s.mp3",
  "./assets/audio/intro-home.mp3",
  "./assets/audio/intro-parents.mp3",
  "./assets/audio/intro-spirits.mp3",
  "./assets/audio/intro-station1.mp3",
  "./assets/audio/intro-station2.mp3",
  "./assets/audio/intro-station3.mp3",
  "./assets/audio/intro-station4.mp3",
  "./assets/audio/intro-station5.mp3",
  "./assets/audio/intro-station6.mp3",
  "./assets/audio/intro-station7.mp3",
  "./assets/audio/l-aa.mp3",
  "./assets/audio/l-b.mp3",
  "./assets/audio/l-ba.mp3",
  "./assets/audio/l-bu.mp3",
  "./assets/audio/l-l.mp3",
  "./assets/audio/l-m.mp3",
  "./assets/audio/l-ma.mp3",
  "./assets/audio/l-na.mp3",
  "./assets/audio/l-ra.mp3",
  "./assets/audio/l-s.mp3",
  "./assets/audio/l-ta.mp3",
  "./assets/audio/l-wa.mp3",
  "./assets/audio/l-za.mp3",
  "./assets/audio/made-bab.mp3",
  "./assets/audio/made-mawz.mp3",
  "./assets/audio/made-nur.mp3",
  "./assets/audio/more4.mp3",
  "./assets/audio/no1-bab.mp3",
  "./assets/audio/no1-samaka.mp3",
  "./assets/audio/no1-tuffaha.mp3",
  "./assets/audio/no2.mp3",
  "./assets/audio/no3.mp3",
  "./assets/audio/no6.mp3",
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
  "./assets/audio/sp-b.mp3",
  "./assets/audio/sp-locked.mp3",
  "./assets/audio/sp-m.mp3",
  "./assets/audio/sp-n.mp3",
  "./assets/audio/sp-r.mp3",
  "./assets/audio/sp-s.mp3",
  "./assets/audio/sp-w.mp3",
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
