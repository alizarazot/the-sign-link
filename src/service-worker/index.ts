export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    console.info("Service Workers are not supported in this browser.");
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      {
        scope: "/",
      },
    );

    if (registration.installing) {
      console.info("[Service-Worker]: Installing...");
    } else if (registration.waiting) {
      console.info("[Service-Worker]: Waiting...");
    } else if (registration.active) {
      console.info("[Service-Worker]: Active!");
    }
  } catch (err) {
    console.info("[Service-Worker]: Registration failed with:", err);
  }
};
