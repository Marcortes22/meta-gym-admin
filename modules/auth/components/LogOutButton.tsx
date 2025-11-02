'use client';
import { useAuth } from '@/shared/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LogOutButton() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
    } else {
      // Forzar recarga completa para que el middleware se ejecute
      router.push('/login');
      router.refresh();
    }
  };

  return <Button onClick={handleLogout}>Sign out</Button>;
}
