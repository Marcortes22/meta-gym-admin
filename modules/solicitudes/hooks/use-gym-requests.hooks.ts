import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllGymRequests, 
  getGymRequestsByState, 
  updateGymRequestState 
} from '../queries/gym-requests.queries';
import { 
  approveGymRequestService,
  type ApproveGymRequestInput,
} from '../services/approval.service';
import { GymRequest } from '@/shared/types';
import { queryKeys } from '@/shared/lib/query-keys';
import { useAuth } from '@/shared/hooks/useAuth';


export function useGymRequests() {
  return useQuery({
    queryKey: queryKeys.gymRequests.all,
    queryFn: getAllGymRequests,
  });
}


export function useGymRequestsByState(state: GymRequest['state'] | 'all') {
  return useQuery({
    queryKey: queryKeys.gymRequests.byState(state),
    queryFn: async () => {
      console.log('Fetching requests for state:', state); 
      if (state === 'all') {
        const data = await getAllGymRequests();
        console.log('All requests:', data.length); 
        return data;
      }
      const data = await getGymRequestsByState(state);
      console.log(`Requests for ${state}:`, data.length);
      return data;
    },
    staleTime: 0, 
  });
}


export function useApproveRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      request,
      adminEmail,
      adminPassword,
    }: {
      request: GymRequest;
      adminEmail: string;
      adminPassword: string;
    }) => {
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const input: ApproveGymRequestInput = {
        requestId: request.id,
        request,
        adminEmail,
        adminPassword,
        reviewedBy: user.uid,
      };

      return await approveGymRequestService(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gymRequests.all });
    },
  });
}


export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      reviewedBy,
      rejectionReason,
    }: {
      requestId: string;
      reviewedBy: string;
      rejectionReason?: string;
    }) => {
      await updateGymRequestState(requestId, 'rejected', reviewedBy, {
        rejectionReason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gymRequests.all });
    },
  });
}
