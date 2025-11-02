// lib/firebase/utils.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryConstraint,
  Timestamp,
  WhereFilterOp,
  OrderByDirection,
} from 'firebase/firestore';
import { db } from './client';

/**
 * Firebase Firestore utility functions
 * Provides type-safe wrappers for common Firestore operations
 */

// Generic CRUD operations
export async function getDocument<T = DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return { id: docSnap.id, ...docSnap.data() } as T;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

export async function getAllDocuments<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
}

export async function createDocument<T = DocumentData>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const timestamp = Timestamp.now();
    
    await setDoc(docRef, {
      ...data,
      created_at: timestamp,
      updated_at: timestamp,
    });
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

export async function updateDocument<T = Partial<DocumentData>>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const timestamp = Timestamp.now();
    
    await updateDoc(docRef, {
      ...data,
      updated_at: timestamp,
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

// Query builders
export function buildQuery(constraints: {
  where?: Array<{ field: string; operator: WhereFilterOp; value: any }>;
  orderBy?: Array<{ field: string; direction?: OrderByDirection }>;
  limit?: number;
}): QueryConstraint[] {
  const queryConstraints: QueryConstraint[] = [];

  if (constraints.where) {
    constraints.where.forEach(({ field, operator, value }) => {
      queryConstraints.push(where(field, operator, value));
    });
  }

  if (constraints.orderBy) {
    constraints.orderBy.forEach(({ field, direction = 'asc' }) => {
      queryConstraints.push(orderBy(field, direction));
    });
  }

  if (constraints.limit) {
    queryConstraints.push(limit(constraints.limit));
  }

  return queryConstraints;
}

// Timestamp utilities
export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

export function timestampToString(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString();
}

// Firebase Error Handling
export interface FirebaseError {
  code: string;
  message: string;
  name: string;
}

export function handleFirebaseError(error: any): string {
  if (error.code) {
    switch (error.code) {
      case 'permission-denied':
        return 'No tienes permisos para realizar esta operación';
      case 'not-found':
        return 'El documento solicitado no existe';
      case 'already-exists':
        return 'El documento ya existe';
      case 'failed-precondition':
        return 'La operación falló debido a una precondición';
      case 'aborted':
        return 'La operación fue cancelada';
      case 'unavailable':
        return 'El servicio no está disponible temporalmente';
      default:
        return error.message || 'Ocurrió un error desconocido';
    }
  }
  return error.message || 'Ocurrió un error desconocido';
}
