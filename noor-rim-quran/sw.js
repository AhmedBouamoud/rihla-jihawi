const CACHE = 'noor-rim-hadiya-v3';
const AUDIO_CACHE = 'noor-rim-audio-v1';
const ASSETS = ['./','./index.html','./style.css','./app.js','./manifest.webmanifest',
  './assets/icons/icon-192.svg','./assets/icons/icon-512.svg',
  './assets/rim/rim-hero.jpg','./assets/rim/rim-reward.jpg','./assets/rim/rim-family.jpg'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => e.waitUntil(
  Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== AUDIO_CACHE).map(k => caches.delete(k)))),
    self.clients.claim()
  ])
));

function isAyahAudio(url){
  return url.includes('/assets/audio/') || url.includes('everyayah.com');
}

// تلاوة الآية (محلية أو عبر الإنترنت) تُحفظ بعد أول سماع، فتشتغل ريم بلا إنترنت لاحقاً.
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if(isAyahAudio(url)){
    e.respondWith(
      caches.open(AUDIO_CACHE).then(async cache => {
        const cached = await cache.match(e.request);
        if(cached) return cached;
        try{
          const res = await fetch(e.request);
          if(res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone());
          return res;
        }catch(err){
          return cached || Response.error();
        }
      })
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
