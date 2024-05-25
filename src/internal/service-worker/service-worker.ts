/// <reference lib="webworker" />

declare var self: ServiceWorkerGlobalScope;

const pwaCoreAssets = [
  "/",
  "assets/index.js",
  "assets/index.css",
  "icon/icon.svg",
];

const pwaCache = "PWA-The_Sign_Link";

self.addEventListener("install", (e: ExtendableEvent) => {
  console.info("Installing...");

  e.waitUntil(
    caches.open(pwaCache).then((cache) => {
      console.debug("Caching assets:", pwaCoreAssets);
      return cache.addAll(pwaCoreAssets);
    }),
  );
});

self.addEventListener("activate", (_) => {
  console.info("Activated.");
});

const handleFetch = async (request: Request) => {
  console.info("The PWA is fetching resources...");
  console.debug("Request:", request);

  console.info("Searching in cache:", request.url);
  const cache = await caches.open(pwaCache);
  const cacheResponse = await cache.match(request.url);
  console.debug("Cached response:", cacheResponse);

  fetch(request)
    .then((networkResponse) => {
      console.info("Updating cache for:", request.url);
      cache.put(request, networkResponse);
    })
    .catch((err) => {
      console.error("Error fetching resource:", err);
    });

  return cacheResponse || fetch(request.url);
};

self.addEventListener("fetch", (e) => {
  e.respondWith(handleFetch(e.request));
});
