'use client';
import {
  KeyRound,
  Home,
  Inbox,
  CalendarPlus,
  Settings,
  Landmark,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './sidebar';
import LogOutButton from '@/modules/auth/components/LogOutButton';

const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Requests',
    url: '#',
    icon: CalendarPlus,
  },
  {
    title: 'Tokens',
    url: '#',
    icon: KeyRound,
  },
  {
    title: 'Tenants & Gyms',
    url: '#',
    icon: Landmark,
  },
  {
    title: 'Administration',
    url: '#',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogOutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
