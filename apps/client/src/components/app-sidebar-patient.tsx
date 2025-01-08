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
  NotebookPen,
  Sparkles,
  Users,
} from "lucide-react";
import type * as React from "react";
import { ModeToggle } from "./ui/mode-toggle";
import { NavUser } from "./nav-user";

// Main navigation items
const navItems = [
  // {
  //   title: "Dashboard",
  //   url: "/user/dashboard",
  //   icon: Home,
  // },

  {
    title: "Appointments",
    url: "/user/appointment",
    icon: Calendar,
  },

  {
    title: "Book",
    url: "/findDoctor",
    icon: NotebookPen,
  },
];

// User-specific navigation items
export const navUserItems = [
  {
    title: "Account",
    url: "/user/profile",
    icon: BadgeCheck,
  },

  {
    title: "Notifications",
    url: "/notifications",
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
