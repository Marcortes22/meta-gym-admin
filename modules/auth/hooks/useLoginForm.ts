import { createClient } from '@/shared/api/supabase/client';
import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginFormData, loginSchema } from '../models/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { checkAuth } = useAuth();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        setError('Email o contraseña incorrectos');
        return;
      }

      // Revalidar el estado de autenticación
      await checkAuth();

     
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError('Error inesperado al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  return {
    register,
    handleSubmit,
    onSubmit,
    error,
    isFormLoading,
    errors,
  };
}
