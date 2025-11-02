import { db } from '@/shared/lib/firebase/client';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  QueryConstraint,
} from 'firebase/firestore';
import { GymFilters } from '../types/gym.types';

const GYMS_COLLECTION = 'gyms';

/**
 * Query para obtener todos los gimnasios con filtros opcionales
 */
export async function getGyms(filters?: GymFilters) {
  const gymsRef = collection(db, GYMS_COLLECTION);
  const constraints: QueryConstraint[] = [];

  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }

  if (filters?.city) {
    constraints.push(where('city', '==', filters.city));
  }

  const q = query(gymsRef, ...constraints);
  return await getDocs(q);
}

/**
 * Query para obtener un gimnasio por ID
 */
export async function getGymById(gymId: string) {
  const gymRef = doc(db, GYMS_COLLECTION, gymId);
  return await getDoc(gymRef);
}
