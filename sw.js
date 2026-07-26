const CACHE = "ironlog-v19";
const ASSETS = ["./", "./index.html", "./icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  // wipe every previous cache so app files can never be mixed across versions
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const isAppFile = url.pathname.endsWith("/") ||
                    url.pathname.endsWith("index.html") ||
                    url.pathname.endsWith("data.js") ||
                    url.pathname.endsWith("sw.js");

  // App code: always try the network first so updates land immediately.
  // Cache is only a fallback for going offline.
  e.respondWith(
    fetch(e.request, isAppFile ? { cache: "no-store" } : {})
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(m => m || caches.match("./index.html")))
  );
});
