import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { loginUser } from "../lib/api";

import Header from "@/components/ui/header";
import { Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginUser(email, password);
      console.log("Login successful:", response);

      localStorage.setItem("token", response.token);

      // Redirect to dashboard upon successful login
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Include the Header at the top */}
      <Header />
      <div className="flex items-center h-[800px] justify-center pt-8">
        <Card className="flex w-full max-w-4xl lg:max-w-6xl overflow-hidden shadow-lg">
          {/* Branding section */}
          <div className="hidden lg:flex lg:w-1/2 bg-muted text-white p-10 relative flex-col justify-between">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <div className="flex items-center space-x-2 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <title>Physiotherapy Appointment Booking SVG</title>
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                <span className="text-lg font-medium">
                  Physiotherapy Appointment Booking
                </span>
              </div>
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg leading-relaxed">
                  &ldquo;Lorem ipsum dolor sit amet consectetur, adipisicing
                  elit. Numquam laboriosam quos dolores nisi maxime aut
                  voluptates et reprehenderit. Tempora soluta doloribus quasi
                  libero tenetur reprehenderit laboriosam dicta et cumque
                  est.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>

          {/* Login form section */}
          <div className="flex w-full lg:w-1/2 items-center justify-center p-12 lg:p-16">
            <CardContent className="w-full max-w-md space-y-4">
              <CardHeader className="flex flex-col space-y-1 text-center">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Login
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">
                  Access your account
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Password
                    </label>
                    <Link
                      to="/request_reset_password"
                      className="text-sm text-blue-500  hover:underline ml-2"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full"
                    required
                  />
                </div>

                <Button className="w-full" type="submit">
                  Login
                </Button>
              </form>

              <CardFooter className="flex flex-col items-center">
                <p className="text-sm text-center">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup/user"
                    className="text-blue-500 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </CardFooter>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
