'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>MetaGym Admin</SidebarMenuItem>
            <SidebarMenuItem>Dashboard Principal</SidebarMenuItem>
            <SidebarMenuItem>Configuración</SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Gestión</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>Gimnasios</SidebarMenuItem>
              <SidebarMenuItem>Usuarios</SidebarMenuItem>
              <SidebarMenuItem>Planes</SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Reportes</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>Analytics</SidebarMenuItem>
              <SidebarMenuItem>Facturación</SidebarMenuItem>
              <SidebarMenuItem>Estadísticas</SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>Perfil</SidebarMenuItem>
            <SidebarMenuItem>Soporte</SidebarMenuItem>
            <SidebarMenuItem>Cerrar Sesión</SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <div className="p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}