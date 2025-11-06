

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CreditCardIcon,
  BuildingIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useToast } from "@/shared/hooks/use-toast";
import { useTenant, useActiveSaasPlans } from "../hooks/use-tenants.hooks";
import { usePaymentsByTenant } from "../hooks/use-payments.hooks";
import { formatTenantCode, getPlanName, getSubscriptionStatusVariant } from "../utils/tenant.utils";
import { PaymentHistoryTable } from "../components/payment-history-table.component";

interface TenantDetailsPageProps {
  tenantId: string;
}

export function TenantDetailsPage({ tenantId }: TenantDetailsPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: tenant, isLoading: loadingTenant, error: tenantError } = useTenant(tenantId);
  const { data: saasPlans = [], isLoading: loadingPlans } = useActiveSaasPlans();
  const { data: payments = [], isLoading: loadingPayments } = usePaymentsByTenant(tenantId);

  const currentPlan = tenant && saasPlans.length > 0
    ? saasPlans.find(p => p.id === tenant.currentPlanId)
    : null;


  useEffect(() => {
    if (tenantError) {
      toast({
        variant: "error",
        title: "Error Loading Tenant",
        description: "Could not load tenant details. Please try again.",
      });
    }
  }, [tenantError, toast]);

  function handleBack() {
    router.push("/tenants");
  }

  if (loadingTenant || loadingPlans) {
    return <TenantDetailsPageSkeleton />;
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <BuildingIcon className="h-16 w-16 text-gray-600" />
        <h2 className="text-xl font-semibold text-white">Tenant Not Found</h2>
        <p className="text-gray-400">The requested tenant could not be found.</p>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Tenants
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 px-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4">
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          className="border-gray-500 bg-gray-800/50 text-white hover:bg-gray-700 hover:text-white hover:border-gray-400"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Tenant Details</h1>
          <p className="text-sm text-gray-400">
            View and manage details for {tenant.companyName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white">Tenant Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Tenant Code</p>
                  <p className="font-semibold text-white text-base">
                    {formatTenantCode(tenant.id)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Gym Name</p>
                  <div className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4 text-gray-500 shrink-0" />
                    <p className="font-semibold text-white text-base">{tenant.companyName}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Contact Email</p>
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-gray-500 shrink-0" />
                    <p className="text-white text-sm">{tenant.companyEmail}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Contact Phone</p>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-gray-500 shrink-0" />
                    <p className="text-white text-sm">{tenant.companyPhone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white">Payment History</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loadingPayments ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full bg-gray-800" />
                  <Skeleton className="h-12 w-full bg-gray-800" />
                  <Skeleton className="h-12 w-full bg-gray-800" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCardIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No payment history available</p>
                </div>
              ) : (
                <PaymentHistoryTable payments={payments} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="bg-gray-900/50 border-gray-800 h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white">Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {/* Current Plan */}
              <div className="space-y-1.5">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Current Plan</p>
                <p className="text-lg font-bold text-white">
                  {currentPlan ? currentPlan.name : getPlanName(tenant.currentPlanId, saasPlans)}
                </p>
                {currentPlan && (
                  <p className="text-xl font-bold text-green-400">
                    ${currentPlan.price.toFixed(2)}/month
                  </p>
                )}
              </div>


              <div className="space-y-1.5">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Status</p>
                <Badge
                  variant="outline"
                  className={getSubscriptionStatusVariant(tenant).className}
                >
                  {getSubscriptionStatusVariant(tenant).text}
                </Badge>
              </div>


              <div className="space-y-1.5">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Start Date</p>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <p className="text-white text-sm">
                    {format(tenant.createdAt, "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>

 
              <div className="space-y-1.5">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">End Date</p>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <p className="text-white font-semibold text-sm">
                    {format(tenant.subscriptionEndDate, "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


function TenantDetailsPageSkeleton() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20 bg-gray-800" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-gray-800" />
            <Skeleton className="h-4 w-64 bg-gray-800" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 bg-gray-800" />
          <Skeleton className="h-9 w-32 bg-gray-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full bg-gray-800 rounded-lg" />
          <Skeleton className="h-96 w-full bg-gray-800 rounded-lg" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[500px] w-full bg-gray-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
