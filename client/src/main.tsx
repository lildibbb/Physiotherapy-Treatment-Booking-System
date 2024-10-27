import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "@/components/ui/toaster.tsx"; // Adjust the path if necessary
import { ThemeProvider } from "@/components/ui/theme-provider";

// Render the app with Toaster as a standalone component
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="shadcn-theme">
      <App />
      <Toaster /> {/* Place Toaster as a sibling to App */}
    </ThemeProvider>
  </StrictMode>
);
