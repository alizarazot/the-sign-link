/// <reference lib="webworker" />

declare var self: ServiceWorkerGlobalScope;

import * as logging from "pkg/logging";

const log = logging.setDefaultLogger(
  new logging.Logger("Service-Worker", logging.Level.Debug),
);

const pwaCoreAssets = [
  "/",
  "assets/index.js",
  "assets/index.css",
  "icon/icon.svg",
];

const pwaCache = "PWA-The_Sign_Link";

self.addEventListener("install", (e: ExtendableEvent) => {
  log.info("Installing...");

  e.waitUntil(
    caches.open(pwaCache).then((cache) => {
      log.debug("Caching assets:", pwaCoreAssets);
      return cache.addAll(pwaCoreAssets);
    }),
  );
});

self.addEventListener("activate", (_) => {
  log.info("Activated.");
});

const handleFetch = async (request: Request) => {
  log.info("The PWA is fetching resources...");
  log.debug("Request:", request);

  log.info("Searching in cache:", request.url);
  const cache = await caches.open(pwaCache);
  const cacheResponse = await cache.match(request.url);
  log.debug("Cached response:", cacheResponse);

  fetch(request)
    .then((networkResponse) => {
      log.info("Updating cache for:", request.url);
      cache.put(request, networkResponse);
    })
    .catch((err) => {
      log.error("Error fetching resource:", err);
    });

  return cacheResponse || fetch(request.url);
};

self.addEventListener("fetch", (e) => {
  e.respondWith(handleFetch(e.request));
});
