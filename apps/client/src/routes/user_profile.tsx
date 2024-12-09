import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar-therapist";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { createFileRoute } from "@tanstack/react-router";
interface UserProfileData {
  id: number;
  name: string;
  email: string;
  avatar: string;
}
export const Route = createFileRoute("/user_profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const [profile, setProfile] = useState<UserProfileData>({
    id: 0,
    name: "",
    email: "",
    avatar: "",
  });
  const { toast } = useToast();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5431/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile((prevProfile) => ({
            ...prevProfile,
            ...data,
            password: "",
          }));
        } else {
          console.error("Failed to fetch profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle input change for form fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  // Submit updated profile information
  const handleFormSubmit = async () => {
    // Filter out empty or undefined fields
    const filteredProfile = Object.fromEntries(
      Object.entries(profile).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );
    try {
      const response = await fetch(
        `http://localhost:5431/api/auth/profile/${profile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(filteredProfile),
        }
      );

      if (response.ok) {
        toast({
          variant: "default",
          title: "Profile updated successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update profile.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile.",
      });
      console.error("Error updating profile:", error);
    }
  };
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content area */}
        <div className="flex-1 p-6">
          {/* Sidebar Trigger */}
          <SidebarTrigger className="mb-4" />

          <Card className="max-w-lg mx-auto shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                User Profile
              </CardTitle>
              <CardDescription>
                Manage your profile information here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="avatar"
                  >
                    Avatar URL
                  </label>
                  <Input
                    type="text"
                    id="avatar"
                    name="avatar"
                    value={profile.avatar}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Additional fields for password, phone, address, and bio can be added here */}

                {/* Alert Dialog for Update Confirmation */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Update Profile
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to update your profile?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleFormSubmit}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
