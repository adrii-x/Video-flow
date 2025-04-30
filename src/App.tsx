
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";;
import Share from "./pages/Share";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Upload from "./pages/Upload";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>



          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/share" element={<Share />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />



        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
