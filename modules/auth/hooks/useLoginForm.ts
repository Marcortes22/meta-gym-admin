import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LoginFormData, loginSchema } from '../models/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '../services/auth.service';
import { useMutation } from '@tanstack/react-query';

/**
 * Custom hook para manejar el formulario de login
 * Utiliza React Hook Form para validación y TanStack Query para mutations
 */
export function useLoginForm() {
  const router = useRouter();
  const { signIn, checkAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // TanStack Query mutation para el login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await loginUser(data.email, data.password, signIn);
    },
    onSuccess: async (result) => {
      if (result.success) {
        // Revalidar el estado de autenticación
        await checkAuth();

        // Redirigir al dashboard
        router.push('/dashboard');
        router.refresh();
      }
    },
    onError: (error) => {
      console.error('Login mutation error:', error);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const isFormLoading = isSubmitting || loginMutation.isPending;
  const error = loginMutation.data?.success === false ? loginMutation.data.error : null;

  return {
    register,
    handleSubmit,
    onSubmit,
    error,
    isFormLoading,
    errors,
  };
}
