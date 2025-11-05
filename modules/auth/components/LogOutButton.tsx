'use client';
import { Button } from '@/shared/components/ui/button';
import { useLogout } from '../hooks/useLogout';
import { Loader2 } from 'lucide-react';

export default function LogOutButton() {
  const { logout, isLoading, error } = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  if (error) {
    console.error('Logout error:', error);
  }

  return (
    <Button 
      onClick={handleLogout} 
      disabled={isLoading}
      variant="ghost"
      className="w-full justify-start px-0"
    >
      {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Logging out...
      </>
      ) : (
      'Log Out'
      )}
    </Button>
  );
}
