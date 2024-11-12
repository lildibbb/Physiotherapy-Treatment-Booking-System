// src/components/resetpassword.tsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { resetPassword } from "../lib/api"; // Import the actual resetPassword function

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Extract the token from the URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(""); // Clear error if passwords match
    console.log("Token from URL:", token);

    try {
      // Make the API call to reset the password
      if (token) {
        await resetPassword(token, password, confirmPassword);
        setSuccessMessage("Password has been reset successfully!");
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
};

export default ResetPassword;
