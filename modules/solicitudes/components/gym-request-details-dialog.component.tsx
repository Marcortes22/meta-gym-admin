'use client';

import { GymRequest } from '@/shared/types/gym-request.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { format } from 'date-fns';
import {
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  XCircleIcon,
  KeyIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserNameByUid } from '../queries/users.queries';

interface GymRequestDetailsDialogProps {
  request: GymRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GymRequestDetailsDialog({
  request,
  open,
  onOpenChange,
}: GymRequestDetailsDialogProps) {
  const [reviewerName, setReviewerName] = useState<string | null>(null);

  // Fetch reviewer name when request changes
  useEffect(() => {
    async function fetchReviewerName() {
      if (request?.reviewedBy) {
        const name = await getUserNameByUid(request.reviewedBy);
        setReviewerName(name);
      } else {
        setReviewerName(null);
      }
    }

    fetchReviewerName();
  }, [request?.reviewedBy]);

  if (!request) return null;

  const stateVariants = {
    pending: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    approved: 'bg-green-500/15 text-green-400 border border-green-500/30',
    rejected: 'bg-red-500/15 text-red-400 border border-red-500/30',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[#0f0f10] border-gray-800 text-white max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-800">
          <DialogTitle className="text-2xl font-bold text-white">
            Gym Request Details
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-1">
            Complete information about the gym registration request
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {/* Status Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <span className="text-sm font-medium text-gray-400">Status</span>
            <Badge className={`${stateVariants[request.state]} font-semibold`}>
              {request.state.charAt(0).toUpperCase() + request.state.slice(1)}
            </Badge>
          </div>

          {/* Request ID */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Request ID
            </label>
            <p className="text-white font-mono text-sm bg-[#1a1a1b] p-3 rounded-md border border-gray-800">
              {request.id}
            </p>
          </div>

          {/* Gym Information */}
          <div className="space-y-4 p-5 bg-[#1a1a1b] rounded-lg border border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#fe6b24]/10 rounded-lg">
                <BuildingIcon className="h-5 w-5 text-[#fe6b24]" />
              </div>
              <h3 className="text-lg font-bold text-[#fe6b24]">Gym Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Gym Name</label>
                <p className="text-white font-semibold">{request.gym_name}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Company Name</label>
                <p className="text-gray-200">{request.company_name}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-300">Address</label>
                <p className="text-gray-200">{request.gym_address}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Gym Phone</label>
                <p className="text-gray-200">{request.gym_phone}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Requested Plan</label>
                <p className="text-gray-200 capitalize">
                  {request.requested_plan.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Information */}
          <div className="space-y-4 p-5 bg-[#1a1a1b] rounded-lg border border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#fe6b24]/10 rounded-lg">
                <UserIcon className="h-5 w-5 text-[#fe6b24]" />
              </div>
              <h3 className="text-lg font-bold text-[#fe6b24]">Administrator Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-300">Full Name</label>
                <p className="text-white font-semibold">
                  {request.admin_name} {request.admin_surname1} {request.admin_surname2}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Email</label>
                <p className="text-white font-medium break-all">{request.email}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Phone</label>
                <p className="text-gray-200">{request.admin_phone}</p>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="space-y-4 p-5 bg-[#1a1a1b] rounded-lg border border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#fe6b24]/10 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-[#fe6b24]" />
              </div>
              <h3 className="text-lg font-bold text-[#fe6b24]">Request Timeline</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Request Date</label>
                <p className="text-gray-200">
                  {format(request.date, 'PPP')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Created At</label>
                <p className="text-gray-200">
                  {format(request.createdAt, 'PPP')}
                </p>
              </div>

              {request.reviewedAt && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Reviewed At</label>
                    <p className="text-gray-200">
                      {format(request.reviewedAt, 'PPP')}
                    </p>
                  </div>

                  {request.reviewedBy && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-300">Reviewed By</label>
                      <p className="text-gray-200">
                        {reviewerName || request.reviewedBy}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Rejection Reason (if rejected) */}
          {request.state === 'rejected' && request.rejectionReason && (
            <div className="space-y-3 p-5 bg-red-500/10 rounded-lg border border-red-500/30 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <label className="text-sm font-semibold text-red-400">Rejection Reason</label>
              </div>
              <p className="text-red-300 pl-11">{request.rejectionReason}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
