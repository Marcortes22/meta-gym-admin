/**
 * Types para el módulo de gimnasios
 */

export interface Gym {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  logo?: string;
  status: 'active' | 'inactive' | 'pending';
  memberCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface GymFilters {
  status?: 'active' | 'inactive' | 'pending';
  city?: string;
  search?: string;
}

export interface CreateGymData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  logo?: string;
}
