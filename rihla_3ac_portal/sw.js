const CACHE='rihla-3ac-portal-v1';
const ASSETS=['./','./index.html','./history.html','./geography.html','./citizenship.html','./regional-exam.html','./teacher.html','./style.css','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{})));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
