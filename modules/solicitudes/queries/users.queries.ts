import { db } from '@/shared/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';

const GLOBAL_USERS_COLLECTION = 'global_users';

/**
 * Obtiene el nombre completo de un usuario por su UID
 */
export async function getUserNameByUid(uid: string): Promise<string | null> {
  try {
    const userRef = doc(db, GLOBAL_USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    const userData = userSnap.data();
    return userData.name || uid;
  } catch (error) {
    return null;
  }
}
