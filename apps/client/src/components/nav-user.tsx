import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
// src/components/nav-user.tsx
import { useEffect, useState } from "react";
import { navUserItems } from "./app-sidebar-therapist"; // Import navUserItems
import { fetchUserProfile } from "@/lib/api";
import { Link } from "@tanstack/react-router";

interface User {
  name: string;
  email: string;
  avatar: string;
}

export function NavUser() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchUserProfile();
        console.log("data fetched: ", data);
        setUser(data);
      } catch (err: any) {
        console.error("Failed to fetch user profile", err);
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {navUserItems.map((item) => (
                <DropdownMenuItem asChild key={item.title}>
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
