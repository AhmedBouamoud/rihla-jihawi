const CACHE='capitalisme-3ac-v2-report';
const ASSETS=['./','index.html','map.html','lesson1.html','graph.html','banks.html','concentration.html','society.html','documents.html','final.html','certificate.html','report.html','style.css','app.js','manifest.webmanifest','icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
