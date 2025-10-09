'use client';
import { createClient } from '@/shared/api/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LogOutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
    } else {
      // Forzar recarga completa para que el middleware se ejecute
      router.push('/login');
    }
  };

  return <Button onClick={handleLogout}>Sign out</Button>;
}
