const CACHE = 'noor-rim-hadiya-v15';
const AUDIO_CACHE = 'noor-rim-audio-v3';
const ASSETS = ['./','./index.html','./style.css','./app.js','./rim-audio-hotfix.js','./audio-manager.js','./manifest.webmanifest',
  './assets/icons/icon-192.svg','./assets/icons/icon-512.svg',
  './assets/rim/rim-reward.jpg',
  './assets/rim-v2/hero.webp','./assets/rim-v2/hero-wide.webp','./assets/rim-v2/reward.webp',
  './assets/rim-v2/album-header.webp','./assets/rim-v2/surah-complete.webp',
  './assets/rim-v2/first-voice.webp','./assets/rim-v2/first-ayah.webp',
  './assets/rim-v2/special-family.webp','./assets/rim-v2/listening.webp',
  './assets/rim-v2/prayer-room.webp','./assets/rim-v2/pride-embrace.webp'];

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

function isQuranAudio(url){
  return url.includes('/assets/audio/') || url.includes('/assets/voice/')
    || url.includes('everyayah.com') || url.includes('verses.quran.com') || url.includes('download.quranicaudio.com');
}

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  const url = e.request.url;

  if(isQuranAudio(url)){
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
