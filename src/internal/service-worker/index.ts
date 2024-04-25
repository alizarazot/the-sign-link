import { getDefaultLogger } from "pkg/logging";

export const registerServiceWorker = async () => {
  const log = getDefaultLogger().extend("Service-Worker-Installer");

  if (!("serviceWorker" in navigator)) {
    log.info("Service Workers are not supported in this browser.");
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      {
        scope: "/",
      },
    );

    if (registration.installing) {
      log.info("Installing...");
    } else if (registration.waiting) {
      log.info("Waiting...");
    } else if (registration.active) {
      log.info("Service Worker active.");
    }
  } catch (err) {
    log.info("Registration failed with:", err);
  }
};
