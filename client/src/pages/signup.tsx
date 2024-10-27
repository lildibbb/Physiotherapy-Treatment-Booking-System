import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "../lib/api";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/ui/header"; // Import the Header component

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await registerUser(email, password);
      console.log("Registration successful:", response);

      toast({
        variant: "default",
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
      });
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Email is already in use",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header /> {/* Include the Header at the top */}
      <div className="flex items-center justify-center pt-8">
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle className="font-semibold tracking-tight text-2xl text-center">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center">
              Create your account to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup}>
              <div className="mb-4">
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
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>
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
                Sign Up
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center">
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
