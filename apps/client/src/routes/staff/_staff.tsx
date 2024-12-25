import { AppSidebar } from "@/components/app-sidebar-patient";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/staff/_staff")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
