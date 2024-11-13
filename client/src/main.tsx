import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster.tsx";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

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
	</StrictMode>,
);
