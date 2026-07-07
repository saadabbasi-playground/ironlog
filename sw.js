const CACHE = "ironlog-v4";
const ASSETS = ["./", "./index.html", "./data.js", "./icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).then(res => {
      // never cache errors (a cached 404 for data.js would brick the app offline)
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      }
      return res;
    }).catch(() => caches.match(e.request).then(m => m || caches.match("./index.html")))
  );
});