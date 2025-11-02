/**
 * SaaS Plan types
 */

import { BaseEntity } from "./common.types";

/**
 * SaaS Plan entity from saas_plans collection
 */
export interface SaasPlan extends BaseEntity {
  /** Plan name */
  name: string;

  /** Plan description */
  description: string;

  /** Monthly price */
  price: number;

  /** Maximum number of clients allowed */
  max_clients: number;

  /** Maximum number of gyms allowed */
  max_gyms: number;

  /** Plan features list */
  features: string[];

  /** Whether the plan is active */
  is_active: boolean;

  /** Platform configuration ID (if any) */
  platform_config_id: string | null;

  /** Creation timestamp */
  createdAt: Date;
}
