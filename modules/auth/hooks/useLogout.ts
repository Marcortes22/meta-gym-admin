import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/hooks/useAuth';
import { logoutUser } from '../services/auth.service';


export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signOut } = useAuth();

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await logoutUser(signOut);

      if (!result.success) {
        setError(result.error || 'Error al cerrar sesión');
        return false;
      }
      router.push('/login');
      router.refresh();
      return true;
    } catch (err) {
      setError('Error inesperado al cerrar sesión');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error,
  };
}
