// lib/firebase/admin.ts
import * as admin from 'firebase-admin';

interface AdminConfig {
  projectId: string;
  clientEmail?: string;
  privateKey?: string;
}

let adminApp: admin.app.App;

/**
 * Initialize Firebase Admin SDK
 * For server-side operations only
 */
export function initializeFirebaseAdmin(): admin.app.App {
  if (adminApp) {
    return adminApp;
  }

  try {
    const config: AdminConfig = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    if (!config.projectId) {
      throw new Error('Missing FIREBASE_ADMIN_PROJECT_ID');
    }

    // Initialize with credentials if available, otherwise use default credentials
    if (config.clientEmail && config.privateKey) {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey,
        }),
        projectId: config.projectId,
      });
    } else {
      // Use default credentials (useful in Cloud environments)
      adminApp = admin.initializeApp({
        projectId: config.projectId,
      });
    }

    return adminApp;
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      adminApp = admin.app();
      return adminApp;
    }
    throw error;
  }
}

// Export admin instances
export const getAdminAuth = () => {
  if (!adminApp) initializeFirebaseAdmin();
  return admin.auth(adminApp);
};

export const getAdminFirestore = () => {
  if (!adminApp) initializeFirebaseAdmin();
  return admin.firestore(adminApp);
};

export const getAdminStorage = () => {
  if (!adminApp) initializeFirebaseAdmin();
  return admin.storage(adminApp);
};

export { admin };
