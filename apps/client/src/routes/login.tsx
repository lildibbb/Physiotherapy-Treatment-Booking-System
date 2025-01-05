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
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { loginUser } from "../lib/api";
import { Header } from "@/components/header";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);
      console.log("Login successful:", response);
      toast({
        variant: "default",
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate({ to: "/" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your email and password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="flex w-full max-w-5xl overflow-hidden shadow-xl">
          {/* Branding section */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground p-12 relative flex-col justify-between">
            <div className="relative z-20 flex flex-col space-y-6">
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <title>Physiotherapy Appointment Booking SVG</title>
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                <span className="text-xl font-semibold">
                  Physiotherapy Booking
                </span>
              </div>
              <p className="text-lg/relaxed text-primary-foreground/90">
                Schedule your path to recovery with our expert physiotherapists.
                Book appointments easily and track your progress.
              </p>
            </div>
            <div className="relative">
              <blockquote className="space-y-4">
                <p className="text-lg/relaxed italic text-primary-foreground/90">
                  "The booking system has made it so much easier to manage my
                  physiotherapy appointments. The reminders and progress
                  tracking have been invaluable for my recovery journey."
                </p>
                <footer className="text-sm text-primary-foreground/80">
                  — Sarah Johnson, Recovery Patient
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Login form section */}
          <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 lg:p-12">
            <div className="w-full max-w-md space-y-6">
              <CardHeader className="space-y-1 p-0 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email address
                    </label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Password
                      </label>
                      <Link
                        to="/request_reset_password"
                        className="text-sm text-primary hover:text-primary/90 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="transition-colors"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  className="w-full font-semibold"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <CardFooter className="flex flex-col items-center p-0 gap-4">
                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/signup/user"
                    className="text-primary font-medium hover:text-primary/90 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
