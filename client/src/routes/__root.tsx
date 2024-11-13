import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: () => (
		<>
			<SidebarProvider>
				<AppSidebar />
				<Outlet />
				<TanStackRouterDevtools position="bottom-right" />
			</SidebarProvider>
		</>
	),
});
