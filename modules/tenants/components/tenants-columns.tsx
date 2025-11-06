
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EyeIcon, PencilIcon, CheckCircleIcon, PowerIcon } from "lucide-react";
import type { Tenant } from "@/shared/types/tenant.types";
import type { SaasPlan } from "@/shared/types/saas-plan.types";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  formatTenantCode,
  getPlanName,
  getPlanBadgeColor,
  getSubscriptionStatusVariant,
} from "../utils/tenant.utils";

interface TenantsColumnsProps {
  onView: (tenant: Tenant) => void;
  onEdit: (tenant: Tenant) => void;
  onMarkPayment: (tenant: Tenant) => void;
  onToggleStatus: (tenant: Tenant) => void;
  saasPlans?: SaasPlan[];
}

export function createTenantsColumns({
  onView,
  onEdit,
  onMarkPayment,
  onToggleStatus,
  saasPlans = [],
}: TenantsColumnsProps): ColumnDef<Tenant>[] {
  return [
    {
      accessorKey: "id",
      header: "CODE",
      cell: ({ row }) => {
        const tenant = row.original;
        return (
          <span className="font-mono text-sm text-gray-300">
            {formatTenantCode(tenant.id)}
          </span>
        );
      },
    },
    {
      accessorKey: "companyName",
      header: "COMPANY",
      cell: ({ row }) => {
        const tenant = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-white">{tenant.companyName}</span>
            <span className="text-sm text-gray-400">{tenant.companyEmail}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "STATE",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <Badge
            variant="outline"
            className={
              isActive
                ? "bg-green-500/10 text-green-400 border-green-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "currentPlanId",
      header: "PLAN",
      cell: ({ row }) => {
        const planId = row.getValue("currentPlanId") as string;
        return (
          <Badge
            variant="outline"
            className={getPlanBadgeColor(planId, saasPlans)}
          >
            {getPlanName(planId, saasPlans)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "subscriptionEndDate",
      header: "EXPIRATION",
      cell: ({ row }) => {
        const tenant = row.original;
        const date = tenant.subscriptionEndDate;
        const statusVariant = getSubscriptionStatusVariant(tenant);

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-300">
              {format(date, "MMM dd, yyyy")}
            </span>
            <Badge
              variant="outline"
              className={`${statusVariant.className} w-fit`}
            >
              {statusVariant.text}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => {
        const tenant = row.original;
        return (
          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(tenant)}
              className="h-8 w-8 p-0 border-gray-500 bg-gray-800/50 text-white hover:bg-gray-700 hover:text-white"
              title="View details"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(tenant)}
              className="h-8 w-8 p-0 border-blue-400 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
              title="Edit tenant"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>


            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkPayment(tenant)}
              className="h-8 px-3 border-green-400 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300"
              title="Mark payment received"
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Pay</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(tenant)}
              className={
                tenant.is_active
                  ? "h-8 w-8 p-0 border-yellow-400 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300"
                  : "h-8 w-8 p-0 border-green-400 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300"
              }
              title={tenant.is_active ? "Deactivate tenant" : "Activate tenant"}
            >
              <PowerIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
