/**
 * Tenants management page
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2Icon } from "lucide-react";
import type { Tenant } from "@/shared/types/tenant.types";
import { DataTable } from "@/shared/components/data-table/data-table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTenants, useActiveSaasPlans, useToggleTenantStatus } from "../hooks/use-tenants.hooks";
import { createTenantsColumns } from "../components/tenants-columns";
import { TenantDetailModal } from "../components/tenant-detail-modal.component";
import { TenantEditModal } from "../components/tenant-edit-modal.component";
import { MarkPaymentModal } from "../components/mark-payment-modal.component";
import { ConfirmationModal } from "@/shared/components/ui/confirmation-modal";
import { useToast } from "@/shared/hooks/use-toast";

export function TenantsPage() {
  const router = useRouter();
  const { data: tenants = [], isLoading, error } = useTenants();
  const { data: saasPlans = [], isLoading: isLoadingPlans } = useActiveSaasPlans();
  const toggleStatus = useToggleTenantStatus();
  const { toast } = useToast();

  // Debug
  console.log('Tenants:', tenants);
  console.log('SaaS Plans:', saasPlans);
  console.log('Loading Plans:', isLoadingPlans);

  // Modal states
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ tenant: Tenant; action: 'activate' | 'deactivate' } | null>(null);

  // Handlers
  function handleView(tenant: Tenant) {
    router.push(`/tenants/${tenant.id}`);
  }

  function handleEdit(tenant: Tenant) {
    setSelectedTenant(tenant);
    setIsEditOpen(true);
  }

  function handleMarkPayment(tenant: Tenant) {
    setSelectedTenant(tenant);
    setIsPaymentOpen(true);
  }

  function handleToggleStatus(tenant: Tenant) {
    setPendingAction({
      tenant,
      action: tenant.is_active ? 'deactivate' : 'activate'
    });
    setIsConfirmOpen(true);
  }

  async function confirmToggleStatus() {
    if (!pendingAction) return;

    const { tenant, action } = pendingAction;
    const actionText = action === 'deactivate' ? 'deactivated' : 'activated';

    try {
      await toggleStatus.mutateAsync(tenant.id);
      
      toast({
        variant: "success",
        title: "Status Updated!",
        description: `Tenant "${tenant.companyName}" has been ${actionText} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling tenant status:', error);
      toast({
        variant: "error",
        title: "Update Failed",
        description: `Could not ${action === 'deactivate' ? 'deactivate' : 'activate'} the tenant. Please try again.`,
      });
    } finally {
      setPendingAction(null);
    }
  }

  // Create columns with handlers
  const columns = createTenantsColumns({
    onView: handleView,
    onEdit: handleEdit,
    onMarkPayment: handleMarkPayment,
    onToggleStatus: handleToggleStatus,
    saasPlans,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header with breadcrumb-like context */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Tenant Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage companies and subscriptions
          </p>
        </div>
        
        {/* Status indicator */}
        {!isLoading && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">Live</span>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#fe6b24]/10 p-2">
            <Building2Icon className="h-5 w-5 text-[#fe6b24]" />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-32 bg-gray-700/50" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Total:</span>
                <span className="text-lg font-bold text-white">{tenants.length}</span>
                <span className="text-gray-600">|</span>
                <span className="text-sm text-gray-400">Active:</span>
                <span className="text-lg font-semibold text-green-400">
                  {tenants.filter((t) => t.is_active).length}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Result counter with icon */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {isLoading ? (
            <Skeleton className="h-5 w-28 bg-gray-700/50" />
          ) : (
            <>
              <svg 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                />
              </svg>
              <span>
                <span className="font-semibold text-white">{tenants.length}</span>{' '}
                {tenants.length === 1 ? 'tenant' : 'tenants'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={tenants}
        isLoading={isLoading}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 50]}
        emptyMessage="No se encontraron tenants"
        emptyDescription="Los tenants registrados aparecerán aquí"
      />

      {/* Modals */}
      <TenantDetailModal
        tenant={selectedTenant}
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedTenant(null);
        }}
      />

      <TenantEditModal
        tenant={selectedTenant}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTenant(null);
        }}
      />

      <MarkPaymentModal
        tenant={selectedTenant}
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setSelectedTenant(null);
        }}
      />

      {/* Confirmation Modal for Status Toggle */}
      {pendingAction && (
        <ConfirmationModal
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title={`${pendingAction.action === 'deactivate' ? 'Deactivate' : 'Activate'} Tenant`}
          description={`Are you sure you want to ${pendingAction.action === 'deactivate' ? 'deactivate' : 'activate'} the tenant "${pendingAction.tenant.companyName}"? ${pendingAction.action === 'deactivate' ? 'The tenant will not be able to access the system.' : 'The tenant will be able to access the system again.'}`}
          variant={pendingAction.action === 'deactivate' ? 'warning' : 'success'}
          confirmText={pendingAction.action === 'deactivate' ? 'Deactivate' : 'Activate'}
          cancelText="Cancel"
          onConfirm={confirmToggleStatus}
          isLoading={toggleStatus.isPending}
        />
      )}
    </div>
  );
}
