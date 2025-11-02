/**
 * Tenant detail view modal component
 */

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
      title={`Detalles del Tenant ${formatTenantCode(tenant.id)}`}
      description="Información completa del tenant"
    >
      {/* Company Information */}
      <DetailSection title="Información de la Empresa">
        <DetailField
          label="Nombre de la Empresa"
          value={tenant.companyName}
          icon={<BuildingIcon className="h-5 w-5" />}
        />
        <DetailField
          label="Email de la Empresa"
          value={tenant.companyEmail}
          icon={<MailIcon className="h-5 w-5" />}
        />
        <DetailField
          label="Teléfono de la Empresa"
          value={tenant.companyPhone}
          icon={<PhoneIcon className="h-5 w-5" />}
        />
      </DetailSection>

      {/* Subscription Information */}
      <DetailSection title="Información de Suscripción">
        <DetailField
          label="Plan Actual"
          value={
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={getPlanBadgeColor(tenant.currentPlanId, saasPlans)}
              >
                {getPlanName(tenant.currentPlanId, saasPlans)}
              </Badge>
              <span className="text-sm text-gray-400">
                ${getPlanPrice(tenant.currentPlanId, saasPlans).toFixed(2)}/mes
              </span>
            </div>
          }
          icon={<CreditCardIcon className="h-5 w-5" />}
        />
        <DetailField
          label="Fecha de Vencimiento"
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

      {/* System Information */}
      <DetailSection title="Información del Sistema">
        <DetailField
          label="ID del Tenant"
          value={<span className="font-mono text-sm">{tenant.id}</span>}
          icon={<ShieldCheckIcon className="h-5 w-5" />}
        />
        <DetailField
          label="ID del Propietario"
          value={<span className="font-mono text-sm">{tenant.ownerId}</span>}
          icon={<UserIcon className="h-5 w-5" />}
        />
        <DetailField
          label="Estado"
          value={
            <Badge
              variant="outline"
              className={
                tenant.is_active
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }
            >
              {tenant.is_active ? "Activo" : "Inactivo"}
            </Badge>
          }
        />
        <DetailField
          label="Fecha de Creación"
          value={format(tenant.createdAt, "dd 'de' MMMM, yyyy 'a las' HH:mm", {
            locale: es,
          })}
          icon={<CalendarIcon className="h-5 w-5" />}
        />
      </DetailSection>
    </DetailModal>
  );
}
