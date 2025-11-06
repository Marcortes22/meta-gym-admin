'use client';

import { ColumnDef } from '@tanstack/react-table';
import { GymRequest } from '@/shared/types';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { EyeIcon } from 'lucide-react';

interface ActionsCellProps {
  request: GymRequest;
  onViewDetails: (request: GymRequest) => void;
  onApprove: (request: GymRequest) => void;
  onReject: (request: GymRequest) => void;
}

function ActionsCell({ request, onViewDetails, onApprove, onReject }: ActionsCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onViewDetails(request)}
        className="border-gray-500 bg-gray-800/50 text-white font-medium hover:bg-gray-700 hover:border-gray-400 transition-all"
      >
        <EyeIcon className="h-4 w-4 mr-1.5" />
        View
      </Button>


      {request.state === 'pending' && (
        <>
          <Button
            size="sm"
            onClick={() => onApprove(request)}
            className="bg-[#fe6b24] hover:bg-[#ff7a35] text-white font-semibold shadow-sm transition-all"
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(request)}
            className="border-red-400 bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20 hover:border-red-300 transition-all"
          >
            Reject
          </Button>
        </>
      )}
    </div>
  );
}

export function createColumns(
  onViewDetails: (request: GymRequest) => void,
  onApprove: (request: GymRequest) => void,
  onReject: (request: GymRequest) => void
): ColumnDef<GymRequest>[] {
  return [
    {
      accessorKey: 'id',
      header: 'REQUEST ID',
      cell: ({ row }) => (
        <div className="font-mono text-xs text-gray-400 font-medium">{row.original.id.slice(0, 8)}...</div>
      ),
    },
    {
      accessorKey: 'gym_name',
      header: 'GYM NAME',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-white">{row.original.gym_name}</div>
          {row.original.company_name && (
            <div className="text-sm text-gray-400 mt-0.5">
              {row.original.company_name}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'EMAIL',
      cell: ({ row }) => (
        <div className="text-sm text-gray-200 font-medium">{row.original.email}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'REQUEST DATE',
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return (
          <div className="text-sm text-gray-200">
            {date instanceof Date
              ? date.toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })
              : 'N/A'}
          </div>
        );
      },
    },
    {
      accessorKey: 'state',
      header: 'STATE',
      cell: ({ row }) => {
        const state = row.original.state;
        const variants = {
          pending: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
          approved: 'bg-green-500/15 text-green-400 border border-green-500/30',
          rejected: 'bg-red-500/15 text-red-400 border border-red-500/30',
        };
        
        const stateLabels = {
          pending: 'Pending',
          approved: 'Approved',
          rejected: 'Rejected',
        };

        return (
          <Badge className={`${variants[state]} font-semibold`}>
            {stateLabels[state]}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      cell: ({ row }) => (
        <ActionsCell
          request={row.original}
          onViewDetails={onViewDetails}
          onApprove={onApprove}
          onReject={onReject}
        />
      ),
    },
  ];
}
