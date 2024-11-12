import React, { useState } from "react";
import { requestPasswordReset } from "../lib/api";
import { sendForgotPasswordEmail } from "../emails/forgotPasswordEmail"; // Import the email sending function
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    setMessage("");
    setError("");

    try {
      if (!email) {
        setError("Please enter a valid email.");
        return;
      }

      // Call requestPasswordReset to verify the email
      const response = await requestPasswordReset(email);
      console.log(response);
      if (response) {
        // Assuming the backend includes user's name and reset URL in the response for this example
        const resetUrl = `http://localhost:3000/auth/reset-password?token=${response.token}`;

        // Prepare email details and send the forgot password email
        await sendForgotPasswordEmail({
          name: response.name || "User", // Replace with actual name from response if available
          email,
          resetUrl,
          to: email,
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
      <div className="mb-4">
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </Label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <Button
        onClick={handleResetPassword}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
      >
        Check
      </Button>

      {message && <p className="text-green-500 text-sm mt-4">{message}</p>}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
