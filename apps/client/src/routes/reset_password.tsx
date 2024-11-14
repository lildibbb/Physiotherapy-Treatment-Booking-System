import { useState } from "react";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { resetPassword } from "../lib/api"; // Import the actual resetPassword function
import { sendUpdateResetPasswordEmail } from "../emails/updateResetPasswordEmail";

// Define the route for resetting password
export const Route = createFileRoute("/reset_password")({
  component: RouteComponent,
});

function RouteComponent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Use location hook to get the current URL and extract query parameters
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(""); // Clear error if passwords match
    console.log("Token from URL:", token);

    try {
      if (token) {
        const response = await resetPassword(token, password, confirmPassword);
        if (response?.email && response?.name) {
          setSuccessMessage("Password has been reset successfully!");
          const { email, name } = response;

          const updateUrl = "http://localhost:3000/login";
          await sendUpdateResetPasswordEmail({
            name,
            email,
            updateUrl,
            to: email,
          });
        } else {
          setError("Missing email or name in the response.");
        }
      } else {
        setError("Invalid token. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again."
      );
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
          {successMessage ? (
            <p className="text-green-500 text-center">{successMessage}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password" className="mb-2">
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="mb-2">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full mt-4">
                Confirm
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RouteComponent;
