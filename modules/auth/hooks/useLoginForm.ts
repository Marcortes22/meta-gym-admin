import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginFormData, loginSchema } from '../models/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { db } from '@/shared/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';

export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn, checkAuth } = useAuth();

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

      // Primero verificar si el usuario existe en la colección global_users
      const usersRef = collection(db, 'global_users');
      const q = query(usersRef, where('email', '==', data.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No tienes autorización para acceder al panel de administración');
        setIsLoading(false);
        return;
      }

      // Si existe en global_users, intentar autenticar con Firebase Auth
      const { data: userCredential, error: authError } = await signIn(data.email, data.password);

      if (authError) {
        const errorMessage = getFirebaseErrorMessage(authError.code);
        setError(errorMessage);
        return;
      }

      // Establecer la cookie de sesión inmediatamente
      if (userCredential?.user) {
        const token = await userCredential.user.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
      }

      // Revalidar el estado de autenticación
      await checkAuth();

      router.push('/dashboard');
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

function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'El correo electrónico no es válido';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada';
    case 'auth/user-not-found':
      return 'Credenciales inválidas';
    case 'auth/wrong-password':
      return 'Credenciales inválidas';
    case 'auth/invalid-credential':
      return 'Credenciales inválidas';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Intenta más tarde';
    default:
      return 'Credenciales inválidas';
  }
}
