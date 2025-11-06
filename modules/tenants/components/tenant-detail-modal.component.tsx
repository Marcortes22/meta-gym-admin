
"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  CreditCardIcon,
  CalendarIcon,
  UserIcon,
  ShieldCheckIcon,
} from "lucide-react";
import type { Tenant } from "@/shared/types/tenant.types";
import {
  DetailModal,
  DetailField,
  DetailSection,
} from "@/shared/components/ui/detail-modal";
import { Badge } from "@/shared/components/ui/badge";
import {
  formatTenantCode,
  getPlanName,
  getPlanPrice,
  getPlanBadgeColor,
  getSubscriptionStatusVariant,
} from "../utils/tenant.utils";
import { useActiveSaasPlans } from "../hooks/use-tenants.hooks";

interface TenantDetailModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TenantDetailModal({
  tenant,
  isOpen,
  onClose,
}: TenantDetailModalProps) {
  const { data: saasPlans = [] } = useActiveSaasPlans();

  if (!tenant) return null;

  const statusVariant = getSubscriptionStatusVariant(tenant);

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tenant Details ${formatTenantCode(tenant.id)}`}
      description="Complete tenant information"
    >

      <DetailSection title="Company Information">
        <DetailField
          label="Company Name"
          value={tenant.companyName}
          icon={<BuildingIcon className="h-5 w-5" />}
        />
        <DetailField
          label="Company Email"
          value={tenant.companyEmail}
          icon={<MailIcon className="h-5 w-5" />}
        />
        <DetailField
          label="Company Phone"
          value={tenant.companyPhone}
          icon={<PhoneIcon className="h-5 w-5" />}
        />
      </DetailSection>

      <DetailSection title="Subscription Information">
        <DetailField
          label="Current Plan"
          value={
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={getPlanBadgeColor(tenant.currentPlanId, saasPlans)}
              >
                {getPlanName(tenant.currentPlanId, saasPlans)}
              </Badge>
              <span className="text-sm text-gray-400">
                ${getPlanPrice(tenant.currentPlanId, saasPlans).toFixed(2)}/month
              </span>
            </div>
          }
          icon={<CreditCardIcon className="h-5 w-5" />}
        />
        <DetailField
          label="Expiration Date"
          value={
            <div className="flex items-center gap-2">
              <span>
                {format(tenant.subscriptionEndDate, "dd 'de' MMMM, yyyy", {
                  locale: es,
                })}
              </span>
              <Badge variant="outline" className={statusVariant.className}>
                {statusVariant.text}
              </Badge>
            </div>
          }
          icon={<CalendarIcon className="h-5 w-5" />}
        />
      </DetailSection>


      <DetailSection title="System Information">
        <DetailField
          label="Tenant ID"
          value={<span className="font-mono text-sm">{tenant.id}</span>}
          icon={<ShieldCheckIcon className="h-5 w-5" />}
        />
        <DetailField
          label="Owner ID"
          value={<span className="font-mono text-sm">{tenant.ownerId}</span>}
          icon={<UserIcon className="h-5 w-5" />}
        />
        <DetailField
          label="Status"
          value={
            <Badge
              variant="outline"
              className={
                tenant.is_active
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }
            >
              {tenant.is_active ? "Active" : "Inactive"}
            </Badge>
          }
        />
        <DetailField
          label="Creation Date"
          value={format(tenant.createdAt, "dd 'de' MMMM, yyyy 'a las' HH:mm", {
            locale: es,
          })}
          icon={<CalendarIcon className="h-5 w-5" />}
        />
      </DetailSection>
    </DetailModal>
  );
}
