import { BaseEntity } from './common.types';

/**
 * Usuario administrador en la colección global_users
 */
export interface GlobalUser extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
}

/**
 * Input para crear un usuario administrador
 */
export interface CreateGlobalUserInput {
  email: string;
  name: string;
  role?: 'admin' | 'super_admin';
  isActive?: boolean;
}

/**
 * Input para actualizar un usuario administrador
 */
export type UpdateGlobalUserInput = Partial<Omit<CreateGlobalUserInput, 'email'>>;
