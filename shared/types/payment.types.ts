import { BaseEntity } from './common.types';

/**
 * Registro de pago de suscripción
 */
export interface SubscriptionPayment extends BaseEntity {
  // Relaciones
  tenantId: string;
  subscriptionId: string;
  
  // Información del pago
  amount: number;
  hasPaid: boolean;
  
  // Fechas del período
  periodStart: Date;
  periodEnd: Date;
  paidAt: Date | null;
  
  // Estado (se calcula automáticamente)
  status: 'active' | 'overdue';
  
  // Notas opcionales
  notes?: string;
  
  // Metadata
  createdAt: Date;
}

/**
 * Input para registrar un pago
 */
export interface CreatePaymentInput {
  tenantId: string;
  subscriptionId: string;
  amount: number;
  periodStart: Date;
  periodEnd: Date;
  notes?: string;
}

/**
 * Validación de input de pago
 */
export interface PaymentValidationResult {
  isValid: boolean;
  errors: string[];
}
