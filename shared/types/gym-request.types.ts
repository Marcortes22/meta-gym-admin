import { BaseEntity } from './common.types';

/**
 * Solicitud de registro de gimnasio (colección en Firestore)
 */
export interface GymRequest extends BaseEntity {
  // Información del gimnasio
  gym_name: string;
  gym_phone: string;
  gym_address: string;
  company_name: string;
  
  // Información del administrador
  name: string;
  admin_name: string;
  admin_surname1: string;
  admin_surname2: string;
  admin_phone: string;
  email: string;
  
  // Plan solicitado
  requested_plan: 'basic_plan' | 'professional_plan' | 'enterprise_plan';
  
  // Estado y fechas
  state: 'pending' | 'approved' | 'rejected';
  date: Date;
  createdAt: Date;
  
  // Información de revisión (opcional)
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  generatedToken?: string; // Token generado al aprobar
}

/**
 * Input para crear una solicitud
 */
export interface CreateGymRequestInput {
  gym_name: string;
  gym_phone: string;
  gym_address: string;
  company_name: string;
  name: string;
  admin_name: string;
  admin_surname1: string;
  admin_surname2: string;
  admin_phone: string;
  email: string;
  requested_plan: GymRequest['requested_plan'];
}

/**
 * Input para revisar una solicitud
 */
export interface ReviewGymRequestInput {
  requestId: string;
  state: 'approved' | 'rejected';
  reviewedBy: string;
  rejectionReason?: string;
  generatedToken?: string;
}

/**
 * Filtros para solicitudes
 */
export interface GymRequestFilters {
  state?: GymRequest['state'];
  requested_plan?: GymRequest['requested_plan'];
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
