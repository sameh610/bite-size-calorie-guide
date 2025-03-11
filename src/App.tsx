
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CalorieProvider } from "./context/CalorieContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import { AppLayout } from "./components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import ProfileSetup from "./pages/ProfileSetup";
import { useEffect, useState } from "react";
import ProfileUpdatePrompt from "./components/ProfileUpdatePrompt";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [isProfileSet, setIsProfileSet] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if profile exists in local storage
    const userProfile = localStorage.getItem('userProfile');
    setIsProfileSet(!!userProfile);
  }, []);

  // Show loading state while checking
  if (isProfileSet === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {!isProfileSet ? (
        <>
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="*" element={<Navigate to="/profile-setup" replace />} />
        </>
      ) : (
        <>
          <Route 
            path="/" 
            element={
              <AppLayout>
                <ProfileUpdatePrompt />
                <Dashboard />
              </AppLayout>
            } 
          />
          <Route 
            path="/add-entry" 
            element={
              <AppLayout>
                <ProfileUpdatePrompt />
                <AddEntry />
              </AppLayout>
            } 
          />
          <Route 
            path="/history" 
            element={
              <AppLayout>
                <ProfileUpdatePrompt />
                <History />
              </AppLayout>
            } 
          />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProfileProvider>
        <CalorieProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CalorieProvider>
      </UserProfileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
