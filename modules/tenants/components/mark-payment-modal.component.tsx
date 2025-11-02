/**
 * Modal for marking payment and extending subscription
 */

"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Loader2Icon,
  CalendarIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import type { Tenant } from "@/shared/types/tenant.types";
import { useExtendSubscription, useActiveSaasPlans } from "../hooks/use-tenants.hooks";
import { formatTenantCode, getPlanName } from "../utils/tenant.utils";

interface MarkPaymentModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MarkPaymentModal({
  tenant,
  isOpen,
  onClose,
}: MarkPaymentModalProps) {
  const extendSubscription = useExtendSubscription();
  const { data: saasPlans = [] } = useActiveSaasPlans();
  const { toast } = useToast();

  async function handleConfirm() {
    if (!tenant) return;

    try {
      const updatedDate = await extendSubscription.mutateAsync(tenant.id);

      toast({
        variant: "success",
        title: "Payment Registered!",
        description: `Subscription for "${tenant.companyName}" extended until ${format(updatedDate, "MMMM dd, yyyy")}.`,
      });

      onClose();
    } catch (error) {
      console.error("Error extending subscription:", error);
      toast({
        variant: "error",
        title: "Payment Failed",
        description: "Could not extend subscription. Please try again.",
      });
    }
  }

  function handleClose() {
    if (!extendSubscription.isPending) {
      onClose();
      extendSubscription.reset();
    }
  }

  if (!tenant) return null;

  // Calculate new end date (current + 30 days)
  const currentEndDate = new Date(tenant.subscriptionEndDate);
  const projectedNewDate = new Date(currentEndDate);
  projectedNewDate.setDate(projectedNewDate.getDate() + 30);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-[#0f0f10] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Mark Payment Received
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Confirm that you have received payment to extend the subscription
          </DialogDescription>
        </DialogHeader>

        {/* Tenant Info */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Tenant:</span>
              <span className="text-sm font-medium text-white">
                {formatTenantCode(tenant.id)} - {tenant.companyName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Plan:</span>
              <span className="text-sm font-medium text-white">
                {getPlanName(tenant.currentPlanId, saasPlans)}
              </span>
            </div>
          </div>
        </div>

        {/* Current vs New Date */}
        <div className="space-y-3">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4 text-yellow-400" />
              <p className="text-xs font-medium text-yellow-300 uppercase tracking-wide">
                Current Expiration Date
              </p>
            </div>
            <p className="text-base font-semibold text-yellow-400">
              {format(currentEndDate, "MMMM dd, yyyy")}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="h-8 w-px bg-gray-700" />
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4 text-green-400" />
              <p className="text-xs font-medium text-green-300 uppercase tracking-wide">
                New Expiration Date (+30 days)
              </p>
            </div>
            <p className="text-base font-semibold text-green-400">
              {format(projectedNewDate, "MMMM dd, yyyy")}
            </p>
          </div>
        </div>

        {/* Warning */}
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <AlertTriangleIcon className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-400 text-sm">
            This action will extend the tenant's subscription by 30 additional days.
            Make sure you have received the corresponding payment before confirming.
          </AlertDescription>
        </Alert>

        {/* Error Display */}
        {extendSubscription.isError && (
          <Alert className="bg-red-500/10 border-red-500/30">
            <AlertDescription className="text-red-400">
              {extendSubscription.error instanceof Error
                ? extendSubscription.error.message
                : "Error extending subscription"}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={extendSubscription.isPending}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={extendSubscription.isPending}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm"
          >
            {extendSubscription.isPending ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Confirm Payment
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
