
import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Home, PieChart, ListPlus, History, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  view: string;
  icon: React.ReactNode;
  label: string;
  onNavigate: (view: string) => void;
  currentView: string;
}

const NavItem = ({ view, icon, label, onNavigate, currentView }: NavItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild>
      <Button
        onClick={() => onNavigate(view)}
        className={`flex items-center gap-3 py-3 px-4 rounded-md transition-all w-full justify-start ${
          currentView === view ? 'bg-cal-purple text-white' : 'hover:bg-cal-purple-light'
        }`}
        variant="ghost"
      >
        {icon}
        <span>{label}</span>
      </Button>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

interface AppSidebarProps {
  onNavigate: (view: string) => void;
  onSignOut: () => void;
  currentView?: string;
}

const AppSidebar = ({ onNavigate, onSignOut, currentView = 'dashboard' }: AppSidebarProps) => {
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
          <NavItem view="dashboard" icon={<Home className="h-5 w-5" />} label="Dashboard" onNavigate={onNavigate} currentView={currentView} />
          <NavItem view="add-entry" icon={<ListPlus className="h-5 w-5" />} label="Add Entry" onNavigate={onNavigate} currentView={currentView} />
          <NavItem view="history" icon={<History className="h-5 w-5" />} label="History" onNavigate={onNavigate} currentView={currentView} />
        </SidebarMenu>
        <div className="mt-auto pt-6 px-4">
          <Button onClick={onSignOut} variant="outline" className="w-full">Sign Out</Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export const AppLayout = ({ children, onNavigate, onSignOut }: { children: React.ReactNode, onNavigate: (view: string) => void, onSignOut: () => void }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    onNavigate(view);
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onNavigate={handleNavigate} onSignOut={onSignOut} currentView={currentView} />
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
