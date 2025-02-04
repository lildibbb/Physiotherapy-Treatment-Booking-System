import { NavMain } from "@/components/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BadgeCheck,
  Bell,
  Calendar,
  Home,
  House,
  NotebookPen,
  Sparkles,
  Users,
} from "lucide-react";
import type * as React from "react";
import { ModeToggle } from "./ui/mode-toggle";
import { NavUser } from "./nav-staff";

// Main navigation items
const navItems = [
  // {
  //   title: "Dashboard",
  //   url: "/staff/dashboard",
  //   icon: Home,
  // },
  {
    title: "Home",
    url: "/",
    icon: House,
  },
  {
    title: "Appointments",
    url: "/staff/appointment",
    icon: Calendar,
  },

  {
    title: "Physiotherapist",
    url: "/staff/therapist_list",
    icon: Users,
  },
];

// User-specific navigation items
export const navUserItems = [
  {
    title: "Account",
    url: "/staff/profile",
    icon: BadgeCheck,
  },

  {
    title: "Notifications",
    url: "/staff/notification",
    icon: Bell,
  },
  {
    title: "Customer Support",
    url: "/support",
    icon: Sparkles,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ModeToggle />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} /> {/* Use navItems directly */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser /> {/* Use NavUser directly to show current user info */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
