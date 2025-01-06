import { createFileRoute, useLocation } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPassword } from "../lib/api";
import { sendUpdateResetPasswordEmail } from "../emails/updateResetPasswordEmail";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Define the Zod schema for validation
const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Define the route for resetting password
export const Route = createFileRoute("/reset_password")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const { toast } = useToast();
  const token = new URLSearchParams(location.search).get("token");

  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      if (token) {
        const response = await resetPassword(
          token,
          data.password,
          data.confirmPassword
        );
        if (response?.email && response?.name) {
          const { email, name } = response;

          const updateUrl = `${import.meta.env.VITE_API_BASE_URL}/login`;
          await sendUpdateResetPasswordEmail({
            name,
            email,
            updateUrl,
            to: email,
          });

          toast({
            variant: "default",
            title: "Password Reset",
            description:
              "Password has been reset successfully. You may now log in.",
          });
        } else {
          throw new Error("Missing email or name in the response.");
        }
      } else {
        throw new Error("Invalid token. Please try again.");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to reset password. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-4">
                Confirm
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RouteComponent;
