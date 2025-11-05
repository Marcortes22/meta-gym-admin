import { db } from '@/shared/lib/firebase/client';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  DocumentData,
  QuerySnapshot 
} from 'firebase/firestore';
const GLOBAL_USERS_COLLECTION = 'global_users';
export async function getUserByEmail(email: string): Promise<QuerySnapshot<DocumentData>> {
  const usersRef = collection(db, GLOBAL_USERS_COLLECTION);
  const q = query(usersRef, where('email', '==', email));
  
  return await getDocs(q);
}
export async function getAllAdminUsers(): Promise<QuerySnapshot<DocumentData>> {
  const usersRef = collection(db, GLOBAL_USERS_COLLECTION);
  return await getDocs(usersRef);
}
