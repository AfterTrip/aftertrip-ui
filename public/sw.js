const CACHE_NAME = "aftertrip-pwa-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/brand/aftertrip-pwa-icon-192.png",
  "/brand/aftertrip-pwa-icon-512.png",
  "/images/social/aftertrip-share.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin && url.pathname.startsWith("/api/")) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL, { ignoreSearch: true })
      )
    );
    return;
  }

  if (!isSameOrigin) {
    return;
  }

  const cacheableDestinations = new Set(["font", "image", "script", "style"]);

  if (!cacheableDestinations.has(request.destination)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);

      try {
        const response = await fetch(request);

        if (response.ok) {
          cache.put(request, response.clone());
        }

        return response;
      } catch (_error) {
        return cached || Response.error();
      }
    })
  );
});
