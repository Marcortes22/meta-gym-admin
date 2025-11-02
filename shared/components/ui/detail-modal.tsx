/**
 * Reusable modal component for displaying detailed information
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: DetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0f0f10] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-gray-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Detail field component for consistent display
 */
interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

export function DetailField({ label, value, icon }: DetailFieldProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      {icon && (
        <div className="flex-shrink-0 text-gray-400 mt-0.5">{icon}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
        <div className="text-base text-white break-words">{value}</div>
      </div>
    </div>
  );
}

/**
 * Detail section component for grouping related fields
 */
interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
