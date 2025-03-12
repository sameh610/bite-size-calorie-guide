
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CalorieProvider } from "./context/CalorieContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import { AuthProvider } from "./context/AuthContext";
import { useState, useEffect } from "react";
import { AppLayout } from "./components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import ProfileSetup from "./pages/ProfileSetup";
import ProfileUpdatePrompt from "./components/ProfileUpdatePrompt";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const queryClient = new QueryClient();

// Define view types
type ViewType = "signin" | "signup" | "profile-setup" | "dashboard" | "add-entry" | "history";

const App = () => {
  const [currentView, setCurrentView] = useState<ViewType>("signin");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      setIsAuthenticated(true);
      const userData = JSON.parse(authUser);
      const profileKey = `userProfile_${userData.email}`;
      const userProfile = localStorage.getItem(profileKey);
      
      if (userProfile) {
        setHasProfile(true);
        setCurrentView("dashboard");
      } else {
        setCurrentView("profile-setup");
      }
    } else {
      setCurrentView("signin");
    }
  }, []);

  // Handler for navigation
  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
  };

  // Handler for sign out
  const handleSignOut = () => {
    localStorage.removeItem('authUser');
    setIsAuthenticated(false);
    setHasProfile(false);
    setCurrentView("signin");
  };

  // Handler for sign in
  const handleSignIn = (hasUserProfile: boolean) => { 
    setIsAuthenticated(true); 
    setHasProfile(hasUserProfile);
    setCurrentView(hasUserProfile ? "dashboard" : "profile-setup");
  };
  
  // Handler for sign up
  const handleSignUp = () => {
    setIsAuthenticated(true);
    setHasProfile(false);
    setCurrentView("profile-setup");
  };
  
  // Handler for profile setup completion
  const handleProfileComplete = () => {
    setHasProfile(true);
    setCurrentView("dashboard");
  };

  // Render content based on current view and auth status
  const renderContent = () => {
    if (!isAuthenticated) {
      if (currentView === "signup") {
        return <SignUp onSignUp={handleSignUp} onNavigate={navigateTo} />;
      }
      return <SignIn onSignIn={handleSignIn} onNavigate={navigateTo} />;
    }

    if (!hasProfile || currentView === "profile-setup") {
      return <ProfileSetup onComplete={handleProfileComplete} />;
    }

    // Main app views
    switch (currentView) {
      case "dashboard":
        return (
          <AppLayout onNavigate={navigateTo} onSignOut={handleSignOut}>
            <ProfileUpdatePrompt />
            <Dashboard />
          </AppLayout>
        );
      case "add-entry":
        return (
          <AppLayout onNavigate={navigateTo} onSignOut={handleSignOut}>
            <ProfileUpdatePrompt />
            <AddEntry />
          </AppLayout>
        );
      case "history":
        return (
          <AppLayout onNavigate={navigateTo} onSignOut={handleSignOut}>
            <ProfileUpdatePrompt />
            <History />
          </AppLayout>
        );
      default:
        return (
          <AppLayout onNavigate={navigateTo} onSignOut={handleSignOut}>
            <NotFound />
          </AppLayout>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <UserProfileProvider>
            <CalorieProvider>
              <Toaster />
              <Sonner />
              {renderContent()}
            </CalorieProvider>
          </UserProfileProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
