/**
 * Utility functions for tenant management
 */

import type { Tenant } from "@/shared/types/tenant.types";
import type { SaasPlan } from "@/shared/types/saas-plan.types";

/**
 * Get plan name from SaaS plans array
 */
export function getPlanName(planId: string, plans?: SaasPlan[]): string {
  if (!plans) return planId;
  const plan = plans.find((p) => p.id === planId);
  return plan?.name || planId;
}

/**
 * Get plan price from SaaS plans array
 */
export function getPlanPrice(planId: string, plans?: SaasPlan[]): number {
  if (!plans) return 0;
  const plan = plans.find((p) => p.id === planId);
  return plan?.price || 0;
}

/**
 * Get plan badge color based on price tiers
 */
export function getPlanBadgeColor(planId: string, plans?: SaasPlan[]): string {
  if (!plans) return "bg-gray-500/10 text-gray-400 border-gray-500/30";
  
  const plan = plans.find((p) => p.id === planId);
  if (!plan) return "bg-gray-500/10 text-gray-400 border-gray-500/30";

  // Color based on price tiers
  if (plan.price < 50) {
    return "bg-gray-500/10 text-gray-400 border-gray-500/30"; // Basic
  } else if (plan.price < 100) {
    return "bg-blue-500/10 text-blue-400 border-blue-500/30"; // Standard
  } else if (plan.price < 150) {
    return "bg-purple-500/10 text-purple-400 border-purple-500/30"; // Premium
  } else {
    return "bg-[#fe6b24]/10 text-[#fe6b24] border-[#fe6b24]/30"; // Enterprise
  }
}

/**
 * Check if subscription is expired
 */
export function isSubscriptionExpired(tenant: Tenant): boolean {
  const now = new Date();
  const endDate = new Date(tenant.subscriptionEndDate);
  return endDate < now;
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isSubscriptionExpiringSoon(tenant: Tenant): boolean {
  const now = new Date();
  const endDate = new Date(tenant.subscriptionEndDate);
  const daysUntilExpiry = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
}

/**
 * Get subscription status badge variant
 */
export function getSubscriptionStatusVariant(tenant: Tenant): {
  text: string;
  className: string;
} {
  if (isSubscriptionExpired(tenant)) {
    return {
      text: "Expired",
      className: "bg-red-500/10 text-red-400 border-red-500/30",
    };
  }

  if (isSubscriptionExpiringSoon(tenant)) {
    return {
      text: "Expiring Soon",
      className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    };
  }

  return {
    text: "Active",
    className: "bg-green-500/10 text-green-400 border-green-500/30",
  };
}

/**
 * Format tenant code (TC001 format from ID)
 */
export function formatTenantCode(id: string): string {
  // Extract number from tenant_XXXXXXXX format
  const number = id.replace("tenant_", "");
  return `TC${number.slice(-3).padStart(3, "0")}`;
}
