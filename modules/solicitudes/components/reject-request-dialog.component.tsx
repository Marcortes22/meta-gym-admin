'use client';

import { useForm } from 'react-hook-form';
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
import { Label } from '@/shared/components/ui/label';
import { useRejectRequest } from '@/modules/solicitudes/hooks/use-gym-requests.hooks';
import {
  rejectRequestSchema,
  type RejectRequestFormData,
} from '@/modules/solicitudes/models/schemas';
import { XCircleIcon, Loader2Icon, AlertTriangleIcon } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface RejectRequestDialogProps {
  request: GymRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RejectRequestDialog({
  request,
  open,
  onOpenChange,
}: RejectRequestDialogProps) {
  const rejectRequest = useRejectRequest();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RejectRequestFormData>({
    resolver: zodResolver(rejectRequestSchema),
    defaultValues: {
      rejectionReason: '',
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: RejectRequestFormData) => {
    if (!request) return;

    try {
      await rejectRequest.mutateAsync({
        requestId: request.id,
        reviewedBy: 'admin', // TODO: Get from auth context
        rejectionReason: data.rejectionReason,
      });

      toast({
        variant: 'error',
        title: 'Request Rejected',
        description: `Request from ${request.gym_name} has been rejected and the applicant has been notified`,
      });
      
      handleClose();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: 'error',
        title: 'Rejection Failed',
        description: 'Could not reject the request',
      });
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[#0f0f10] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangleIcon className="h-6 w-6 text-red-400" />
            Reject Request
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-1">
            Provide a clear reason for rejecting{' '}
            <span className="font-semibold text-red-400">{request.gym_name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-300">Gym:</span>
              <span className="text-white font-semibold">{request.gym_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-300">Administrator:</span>
              <span className="text-white">
                {request.admin_name} {request.admin_surname1}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-300">Email:</span>
              <span className="text-white">{request.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rejectionReason" className="text-gray-300 font-semibold">
              Rejection Reason
            </Label>
            <textarea
              id="rejectionReason"
              rows={5}
              placeholder="Explain why this request is being rejected..."
              className="w-full px-3 py-2 bg-[#1a1a1b] border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              {...register('rejectionReason')}
            />
            {errors.rejectionReason && (
              <p className="text-sm text-red-400">{errors.rejectionReason.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Minimum 10 characters. This reason will be visible to the applicant.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={rejectRequest.isPending}
              className="border-gray-400 bg-transparent text-gray-100 hover:bg-gray-700 hover:border-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={rejectRequest.isPending}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              {rejectRequest.isPending ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject Request
                </>
              )}
            </Button>
          </DialogFooter>

          {rejectRequest.isError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">
                {rejectRequest.error instanceof Error
                  ? rejectRequest.error.message
                  : 'Error rejecting request'}
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
