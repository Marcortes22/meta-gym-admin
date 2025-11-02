/**
 * Confirmation Modal Component
 * Visual confirmation dialog for admin actions
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export type ConfirmationVariant = 'warning' | 'danger' | 'success' | 'info';

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

const variantConfig = {
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    buttonClass: 'bg-yellow-500 hover:bg-yellow-600 text-black',
  },
  danger: {
    icon: XCircle,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    buttonClass: 'bg-red-500 hover:bg-red-600 text-white',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    buttonClass: 'bg-green-500 hover:bg-green-600 text-white',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    buttonClass: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
};

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  onConfirm,
  isLoading = false,
}: ConfirmationModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${config.iconBg} ${config.borderColor}`}
            >
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-xl font-semibold text-white">
                {title}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-base">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-6 flex-row gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 border-gray-700 bg-gray-800 text-white hover:bg-gray-700 hover:text-white"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 ${config.buttonClass}`}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
