
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Home, PieChart, ListPlus, History, Menu } from 'lucide-react';
import SignOutButton from './SignOutButton';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 py-3 px-4 rounded-md transition-all ${
            isActive ? 'bg-cal-purple text-white' : 'hover:bg-cal-purple-light'
          }`
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const AppSidebar = () => {
  return (
    <Sidebar className="border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <PieChart className="h-6 w-6 text-cal-purple" />
          <span>CalTracker</span>
        </h1>
      </div>
      <SidebarContent className="flex flex-col h-full">
        <SidebarMenu>
          <NavItem to="/" icon={<Home className="h-5 w-5" />} label="Dashboard" />
          <NavItem to="/add-entry" icon={<ListPlus className="h-5 w-5" />} label="Add Entry" />
          <NavItem to="/history" icon={<History className="h-5 w-5" />} label="History" />
        </SidebarMenu>
        <div className="mt-auto pt-6 px-4">
          <SignOutButton />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="p-4 border-b border-gray-200 flex items-center md:hidden">
            <SidebarTrigger>
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <h1 className="text-xl font-bold flex items-center gap-2 ml-4">
              <PieChart className="h-6 w-6 text-cal-purple" />
              <span>CalTracker</span>
            </h1>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppSidebar;
