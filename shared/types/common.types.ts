/**
 * Base entity interface for all Firestore documents
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Timestamp fields for Firestore documents
 */
export interface Timestamps {
  createdAt: Date;
  updatedAt?: Date;
}
