
import { useQuery } from "@tanstack/react-query";
import { getPaymentsByTenant, getAllPayments } from "../queries/payments.queries";


export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters: string) => [...paymentKeys.lists(), { filters }] as const,
  byTenant: (tenantId: string) => [...paymentKeys.all, "tenant", tenantId] as const,
};


export function usePaymentsByTenant(tenantId: string) {
  return useQuery({
    queryKey: paymentKeys.byTenant(tenantId),
    queryFn: () => {
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
