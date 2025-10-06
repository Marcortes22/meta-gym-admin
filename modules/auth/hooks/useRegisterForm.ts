import { createClient } from '@/shared/api/supabase/client';
import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RegisterFormData, registerSchema } from '../models/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

export function useRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { checkAuth } = useAuth();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const { error: authError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este email ya está registrado');
        } else {
          setError('Error al crear la cuenta: ' + authError.message);
        }
        return;
      }

      // Si el registro fue exitoso pero necesita confirmación
      if (authData.user && !authData.session) {
        setSuccess(true);
        return;
      }

      // Si el registro fue exitoso y ya está autenticado
      if (authData.session) {
        await checkAuth();
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Error inesperado al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  return {
    register,
    handleSubmit,
    isFormLoading,
    error,
    success,
    onSubmit,
    errors
  };
}
