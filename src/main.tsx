import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedData } from "./lib/seedData";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { whiteLabelService } from "./lib/whiteLabelService";

// Seed data on first load
seedData().catch(console.error);

// Apply white-label branding
const applyBranding = async () => {
  const { data: session } = await import('@/integrations/supabase/client').then(({ supabase }) => supabase.auth.getSession());
  const userId = session?.data?.session?.user?.id;
  
  if (userId) {
    const branding = await whiteLabelService.getBrandingData(userId);
    whiteLabelService.applyBrandingToDocument(branding);
  }
};

applyBranding().catch(console.error);

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
