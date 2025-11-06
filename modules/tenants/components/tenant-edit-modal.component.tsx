
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  CreditCardIcon,
  Loader2Icon,
} from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import type { Tenant } from "@/shared/types/tenant.types";
import { useUpdateTenant, useActiveSaasPlans } from "../hooks/use-tenants.hooks";
import {
  updateTenantSchema,
  type UpdateTenantFormData,
} from "../models/schemas";
import { getPlanName, formatTenantCode } from "../utils/tenant.utils";

interface TenantEditModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TenantEditModal({
  tenant,
  isOpen,
  onClose,
}: TenantEditModalProps) {
  const updateTenant = useUpdateTenant();
  const { data: saasPlans = [], isLoading: isLoadingPlans } = useActiveSaasPlans();
  const { toast } = useToast();


  const form = useForm<UpdateTenantFormData>({
    resolver: zodResolver(updateTenantSchema),
    defaultValues: {
      companyName: tenant?.companyName || "",
      companyEmail: tenant?.companyEmail || "",
      companyPhone: tenant?.companyPhone || "",
      currentPlanId: tenant?.currentPlanId || "",
    },
  });


  useEffect(() => {
    if (tenant) {
      form.reset({
        companyName: tenant.companyName,
        companyEmail: tenant.companyEmail,
        companyPhone: tenant.companyPhone,
        currentPlanId: tenant.currentPlanId,
      });
    }
  }, [tenant, form]);

  async function onSubmit(data: UpdateTenantFormData) {
    if (!tenant) return;

    try {
      await updateTenant.mutateAsync({
        id: tenant.id,
        ...data,
      });

      toast({
        variant: "success",
        title: "Tenant Updated!",
        description: `Changes for "${tenant.companyName}" have been saved successfully.`,
      });

      onClose();
      form.reset();
    } catch (error) {
      toast({
        variant: "error",
        title: "Update Failed",
        description: "Could not save changes. Please try again.",
      });
    }
  }

  function handleClose() {
    if (!updateTenant.isPending) {
      onClose();
      form.reset();
      updateTenant.reset();
    }
  }

  if (!tenant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-[#0f0f10] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Edit Tenant {formatTenantCode(tenant.id)}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Modify tenant information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4" />
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter company name"
                      className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#fe6b24]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    Company Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="email@company.com"
                      className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#fe6b24]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="companyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    Company Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="86682498"
                      className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#fe6b24]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentPlanId"
              render={({ field }) => {
                const currentPlan = saasPlans.find((p) => p.id === field.value);
                
                return (
                  <FormItem>
                    <FormLabel className="text-gray-300 flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" />
                      Subscription Plan
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      disabled={isLoadingPlans}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white focus:border-[#fe6b24]">
                          <SelectValue 
                            placeholder="Select a plan"
                          >
                            {currentPlan ? currentPlan.name : "Select a plan"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {isLoadingPlans ? (
                          <div className="px-2 py-6 text-center text-sm text-gray-400">
                            Loading plans...
                          </div>
                        ) : saasPlans.length === 0 ? (
                          <div className="px-2 py-6 text-center">
                            <p className="text-sm text-gray-400 mb-1">No active plans</p>
                            <p className="text-xs text-gray-500">Create plans in Firebase Console → saas_plans</p>
                          </div>
                        ) : (
                          saasPlans.map((plan) => (
                            <SelectItem 
                              key={plan.id} 
                              value={plan.id} 
                              className="text-white hover:bg-gray-800 cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{plan.name}</span>
                                <span className="text-xs text-gray-400">
                                  ${plan.price.toFixed(2)}/month · {plan.max_clients} clients · {plan.max_gyms} gym{plan.max_gyms > 1 ? 's' : ''}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                );
              }}
            />

            {updateTenant.isError && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertDescription className="text-red-400">
                  {updateTenant.error instanceof Error
                    ? updateTenant.error.message
                    : "Error updating tenant"}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateTenant.isPending}
                className="border-gray-400 bg-transparent text-gray-100 hover:bg-gray-700 hover:border-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateTenant.isPending}
                className="bg-[#fe6b24] hover:bg-[#ff7a35] text-white font-semibold shadow-sm"
              >
                {updateTenant.isPending ? (
                  <>
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
