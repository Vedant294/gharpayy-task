import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RoleGuard } from "@/components/RoleGuard";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Pipeline from "./pages/Pipeline";
import Visits from "./pages/Visits";
import Conversations from "./pages/Conversations";
import Analytics from "./pages/Analytics";
import Historical from "./pages/Historical";
import SettingsPage from "./pages/SettingsPage";
import LeadCapture from "./pages/LeadCapture";
import Owners from "./pages/Owners";
import Inventory from "./pages/Inventory";
import EffortDashboard from "./pages/EffortDashboard";
import Availability from "./pages/Availability";
import Matching from "./pages/Matching";
import Bookings from "./pages/Bookings";
import ZoneManagement from "./pages/ZoneManagement";
import Explore from "./pages/Explore";
import PropertyDetail from "./pages/PropertyDetail";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import OwnerPortal from "./pages/OwnerPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public customer-facing routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/property/:propertyId" element={<PropertyDetail />} />
            <Route path="/capture" element={<LeadCapture />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Owner-facing portal */}
            <Route path="/owner-portal" element={<OwnerPortal />} />

            {/* Internal CRM routes with role guards */}
            <Route path="/dashboard" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager', 'agent']}><Dashboard /></RoleGuard></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager', 'agent']}><Leads /></RoleGuard></ProtectedRoute>} />
            <Route path="/pipeline" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager', 'agent']}><Pipeline /></RoleGuard></ProtectedRoute>} />
            <Route path="/visits" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager', 'agent']}><Visits /></RoleGuard></ProtectedRoute>} />
            <Route path="/conversations" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager', 'agent']}><Conversations /></RoleGuard></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager']}><Analytics /></RoleGuard></ProtectedRoute>} />
            <Route path="/historical" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager']}><Historical /></RoleGuard></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager']}><SettingsPage /></RoleGuard></ProtectedRoute>} />
            <Route path="/owners" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager']}><Owners /></RoleGuard></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager', 'owner']}><Inventory /></RoleGuard></ProtectedRoute>} />
            <Route path="/effort" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager']}><EffortDashboard /></RoleGuard></ProtectedRoute>} />
            <Route path="/availability" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager', 'owner']}><Availability /></RoleGuard></ProtectedRoute>} />
            <Route path="/matching" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager', 'agent']}><Matching /></RoleGuard></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager', 'agent', 'owner']}><Bookings /></RoleGuard></ProtectedRoute>} />
            <Route path="/zones" element={<ProtectedRoute><RoleGuard requiredRoles={['admin', 'manager']}><ZoneManagement /></RoleGuard></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
