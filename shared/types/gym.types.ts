import { BaseEntity } from './common.types';

/**
 * Gimnasio registrado en Meta Gym
 */
export interface Gym extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  ownerId: string; // Referencia al usuario dueño
}

/**
 * Input para crear un gimnasio
 */
export interface CreateGymInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  ownerId: string;
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
