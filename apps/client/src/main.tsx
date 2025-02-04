import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster.tsx";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import { NotFound } from "./components/404.tsx";

// Register the service worker for push notifications
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js") // Use the correct path
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
// Create a new router instance with not found handling
const router = createRouter({
  routeTree,
  defaultErrorComponent: ({ error }) => {
    // Log the error
    console.error("Router error:", error);
    return <NotFound />;
  },
  defaultPendingComponent: () => (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg">Loading...</p>
    </div>
  ),
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app with Toaster as a standalone component
// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="shadcn-theme">
      <RouterProvider router={router} />
      <Toaster /> {/* Place Toaster as a sibling to App */}
    </ThemeProvider>
  </StrictMode>
);
