import { BaseEntity } from "./common.types";

/**
 * Tenant entity representing a company/organization in the system
 */
export interface Tenant extends BaseEntity {
  /** Company name */
  companyName: string;

  /** Company email */
  companyEmail: string;

  /** Company phone */
  companyPhone: string;

  /** Owner user ID (Firebase Auth UID) */
  ownerId: string;

  /** Current subscription plan ID (references saas_plans collection) */
  currentPlanId: string;

  /** Subscription end date */
  subscriptionEndDate: Date;

  /** Whether the tenant is active */
  is_active: boolean;

  /** Creation timestamp */
  createdAt: Date;
}

/**
 * Input for creating a new tenant
 */
export interface CreateTenantInput {
  id: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  ownerId: string;
  currentPlanId: string;
  subscriptionEndDate: Date;
  is_active: boolean;
}

/**
 * Input for updating a tenant
 */
export interface UpdateTenantInput {
  id: string;
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  currentPlanId?: string;
}

/**
 * Tenant with plan details
 */
export interface TenantWithPlan extends Tenant {
  planName: string;
  planPrice: number;
}
