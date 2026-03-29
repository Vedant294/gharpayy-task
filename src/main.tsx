import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedData } from "./lib/seedData";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Seed data on first load
seedData().catch(console.error);

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
