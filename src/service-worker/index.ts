const preffix = "[Service-Worker-Installer]";

export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    console.log(
      `${preffix}: Service Workers are not supported in this browser.`,
    );
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      {
        scope: "/",
      },
    );

    if (registration.installing) {
      console.log(`${preffix}: Installing...`);
    } else if (registration.waiting) {
      console.log(`${preffix}: Installed.`);
      console.log(`${preffix}: Waiting...`);
    } else if (registration.active) {
      console.log(`${preffix}: Service Worker active.`);
    }
  } catch (err) {
    console.log(`${preffix}: Registration failed with: ${err}`);
  }
};
