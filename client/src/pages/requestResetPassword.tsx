import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "../lib/api";
import { sendForgotPasswordEmail } from "../emails/forgotPasswordEmail";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the Zod schema for validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Define the form values type
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Initialize the form with react-hook-form and zod for validation
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Handle form submission
  const handleResetPassword = async (data: ForgotPasswordFormValues) => {
    setMessage("");
    setError("");

    try {
      const response = await requestPasswordReset(data.email);
      if (response) {
        const resetUrl = `http://localhost:3000/auth/reset-password?token=${response.token}`;

        await sendForgotPasswordEmail({
          name: response.name || "User",
          email: data.email,
          resetUrl,
          to: data.email,
        });

        setMessage("If the email exists, a reset link will be sent.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to request password reset."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Forgot Password
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleResetPassword)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full mt-4 text-white font-semibold py-2 rounded-md"
          >
            Check
          </Button>
        </form>
      </Form>

      {message && <p className="text-green-500 text-sm mt-4">{message}</p>}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
