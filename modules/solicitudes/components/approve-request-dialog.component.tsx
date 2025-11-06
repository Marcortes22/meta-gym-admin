'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { GymRequest } from '@/shared/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useApproveRequest } from '@/modules/solicitudes/hooks/use-gym-requests.hooks';
import {
  approveRequestSchema,
  type ApproveRequestFormData,
} from '@/modules/solicitudes/models/schemas';
import { CheckCircleIcon, Loader2Icon, KeyIcon, MailIcon } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface ApproveRequestDialogProps {
  request: GymRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApproveRequestDialog({
  request,
  open,
  onOpenChange,
}: ApproveRequestDialogProps) {
  const approveRequest = useApproveRequest();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ApproveRequestFormData>({
    resolver: zodResolver(approveRequestSchema),
    defaultValues: {
      adminEmail: request?.email || '',
      adminPassword: '',
      confirmPassword: '',
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  // If a request changes, reset the form and default to using the request email
  const [useRequestEmail, setUseRequestEmail] = useState<boolean>(true);

  useEffect(() => {
    reset({
      adminEmail: request?.email || '',
      adminPassword: '',
      confirmPassword: '',
    });
    setUseRequestEmail(true);
  }, [request, reset]);

  const onSubmit = async (data: ApproveRequestFormData) => {
    if (!request) return;

    try {
      await approveRequest.mutateAsync({
        request,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
      });

      toast({
        variant: 'success',
        title: 'Request Approved!',
        description: `Gym ${request.gym_name} has been created successfully`,
      });
      
      handleClose();
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Approval Failed',
        description: 'Could not approve the request',
      });
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[#0f0f10] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Approve Request
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-1">
            Create an administrator account for{' '}
            <span className="font-semibold text-[#fe6b24]">{request.gym_name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Gym Information */}
          <div className="p-4 bg-[#1a1a1b] rounded-lg border border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Gym:</span>
              <span className="text-white font-semibold">{request.gym_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Administrator:</span>
              <span className="text-white">
                {request.admin_name} {request.admin_surname1}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Plan:</span>
              <span className="text-white capitalize">
                {request.requested_plan.replace(/_/g, ' ')}
              </span>
            </div>
          </div>


          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 font-semibold flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-[#fe6b24]" />
                Administrator Email
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="useRequestEmail"
                  type="checkbox"
                  className="w-4 h-4 text-[#fe6b24] bg-gray-700 border-gray-600 rounded"
                  checked={useRequestEmail}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUseRequestEmail(checked);
                    if (checked) {
                      setValue('adminEmail', request?.email || '');
                    }
                  }}
                />
                <label htmlFor="useRequestEmail" className="text-sm text-gray-400">
                  Use email from request
                </label>
              </div>
            </div>

            <Input
              id="adminEmail"
              type="email"
              placeholder="admin@example.com"
              className="bg-[#1a1a1b] border-gray-700 text-white placeholder:text-gray-500"
              {...register('adminEmail')}
              disabled={useRequestEmail}
            />
            {errors.adminEmail && (
              <p className="text-sm text-red-400">{errors.adminEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminPassword" className="text-gray-300 font-semibold flex items-center gap-2">
              <KeyIcon className="h-4 w-4 text-[#fe6b24]" />
              Password
            </Label>
            <Input
              id="adminPassword"
              type="password"
              placeholder="Minimum 6 characters"
              className="bg-[#1a1a1b] border-gray-700 text-white placeholder:text-gray-500"
              {...register('adminPassword')}
            />
            {errors.adminPassword && (
              <p className="text-sm text-red-400">{errors.adminPassword.message}</p>
            )}
          </div>


          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300 font-semibold flex items-center gap-2">
              <KeyIcon className="h-4 w-4 text-[#fe6b24]" />
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              className="bg-[#1a1a1b] border-gray-700 text-white placeholder:text-gray-500"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={approveRequest.isPending}
              className="border-gray-400 bg-transparent text-gray-100 hover:bg-gray-700 hover:border-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={approveRequest.isPending}
              className="bg-[#fe6b24] hover:bg-[#ff7a35] text-white font-semibold"
            >
              {approveRequest.isPending ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Approve Request
                </>
              )}
            </Button>
          </DialogFooter>

          {approveRequest.isError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">
                {approveRequest.error instanceof Error
                  ? approveRequest.error.message
                  : 'Error approving request'}
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
