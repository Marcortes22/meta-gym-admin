/**
 * TanStack Query hooks for tenant management
 */

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

/**
 * Query keys for tenant operations
 */
export const tenantKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
  list: (filters: string) => [...tenantKeys.lists(), { filters }] as const,
  details: () => [...tenantKeys.all, "detail"] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
  active: () => [...tenantKeys.all, "active"] as const,
};

/**
 * Query keys for SaaS plans
 */
export const saasPlansKeys = {
  all: ["saas_plans"] as const,
  active: () => [...saasPlansKeys.all, "active"] as const,
};

/**
 * Hook to fetch all tenants
 */
export function useTenants() {
  return useQuery({
    queryKey: tenantKeys.lists(),
    queryFn: fetchTenants,
  });
}

/**
 * Hook to fetch active tenants
 */
export function useActiveTenants() {
  return useQuery({
    queryKey: tenantKeys.active(),
    queryFn: fetchActiveTenants,
  });
}

/**
 * Hook to fetch a single tenant
 */
export function useTenant(id: string) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => fetchTenantById(id),
    enabled: !!id,
  });
}

/**
 * Hook to update tenant information
 */
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

/**
 * Hook to extend tenant subscription
 */
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

/**
 * Hook to toggle tenant active status
 */
export function useToggleTenantStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) => toggleTenantStatus(tenantId),
    onSuccess: () => {
      // Invalidate tenant queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    },
  });
}

/**
 * Hook to fetch active SaaS plans
 */
export function useActiveSaasPlans() {
  return useQuery({
    queryKey: saasPlansKeys.active(),
    queryFn: fetchActiveSaasPlans,
  });
}

/**
 * Hook to fetch all SaaS plans
 */
export function useAllSaasPlans() {
  return useQuery({
    queryKey: saasPlansKeys.all,
    queryFn: fetchAllSaasPlans,
  });
}
