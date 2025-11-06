import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/shared/hooks/useAuth';
import { getUserByEmail } from '../queries/users.queries';
import { queryKeys } from '@/shared/lib/query-keys';
import { AdminUser } from '../types/auth.types';


export function useCurrentAdmin() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.auth.adminUser(user?.email || ''),
    queryFn: async () => {
      if (!user?.email) {
        return null;
      }

      const snapshot = await getUserByEmail(user.email);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        email: data.email,
        name: data.name,
        role: data.role || 'admin',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      } as AdminUser;
    },
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
