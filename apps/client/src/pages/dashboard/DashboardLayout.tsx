// src/pages/dashboard/DashboardLayout.tsx

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header";
import { Link } from "react-router-dom";
import { Announcement } from "@/components/ui/announcement";
import { Button } from "@/components/ui/button";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />

        {/* Main content container */}
        <div className="flex-1 flex flex-col">
          <SidebarTrigger className="mb-4" />
          <PageHeader className="shadow p-6">
            <Announcement />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <PageHeaderHeading>Dashboard Overview</PageHeaderHeading>
                <PageHeaderDescription>
                  Welcome to your dashboard! Here you can manage appointments,
                  view updates, and more.
                </PageHeaderDescription>
              </div>
              <PageActions className="flex gap-4">
                <Button asChild size="sm">
                  <Link to="/docs">Get Started</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    to="https://github.com/your-repo"
                  >
                    GitHub
                  </Link>
                </Button>
              </PageActions>
            </div>
          </PageHeader>

          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
