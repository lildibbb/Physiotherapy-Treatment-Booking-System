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

import { fetchUserProfile, logoutUser } from "@/lib/api";
import { Link, useNavigate } from "@tanstack/react-router";
import { navUserItems } from "./app-sidebar-therapist";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "./spinner";

interface User {
  name: string;
  email: string;
  avatar: string;
}

export function NavUser() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchUserProfile();
        console.log("data fetched {sidebar}:  ", data);
        setUser(data);
        if (data.avatar) {
          const apiBaseUrl = import.meta.env.VITE_ENDPOINT_AVATAR_URL;
          const avatarUrl = `${apiBaseUrl}/${data.avatar}`;
          console.log("Avatar URL:", avatarUrl);

          setAvatar(avatarUrl);
        }
      } catch (err: any) {
        console.error("Failed to fetch user profile", err);
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Start loading
    try {
      const response = await logoutUser(); // Define logoutUser in your API functions
      console.log("response: ", response);
      console.log("response status: ", response.status);
      if (response.status === 200) {
        setIsAuthenticated(false);
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        navigate({ to: "/" }); // Redirect to login page after logout
        console.log("User logged out successfully");
      } else {
        toast({
          title: "Logout Failed",
          description: "Unable to logout. Please try again.",
          variant: "destructive",
        });
        console.log("Failed to logout");
      }
    } catch (error) {
      console.log("Error during logout:", error);
      toast({
        title: "Logout Error",
        description: "An error occurred while trying to logout.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false); // End loading
    }
  };
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={avatar || undefined}
                  alt={user.name}
                  onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.style.display = "none";
                  }}
                />
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
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut />
              {isLoggingOut ? (
                <Spinner className="w-4 h-4 mr-2" /> // Spinner size and margin
              ) : null}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
