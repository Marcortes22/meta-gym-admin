'use client';

import { useEffect } from 'react';
import { initializeSessionManagement } from '@/shared/lib/firebase/session';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeSessionManagement();
  }, []);

  return <>{children}</>;
}
