/**
 * Firebase for /studio only. Nothing outside src/studio imports this, so the
 * SDK lands in the lazily loaded Studio chunk and never reaches visitors.
 *
 * Each deploy context points at its own project through these env vars
 * (dev project for branch deploys and local work, prod for production).
 * The web config isn't secret — Firestore rules are what protect the data.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, type Firestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

const envNames: Record<keyof typeof config, string> = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  appId: 'VITE_FIREBASE_APP_ID',
};

/** Env vars this build is missing; Studio refuses to start until it's empty. */
export const missingConfig = (Object.keys(config) as Array<keyof typeof config>)
  .filter((k) => !config[k])
  .map((k) => envNames[k]);

export const projectId = config.projectId ?? '';

let instance: { app: FirebaseApp; auth: Auth; db: Firestore } | undefined;

export function firebase() {
  if (!instance) {
    const app = initializeApp(config);
    instance = {
      app,
      auth: getAuth(app),
      // Optional fields in the content types are often `undefined`; Firestore
      // rejects those unless told to drop them.
      db: initializeFirestore(app, { ignoreUndefinedProperties: true }),
    };
  }
  return instance;
}
