

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateTenantInput } from "@/shared/types/tenant.types";
import {
  fetchTenants,
  fetchActiveTenants,
  fetchTenantById,
  updateTenant,
  extendTenantSubscription,
  toggleTenantStatus,
} from "../queries/tenants.queries";
import {
  fetchActiveSaasPlans,
  fetchAllSaasPlans,
} from "../queries/saas-plans.queries";


export const tenantKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
  list: (filters: string) => [...tenantKeys.lists(), { filters }] as const,
  details: () => [...tenantKeys.all, "detail"] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
  active: () => [...tenantKeys.all, "active"] as const,
};


export const saasPlansKeys = {
  all: ["saas_plans"] as const,
  active: () => [...saasPlansKeys.all, "active"] as const,
};


export function useTenants() {
  return useQuery({
    queryKey: tenantKeys.lists(),
    queryFn: fetchTenants,
  });
}


export function useActiveTenants() {
  return useQuery({
    queryKey: tenantKeys.active(),
    queryFn: fetchActiveTenants,
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => fetchTenantById(id),
    enabled: !!id,
  });
}


export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTenantInput) => updateTenant(input),
    onSuccess: () => {
      // Invalidate all tenant queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    },
  });
}


export function useExtendSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { tenantId: string; amount: number; notes?: string }) =>
      extendTenantSubscription(params),
    onSuccess: () => {
      // Invalidate tenant queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    },
  });
}

export function useToggleTenantStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) => toggleTenantStatus(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    },
  });
}


export function useActiveSaasPlans() {
  return useQuery({
    queryKey: saasPlansKeys.active(),
    queryFn: fetchActiveSaasPlans,
  });
}


export function useAllSaasPlans() {
  return useQuery({
    queryKey: saasPlansKeys.all,
    queryFn: fetchAllSaasPlans,
  });
}
