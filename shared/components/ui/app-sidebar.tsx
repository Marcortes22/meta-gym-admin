'use client';
import {
  KeyRound,
  Home,
  CalendarPlus,
  Settings,
  Landmark,
  User2,
  ChevronUp,
  LogOut,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './sidebar';
import LogOutButton from '@/modules/auth/components/LogOutButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { usePathname } from 'next/navigation';
import { useCurrentAdmin } from '@/modules/auth/hooks/useCurrentAdmin';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Solicitudes',
    url: '/dashboard/solicitudes',
    icon: CalendarPlus,
  },
  {
    title: 'Tokens',
    url: '/dashboard/tokens',
    icon: KeyRound,
  },
  {
    title: 'Gimnasios',
    url: '/dashboard/gimnasios',
    icon: Landmark,
  },
  {
    title: 'Administración',
    url: '/dashboard/administracion',
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const { data: adminUser, isLoading } = useCurrentAdmin();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-[#0f0f10]">
      <SidebarContent className="bg-[#0f0f10]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#fe6b24] font-bold text-base px-4 py-4">
            Meta Gym
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    {state === 'collapsed' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton 
                            asChild
                            className={`
                              transition-all duration-200 rounded-lg
                              ${isActive 
                                ? 'bg-[#fe6b24] text-white hover:bg-[#fe6b24]/90' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }
                            `}
                          >
                            <a href={item.url}>
                              <item.icon className="h-5 w-5" />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-[#1a1a1b] text-white border-border/40">
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton 
                        asChild
                        className={`
                          transition-all duration-200 rounded-lg
                          ${isActive 
                            ? 'bg-[#fe6b24] text-white hover:bg-[#fe6b24]/90' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        <a href={item.url}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#0f0f10] border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <User2 className="h-5 w-5" />
                  <span className="font-medium">
                    {isLoading ? 'Cargando...' : adminUser?.name || 'Admin'}
                  </span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] bg-[#1a1a1b] border-border/40"
              >
                <DropdownMenuItem className="hover:bg-white/5 cursor-pointer text-gray-300 hover:text-white">
                  <LogOut className="mr-2 h-4 w-4" />
                  <LogOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
