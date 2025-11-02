import { BaseEntity } from './common.types';

/**
 * Solicitud de registro de gimnasio
 */
export interface GymRequest extends BaseEntity {
  gymName: string;
  email: string;
  phone?: string;
  ownerName: string;
  address?: string;
  city?: string;
  country?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string; // ID del admin que revisó
  reviewedAt?: Date;
  rejectionReason?: string;
  notes?: string;
}

/**
 * Input para crear una solicitud
 */
export interface CreateGymRequestInput {
  gymName: string;
  email: string;
  phone?: string;
  ownerName: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
}

/**
 * Input para revisar una solicitud
 */
export interface ReviewGymRequestInput {
  requestId: string;
  status: 'approved' | 'rejected';
  reviewedBy: string;
  rejectionReason?: string;
}

/**
 * Filtros para solicitudes
 */
export interface GymRequestFilters {
  status?: GymRequest['status'];
  city?: string;
  country?: string;
  search?: string;
}

/**
 * Estadísticas de solicitudes
 */
export interface GymRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
