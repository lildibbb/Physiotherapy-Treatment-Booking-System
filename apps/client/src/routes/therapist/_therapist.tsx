import * as React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar-therapist";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/therapist/_therapist")({
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
