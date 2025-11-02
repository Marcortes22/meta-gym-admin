'use client';

import { AppSidebar } from '@/shared/components/ui/app-sidebar';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-screen bg-[#0f0f10]">
        <div className="border-b border-border/40 bg-[#0f0f10]/95 backdrop-blur supports-backdrop-filter:bg-[#0f0f10]/80 sticky top-0 z-50">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <SidebarTrigger className="text-gray-400 hover:text-[#fe6b24] transition-colors" />
          </div>
        </div>
        <div className="container max-w-screen-2xl">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
