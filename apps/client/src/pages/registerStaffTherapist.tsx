import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { registerStaff, registerTherapist } from "@/lib/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar-therapist";

// Define Zod schema for form validation
const staffSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
});

const therapistSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  contactDetails: z.string().min(1, "Contact Details are required"),
});

type StaffFormData = z.infer<typeof staffSchema>;
type TherapistFormData = z.infer<typeof therapistSchema>;

const RegisterStaffTherapist: React.FC = () => {
  const { toast } = useToast();

  const staffForm = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "",
    },
  });

  const therapistForm = useForm<TherapistFormData>({
    resolver: zodResolver(therapistSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      specialization: "",
      contactDetails: "",
    },
  });

  const handleRegisterStaff = async (data: StaffFormData) => {
    try {
      await registerStaff(data.email, data.password, data.name, data.role);
      toast({
        variant: "default",
        title: "Success",
        description: "Staff registered successfully!",
      });
      staffForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Failed to register staff.",
      });
    }
  };

  const handleRegisterTherapist = async (data: TherapistFormData) => {
    try {
      await registerTherapist(
        data.email,
        data.password,
        data.name,
        data.specialization,
        data.contactDetails
      );
      toast({
        variant: "default",
        title: "Success",
        description: "Therapist registered successfully!",
      });
      therapistForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Failed to register therapist.",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <AppSidebar />

        <div className="flex-1 p-6">
          <SidebarTrigger className="mb-4" />

          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Register Staff & Therapist</h1>
            <p className="text-lg text-gray-500">
              Register staff and therapists under your business account.
            </p>
          </header>

          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">Staff Registration</CardTitle>
              <CardDescription>
                Register new staff under your business account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...staffForm}>
                <form
                  onSubmit={staffForm.handleSubmit(handleRegisterStaff)}
                  className="space-y-4"
                >
                  <FormField
                    control={staffForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <input
                            type="email"
                            className="input"
                            placeholder="Email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={staffForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <input
                            type="password"
                            className="input"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={staffForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            className="input"
                            placeholder="Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={staffForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            className="input"
                            placeholder="Role"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Register Staff
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter>
              <p className="text-sm text-center text-gray-500">
                Complete the fields to register a new staff member.
              </p>
            </CardFooter>
          </Card>

          <Card className="w-full max-w-2xl mx-auto mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Therapist Registration</CardTitle>
              <CardDescription>
                Register new therapists under your business account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...therapistForm}>
                <form
                  onSubmit={therapistForm.handleSubmit(handleRegisterTherapist)}
                  className="space-y-4"
                >
                  <FormField
                    control={therapistForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <input
                            type="email"
                            className="input"
                            placeholder="Email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={therapistForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <input
                            type="password"
                            className="input"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={therapistForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            className="input"
                            placeholder="Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={therapistForm.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            className="input"
                            placeholder="Specialization"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={therapistForm.control}
                    name="contactDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Details</FormLabel>
                        <FormControl>
                          <input
                            type="text"
                            className="input"
                            placeholder="Contact Details"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Register Therapist
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter>
              <p className="text-sm text-center text-gray-500">
                Complete the fields to register a new therapist.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RegisterStaffTherapist;
