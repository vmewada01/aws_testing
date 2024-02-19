const CacheName = "v1";

const catchAssest = ["index.html", "about.html", "main.js"];

// Call Install Event
self.addEventListener("install", (e) => {
  console.log("Service worker installed");
  e.waitUntil(
    caches
      .open(CacheName)
      .then((cache) => {
        console.log("service worker :caching files");
        cache.addAll(catchAssest);
      })
      .then(() => self.skipWaiting())
  );
});

/// Call Activate Event
self.addEventListener("activate", (e) => {
  console.log("Service worker : Activated");
  /// remove undwanted caches entries
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CacheName) {
            console.log("Service worker : Removing old cache");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  console.log("service worker : fetching");
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
