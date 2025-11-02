import { BaseEntity } from './common.types';

/**
 * Token de acceso para gimnasios
 */
export interface Token extends BaseEntity {
  token: string;
  gymId?: string; // null si no está asignado
  isActive: boolean;
  expiresAt?: Date;
  usedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Input para crear un token
 */
export interface CreateTokenInput {
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Input para asignar un token a un gimnasio
 */
export interface AssignTokenInput {
  tokenId: string;
  gymId: string;
}

/**
 * Estadísticas de tokens
 */
export interface TokenStats {
  total: number;
  active: number;
  used: number;
  expired: number;
}
