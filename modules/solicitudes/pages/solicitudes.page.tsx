'use client';

import { useState } from 'react';
import { useGymRequestsByState } from '@/modules/solicitudes/hooks/use-gym-requests.hooks';
import { DataTable } from '@/shared/components/data-table/data-table';
import { createColumns } from '@/modules/solicitudes/components/gym-requests-columns';
import { GymRequestDetailsDialog } from '@/modules/solicitudes/components/gym-request-details-dialog.component';
import { ApproveRequestDialog } from '@/modules/solicitudes/components/approve-request-dialog.component';
import { RejectRequestDialog } from '@/modules/solicitudes/components/reject-request-dialog.component';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { GymRequest } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

type FilterState = GymRequest['state'] | 'all';

const filters: { label: string; value: FilterState }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export function SolicitudesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterState>('all');
  const [selectedRequest, setSelectedRequest] = useState<GymRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const { data: requests = [], isLoading, error } = useGymRequestsByState(activeFilter);

  // Debug
  console.log('Filter:', activeFilter);
  console.log('Loading:', isLoading);
  console.log('Requests:', requests);
  console.log('Error:', error);

  const handleViewDetails = (request: GymRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleApprove = (request: GymRequest) => {
    setSelectedRequest(request);
    setIsApproveOpen(true);
  };

  const handleReject = (request: GymRequest) => {
    setSelectedRequest(request);
    setIsRejectOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header with breadcrumb-like context */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Gym Requests
          </h1>
          <p className="text-gray-400 mt-1">
            Review and approve gym registration requests
          </p>
        </div>
        
        {/* Status indicator */}
        {!isLoading && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">Live</span>
          </div>
        )}
      </div>

      {/* Filter tabs with active indicator */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex gap-1" role="group" aria-label="Filter requests by status">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <Button
                key={filter.value}
                aria-pressed={isActive}
                aria-label={`Filter by ${filter.label}`}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  'relative transition-all',
                  isActive
                    ? 'bg-[#fe6b24] hover:bg-[#fe6b24]/90 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1b]'
                )}
              >
                {filter.label}
                {isActive && (
                  <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#fe6b24]" />
                )}
              </Button>
            );
          })}
        </div>
        
        {/* Result counter with icon */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {isLoading ? (
            <Skeleton className="h-5 w-28 bg-gray-700/50" />
          ) : (
            <>
              <svg 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <span>
                <span className="font-semibold text-white">{requests.length}</span>{' '}
                {requests.length === 1 ? 'request' : 'requests'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={createColumns(handleViewDetails, handleApprove, handleReject)}
        data={requests}
        isLoading={isLoading}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 50]}
        emptyMessage="No gym requests found"
        emptyDescription="Gym registration requests will appear here for review"
      />

      {/* Details Dialog */}
      <GymRequestDetailsDialog
        request={selectedRequest}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      {/* Approve Dialog */}
      <ApproveRequestDialog
        request={selectedRequest}
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
      />

      {/* Reject Dialog */}
      <RejectRequestDialog
        request={selectedRequest}
        open={isRejectOpen}
        onOpenChange={setIsRejectOpen}
      />
    </div>
  );
}
