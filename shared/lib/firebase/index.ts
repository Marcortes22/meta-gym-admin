// lib/firebase/index.ts
/**
 * Firebase SDK exports
 * Centralized export file for Firebase functionality
 */

// Client SDK
export { app, auth, db, storage, firebase } from './client';

// Configuration
export { getFirebaseConfig } from './config';
export type { FirebaseConfig } from './config';

// Admin SDK (server-side only)
export {
  initializeFirebaseAdmin,
  getAdminAuth,
  getAdminFirestore,
  getAdminStorage,
  admin,
} from './admin';
