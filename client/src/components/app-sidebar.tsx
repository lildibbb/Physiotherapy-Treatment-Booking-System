import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
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

// Main navigation items
const navItems = [
	{
		title: "Dashboard",
		url: "/auth/dashboard",
		icon: Home,
	},
	{
		title: "Register User",
		url: "/auth/register_staff_therapist",
		icon: UserPlus,
	},
	{
		title: "Appointments",
		url: "/auth/appointment",
		icon: Calendar,
	},

	{
		title: "Book",
		url: "/auth/book",
		icon: NotebookPen,
	},
];

// User-specific navigation items
export const navUserItems = [
	{
		title: "Account",
		url: "/auth/user_profile",
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
