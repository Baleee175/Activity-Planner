/* =========================
   SERVICE WORKER
   Smart Activity Planner
   ========================= */

const CACHE_NAME = "sap-cache-v1";

/* File yang di-cache (sesuaikan struktur project kamu) */
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/assets/icon-192.png",
  "/assets/icon-512.png"
];

/* =========================
   INSTALL
========================= */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* =========================
   ACTIVATE
========================= */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

/* =========================
   FETCH (Offline support)
========================= */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});

/* =========================
   PUSH NOTIFICATION
========================= */
self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data.json();
  } catch {
    data = {
      title: "⏰ Deadline Mendekat",
      body: "Ada aktivitas yang hampir deadline"
    };
  }

  const options = {
    body: data.body,
    icon: "/assets/icon-192.png",
    badge: "/assets/icon-192.png",
    tag: data.tag || "deadline",
    renotify: false,
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/* =========================
   NOTIFICATION CLICK
========================= */
self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});

/* =========================
   NOTIFICATION CLOSE
========================= */
self.addEventListener("notificationclose", event => {
  // opsional: analytics / logging
});
