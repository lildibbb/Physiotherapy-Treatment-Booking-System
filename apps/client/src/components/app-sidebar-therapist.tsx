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
  CreditCard,
  Home,
  NotebookPen,
  Sparkles,
  UserPlus,
} from "lucide-react";
import type * as React from "react";
import { ModeToggle } from "./ui/mode-toggle";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

// Main navigation items
const navItems = [
  {
    title: "Dashboard",
    url: "/therapist/dashboard",
    icon: Home,
  },
  {
    title: "Patient",
    url: "/auth/register_staff_therapist",
    icon: UserPlus,
  },
  {
    title: "Appointments",
    url: "/auth/appointment",
    icon: Calendar,
  },
];

// User-specific navigation items
export const navUserItems = [
  {
    title: "Account",
    url: "/user_profile",
    icon: BadgeCheck,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
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
