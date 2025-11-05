import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LoginFormData, loginSchema } from '../models/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '../services/auth.service';
import { useMutation } from '@tanstack/react-query';


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
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await loginUser(data.email, data.password, signIn);
    },
    onSuccess: async (result) => {
      if (result.success) {
        await checkAuth();
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
