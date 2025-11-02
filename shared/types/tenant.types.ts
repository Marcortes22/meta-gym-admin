import { BaseEntity } from './common.types';

/**
 * Tenant (Empresa/Gimnasio principal)
 */
export interface Tenant extends BaseEntity {
  // Información de la empresa
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  
  // Propietario
  ownerId: string; // UID del usuario en Firebase Auth
  
  // Suscripción actual
  currentPlanId: string;
  subscriptionEndDate: Date;
  
  // Estado
  is_active: boolean;
  createdAt: Date;
}

/**
 * Input para crear un tenant
 */
export interface CreateTenantInput {
  id: string; // Generado: tenant_[random]
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  ownerId: string;
  currentPlanId: string;
  subscriptionEndDate: Date;
  is_active: boolean;
}
