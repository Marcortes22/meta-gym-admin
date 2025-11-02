// lib/firebase/session.ts
'use client';

import { auth } from './client';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Firebase Session Management
 * Sets a session cookie when user authenticates
 */
export function initializeSessionManagement() {
  if (typeof window === 'undefined') return;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get ID token and set it as a cookie
      const token = await user.getIdToken();
      
      // Set session cookie
      document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
    } else {
      // Clear session cookie
      document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  });
}
