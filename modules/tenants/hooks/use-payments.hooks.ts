
import { useQuery } from "@tanstack/react-query";
import { getPaymentsByTenant, getAllPayments } from "../queries/payments.queries";


export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters: string) => [...paymentKeys.lists(), { filters }] as const,
  byTenant: (tenantId: string) => [...paymentKeys.all, "tenant", tenantId] as const,
};


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

export function useAllPayments() {
  return useQuery({
    queryKey: paymentKeys.lists(),
    queryFn: getAllPayments,
  });
}
