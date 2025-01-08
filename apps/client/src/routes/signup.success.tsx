import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/header";

export const Route = createFileRoute("/signup/success")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex items-center justify-center pt-24">
        {" "}
        {/* Increased top padding */}
        <Card className="w-full max-w-md shadow-lg rounded-lg bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
              Registration Submitted Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 px-6">
            <p className="text-gray-600 dark:text-gray-400">
              Thank you for registering your business. We will review your
              application and send the credentials to your email once approved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Please check your email for further instructions.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center mt-6">
            <Button
              asChild
              className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700"
            >
              <Link to="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
