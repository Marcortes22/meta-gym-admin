import { db } from '@/shared/lib/firebase/client';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { GymRequest, GymRequestFilters } from '@/shared/types';


const GYM_REQUESTS_COLLECTION = 'register_requests';

/**
 * Convierte un documento a GymRequest
 */
function mapDocToGymRequest(doc: DocumentData): GymRequest {
  const data = doc.data();
  
  return {
    id: doc.id,
    gym_name: data.gym_name || '',
    gym_phone: data.gym_phone || '',
    gym_address: data.gym_address || '',
    company_name: data.company_name || '',
    name: data.name || data.admin_name || '', // Fallback
    admin_name: data.admin_name || data.name || '',
    admin_surname1: data.admin_surname1 || '',
    admin_surname2: data.admin_surname2 || '',
    admin_phone: data.admin_phone || '',
    email: data.email || '',
    requested_plan: data.requested_plan || 'basic_plan',
    state: data.state || 'pending',
    date: data.date?.toDate?.() || new Date(),
    createdAt: data.createdAt?.toDate?.() || data.date?.toDate?.() || new Date(),
    reviewedBy: data.reviewedBy,
    reviewedAt: data.reviewedAt?.toDate?.(),
    rejectionReason: data.rejectionReason,
    generatedToken: data.generatedToken,
  };
}

/**
 * Obtiene todas las solicitudes
 */
export async function getAllGymRequests(): Promise<GymRequest[]> {
  const requestsRef = collection(db, GYM_REQUESTS_COLLECTION);
  const q = query(requestsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(mapDocToGymRequest);
}

/**
 * Obtiene solicitudes por estado
 */
export async function getGymRequestsByState(
  state: GymRequest['state']
): Promise<GymRequest[]> {
  const allRequests = await getAllGymRequests();
  return allRequests.filter(request => request.state === state);
}

/**
 * Obtiene una solicitud por ID
 */
export async function getGymRequestById(id: string): Promise<GymRequest | null> {
  const docRef = doc(db, GYM_REQUESTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return mapDocToGymRequest(docSnap);
}

/**
 * Actualiza el estado de una solicitud
 */
export async function updateGymRequestState(
  id: string,
  state: GymRequest['state'],
  reviewedBy: string,
  additionalData?: {
    rejectionReason?: string;
    generatedToken?: string;
  }
): Promise<void> {
  const docRef = doc(db, GYM_REQUESTS_COLLECTION, id);
  await updateDoc(docRef, {
    state,
    reviewedBy,
    reviewedAt: serverTimestamp(),
    ...additionalData,
  });
}
