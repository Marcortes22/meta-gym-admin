'use client';

import { useState } from 'react';
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
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useApproveRequest } from '@/modules/solicitudes/hooks/use-gym-requests.hooks';
import {
  approveRequestSchema,
  type ApproveRequestFormData,
} from '@/modules/solicitudes/models/schemas';
import { CheckCircleIcon, Loader2Icon, KeyIcon, MailIcon } from 'lucide-react';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const approveRequest = useApproveRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    setShowSuccess(false);
    onOpenChange(false);
  };

  const onSubmit = async (data: ApproveRequestFormData) => {
    if (!request) return;

    try {
      await approveRequest.mutateAsync({
        request,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
      });

      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
    }
  };

  if (!request) return null;

  // Success state
  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-[#0f0f10] border-gray-800 text-white">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="p-4 bg-green-500/20 rounded-full">
              <CheckCircleIcon className="h-16 w-16 text-green-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">¡Solicitud Aprobada!</h3>
              <p className="text-gray-400">
                El gimnasio ha sido creado exitosamente
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[#0f0f10] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Aprobar Solicitud
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-1">
            Crea una cuenta de administrador para{' '}
            <span className="font-semibold text-[#fe6b24]">{request.gym_name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Información del gym */}
          <div className="p-4 bg-[#1a1a1b] rounded-lg border border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Gimnasio:</span>
              <span className="text-white font-semibold">{request.gym_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Administrador:</span>
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

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="adminEmail" className="text-gray-300 font-semibold flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-[#fe6b24]" />
              Correo Electrónico del Administrador
            </Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="admin@gimnasio.com"
              className="bg-[#1a1a1b] border-gray-700 text-white placeholder:text-gray-500"
              {...register('adminEmail')}
            />
            {errors.adminEmail && (
              <p className="text-sm text-red-400">{errors.adminEmail.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="adminPassword" className="text-gray-300 font-semibold flex items-center gap-2">
              <KeyIcon className="h-4 w-4 text-[#fe6b24]" />
              Contraseña
            </Label>
            <Input
              id="adminPassword"
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="bg-[#1a1a1b] border-gray-700 text-white placeholder:text-gray-500"
              {...register('adminPassword')}
            />
            {errors.adminPassword && (
              <p className="text-sm text-red-400">{errors.adminPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300 font-semibold flex items-center gap-2">
              <KeyIcon className="h-4 w-4 text-[#fe6b24]" />
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite la contraseña"
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
              className="border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={approveRequest.isPending}
              className="bg-[#fe6b24] hover:bg-[#ff7a35] text-white font-semibold"
            >
              {approveRequest.isPending ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Aprobando...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Aprobar Solicitud
                </>
              )}
            </Button>
          </DialogFooter>

          {approveRequest.isError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">
                {approveRequest.error instanceof Error
                  ? approveRequest.error.message
                  : 'Error al aprobar la solicitud'}
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
