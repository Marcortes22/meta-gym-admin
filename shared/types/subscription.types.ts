import { BaseEntity } from './common.types';

/**
 * Suscripción de un tenant
 */
export interface Subscription extends BaseEntity {
  tenantId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  
  // Fechas
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  cancelledAt: Date | null;
  
  // Pago
  paymentDate: Date;
  paymentAmount: number;
  
  // Configuración
  autoRenew: boolean;
}

/**
 * Input para crear una suscripción
 */
export interface CreateSubscriptionInput {
  tenantId: string;
  planId: string;
  status: 'active';
  startDate: Date;
  endDate: Date;
  paymentDate: Date;
  paymentAmount: number;
  autoRenew: boolean;
}
