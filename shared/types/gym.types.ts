import { BaseEntity } from './common.types';

/**
 * Gimnasio registrado en Meta Gym (pertenece a un tenant)
 */
export interface Gym extends BaseEntity {
  // Relación con tenant
  tenantId: string;
  ownerId: string; // UID del usuario administrador en Firebase Auth
  
  // Información básica
  code: string; // Código único del gym (ej: GYMDEMO001)
  name: string;
  email: string;
  phone: string;
  
  // Dirección
  address: string;
  city: string;
  country: string;
  
  // Estado
  is_active: boolean;
  createdAt: Date;
  
  // Campos opcionales para compatibilidad
  logoUrl?: string;
  status?: 'pending' | 'active' | 'inactive' | 'suspended';
}

/**
 * Input para crear un gimnasio
 */
export interface CreateGymInput {
  tenantId: string;
  ownerId: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  is_active: boolean;
}

/**
 * Input para actualizar un gimnasio
 */
export type UpdateGymInput = Partial<Omit<CreateGymInput, 'ownerId'>>;

/**
 * Filtros para búsqueda de gimnasios
 */
export interface GymFilters {
  status?: Gym['status'];
  city?: string;
  country?: string;
  search?: string; // Búsqueda por nombre o email
}

/**
 * Estadísticas de un gimnasio
 */
export interface GymStats {
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
  monthlyRevenue: number;
}
