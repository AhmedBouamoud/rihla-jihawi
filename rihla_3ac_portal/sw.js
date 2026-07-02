const CACHE='rihla-3ac-portal-v3';
const ASSETS=['./','./index.html','./history.html','./geography.html','./citizenship.html','./local-exam.html','./teacher.html','./style.css','./app.js','./manifest.webmanifest','./icon.svg',
'./lessons/capitalisme/index.html','./lessons/capitalisme/map.html','./lessons/capitalisme/lesson1.html','./lessons/capitalisme/graph.html','./lessons/capitalisme/banks.html','./lessons/capitalisme/concentration.html','./lessons/capitalisme/society.html','./lessons/capitalisme/documents.html','./lessons/capitalisme/final.html','./lessons/capitalisme/certificate.html','./lessons/capitalisme/report.html','./lessons/capitalisme/style.css','./lessons/capitalisme/app.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{})));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
