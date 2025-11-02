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

/**
 * Hook para obtener todas las solicitudes
 */
export function useGymRequests() {
  return useQuery({
    queryKey: queryKeys.gymRequests.all,
    queryFn: getAllGymRequests,
  });
}

/**
 * Hook para obtener solicitudes por estado
 */
export function useGymRequestsByState(state: GymRequest['state'] | 'all') {
  return useQuery({
    queryKey: queryKeys.gymRequests.byState(state),
    queryFn: async () => {
      console.log('Fetching requests for state:', state); // Debug
      if (state === 'all') {
        const data = await getAllGymRequests();
        console.log('All requests:', data.length); // Debug
        return data;
      }
      const data = await getGymRequestsByState(state);
      console.log(`Requests for ${state}:`, data.length); // Debug
      return data;
    },
    staleTime: 0, // Siempre refetch para ver cambios inmediatos
  });
}

/**
 * Hook para aprobar una solicitud (proceso completo)
 * Crea tenant, subscription, gym, usuario auth y actualiza la solicitud
 */
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
      // Invalidar todas las queries de solicitudes para refrescar la lista
      queryClient.invalidateQueries({ queryKey: queryKeys.gymRequests.all });
    },
  });
}

/**
 * Hook para rechazar una solicitud
 */
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
