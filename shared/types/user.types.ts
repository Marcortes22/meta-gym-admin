import { BaseEntity } from './common.types';

/**
 * Rol de usuario en un gimnasio
 */
export interface UserRole {
  id: 'own' | 'sec' | 'coa' | 'mem'; // owner, secretary, coach, member
  name: string;
}

/**
 * Usuario del sistema (en colección users)
 */
export interface User extends BaseEntity {
  // Autenticación
  user_id: string; // UID de Firebase Auth
  email: string;
  
  // Información personal
  name: string;
  surname1: string;
  surname2: string;
  phone: string;
  dateOfBirth: string;
  
  // Relaciones
  gymId: string;
  tenantId: string;
  
  // Roles
  roles: UserRole[];
  
  // Información física (opcional para no-miembros)
  height: number;
  weight: number;
  
  // Membresía (opcional)
  membershipId: string | null;
  
  // Perfil
  profilePictureUrl: string | null;
  pin: string | null;
}

/**
 * Input para crear un usuario administrador
 */
export interface CreateAdminUserInput {
  user_id: string; // UID de Firebase Auth
  email: string;
  name: string;
  surname1: string;
  surname2: string;
  phone: string;
  dateOfBirth?: string;
  roles: UserRole[];
  gymId: string;
  tenantId: string;
}

/**
 * Input para crear cuenta de Firebase Auth y usuario
 */
export interface CreateAuthUserInput {
  email: string;
  password: string;
  name: string;
  surname1: string;
  surname2: string;
  phone: string;
}
