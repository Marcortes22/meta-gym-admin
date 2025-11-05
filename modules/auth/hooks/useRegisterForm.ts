import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RegisterFormData, registerSchema } from '../models/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfile } from 'firebase/auth';

export function useRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { signUp, checkAuth } = useAuth();

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

      const { data: authData, error: authError } = await signUp(
        data.email,
        data.password
      );

      if (authError) {
        const errorMessage = getFirebaseErrorMessage(authError.code);
        setError(errorMessage);
        return;
      }

      if (authData?.user) {
        await updateProfile(authData.user, {
          displayName: data.name,
        });

        await checkAuth();
        setSuccess(true);
        

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
    errors,
  };
}

function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este email ya está registrado';
    case 'auth/invalid-email':
      return 'El correo electrónico no es válido';
    case 'auth/operation-not-allowed':
      return 'Operación no permitida';
    case 'auth/weak-password':
      return 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres';
    default:
      return 'Error al crear la cuenta';
  }
}
