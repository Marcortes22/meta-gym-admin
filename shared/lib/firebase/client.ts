// lib/firebase/client.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFirebaseConfig } from './config';

/**
 * Initialize Firebase client SDK
 * Uses singleton pattern to ensure only one instance exists
 */
function initializeFirebase() {
  if (getApps().length === 0) {
    const config = getFirebaseConfig();
    const app = initializeApp(config);
    return {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      storage: getStorage(app),
    };
  } else {
    const app = getApps()[0];
    return {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      storage: getStorage(app),
    };
  }
}

// Initialize on import
const { app, auth, db, storage } = initializeFirebase();

// Export instances
export { app, auth, db, storage };

// Export Firebase app for direct access
export const firebase = app;

// Default export
export default app;
