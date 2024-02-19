// const CacheName = "v1";

// const catchAssest = ["index.html", "about.html", "main.js"];

// // Call Install Event
// self.addEventListener("install", (e) => {
//   console.log("Service worker installed");
// });

// /// Call Activate Event
// self.addEventListener("activate", (e) => {
//   console.log("Service worker : Activated");
//   /// remove undwanted caches entries
//   e.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CacheName) {
//             console.log("Service worker : Removing old cache");
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// self.addEventListener("fetch", (e) => {
//   console.log("service worker : fetching");
//   e.respondWith(
//     fetch(e.request)
//       .then((res) => {
//         ///make copy clone of the repsonse
//         const resClone = res.clone();

//         caches.open(CacheName).then((cache) => {
//           cache.put(e.request, resClone);
//         });
//         return res;
//       })
//       .catch((err) => {
//         console.log("Error in catches");
//         return caches.match(e.request).then((res) => res);
//       })
//   );
// });
