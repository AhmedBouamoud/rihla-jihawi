const CACHE_NAME='daftar-ostad-v5-v1';
const ASSETS=[
  './',
  './index.html',
  './app.html',
  './manifest.json',
  './icon.svg',
  './assets/styles.css',
  './src/main.js',
  './src/state.js',
  './src/utils.js',
  './src/data/presets.js',
  './src/data/subject-templates.js',
  './src/modules/storage.js',
  './src/modules/journal.js',
  './src/modules/scheduler.js',
  './src/modules/holidays.js',
  './src/modules/documents.js',
  './src/modules/export.js',
  './src/modules/print.js',
  './src/modules/render.js'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{let cp=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(e.request,cp)).catch(()=>{});return r}).catch(()=>caches.match('./index.html'))));});
