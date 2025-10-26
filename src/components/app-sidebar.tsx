'use client';

import * as React from 'react';
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuthSelector } from '@/features/auth/hooks.redux';

type UserRole = 'USER' | 'WORKER' | 'ADMIN';

interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
}

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  items?: { title: string; url: string }[];
}

interface DocumentItem {
  name: string;
  url: string;
  icon: React.ComponentType<any>;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user,role } = useAuthSelector()

  // Base nav items with actual routes
  const navMainBase: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: IconDashboard },
  ];

  // Role-based filtering
  let navMain: NavItem[] = [];
  let navClouds: NavItem[] = [];
  let navSecondary: NavItem[] = [];
  let documents: DocumentItem[] = [];

  switch (role) {
    case 'ADMIN':
      navMain = navMainBase;
      break;

    default:
      navMain = [];
      navClouds = [];
      navSecondary = [];
      documents = [];
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain as any} />
      </SidebarContent>

      <SidebarFooter>
        {user && <NavUser user={user as any} />}
      </SidebarFooter>
    </Sidebar>
  );
}
