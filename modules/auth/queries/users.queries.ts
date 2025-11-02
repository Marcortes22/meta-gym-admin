import { db } from '@/shared/lib/firebase/client';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  DocumentData,
  QuerySnapshot 
} from 'firebase/firestore';

/**
 * Colección de global_users en Firestore
 */
const GLOBAL_USERS_COLLECTION = 'global_users';

/**
 * Query para verificar si un usuario existe por email
 */
export async function getUserByEmail(email: string): Promise<QuerySnapshot<DocumentData>> {
  const usersRef = collection(db, GLOBAL_USERS_COLLECTION);
  const q = query(usersRef, where('email', '==', email));
  
  return await getDocs(q);
}

/**
 * Query para obtener todos los usuarios administradores
 */
export async function getAllAdminUsers(): Promise<QuerySnapshot<DocumentData>> {
  const usersRef = collection(db, GLOBAL_USERS_COLLECTION);
  
  return await getDocs(usersRef);
}
