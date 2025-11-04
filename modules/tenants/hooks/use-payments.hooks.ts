/**
 * TanStack Query hooks for payment operations
 */

import { useQuery } from "@tanstack/react-query";
import { getPaymentsByTenant, getAllPayments } from "../queries/payments.queries";

/**
 * Query keys for payment operations
 */
export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters: string) => [...paymentKeys.lists(), { filters }] as const,
  byTenant: (tenantId: string) => [...paymentKeys.all, "tenant", tenantId] as const,
};

/**
 * Hook to fetch payments for a specific tenant
 */
export function usePaymentsByTenant(tenantId: string) {
  console.log('🎣 [usePaymentsByTenant] Hook called with tenantId:', tenantId);
  console.log('🎣 [usePaymentsByTenant] Query enabled:', !!tenantId);
  
  return useQuery({
    queryKey: paymentKeys.byTenant(tenantId),
    queryFn: () => {
      console.log('🚀 [usePaymentsByTenant] QueryFn executing for tenantId:', tenantId);
      return getPaymentsByTenant(tenantId);
    },
    enabled: !!tenantId,
  });
}

/**
 * Hook to fetch all payments
 */
export function useAllPayments() {
  return useQuery({
    queryKey: paymentKeys.lists(),
    queryFn: getAllPayments,
  });
}
