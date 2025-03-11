
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CalorieProvider } from "./context/CalorieContext";
import { AppLayout } from "./components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CalorieProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-entry" element={<AddEntry />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </CalorieProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
