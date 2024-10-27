// src/pages/dashboard/DashboardLayout.tsx

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"; // Import SidebarProvider
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header";
import { Link } from "react-router-dom"; // Import Link for navigation within the SPA
import { Announcement } from "@/components/ui/announcement";
import { Button } from "@/components/ui/button";
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Book your appointment now!</PageHeaderHeading>
        <PageHeaderDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
          possimus iure saepe mollitia corrupti eaque exercitationem autem
          provident quisquam optio, at excepturi vero sunt velit architecto
          nobis nulla magni ad.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link to="/docs">Get Started</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link target="_blank" rel="noreferrer" to={""}>
              GitHub
            </Link>
          </Button>
        </PageActions>
      </PageHeader>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
