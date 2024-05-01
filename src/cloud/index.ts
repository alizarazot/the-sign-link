import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithRedirect,
} from "firebase/auth";

import { firebaseConfig } from "./firebase-config.ts";

import { getDefaultLogger } from "pkg/logging";

const log = getDefaultLogger().extend("Firebase Auth");

export const firebaseApp = initializeApp(firebaseConfig);

export const signIn = () => {
  const auth = getAuth(firebaseApp);
  auth.useDeviceLanguage();

  log.info("Signing in using Google...");
  signInWithRedirect(auth, new GoogleAuthProvider()).catch((err) => {
    log.error("Error signing in:", err);
  });
};

export const getCurrentUser = () => {
  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      log.info("User is signed in...");
      log.info(user.displayName, user.email);
    } else {
      log.info("User is signed out...");
    }
  });
};
