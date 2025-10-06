'use client';

import { AppSidebar } from '@/shared/components/ui/app-sidebar';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
