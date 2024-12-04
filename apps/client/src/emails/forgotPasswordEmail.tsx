// src/templates/ForgotPasswordEmail.tsx
import type React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
  Tailwind,
  Button,
} from "@react-email/components";
import { sendEmail } from "../lib/api";

interface ForgotPasswordProps {
  name: string;
  email: string;
  resetUrl: string;
  to: string;
}

const previewText = "Reset your Physiotherapy password"; // Descriptive preview text for email clients

const ForgotPasswordEmail: React.FC<ForgotPasswordProps> = ({
  name,
  email,
  resetUrl,
}) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading as="h1" className="text-indigo-400 text-center">
              Password Reset Request
            </Heading>

            <Text className="text-gray-700 mt-4">
              Hello <strong>{name}</strong>,
            </Text>
            <Text className="text-gray-700 mt-2">
              We received a request to reset your password for your account
              associated with <strong>{email}</strong>.
            </Text>

            <Text className="text-gray-700 mt-4">
              If you requested this password reset, please click the link below:
            </Text>

            <Button
              className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white my-4"
              href={resetUrl}
            >
              Reset Your Password
            </Button>

            <Text className="text-gray-700 mt-4">
              If you didn’t request a password reset, please ignore this email.
              Your password will remain unchanged.
            </Text>
            <Text className="text-gray-700 mt-6">
              Best regards,
              <br />
              The Physiotherapy Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// Function to send the Forgot Password email
export const sendForgotPasswordEmail = async (props: ForgotPasswordProps) => {
  const htmlContent = renderToStaticMarkup(<ForgotPasswordEmail {...props} />);
  try {
    const result = await sendEmail(
      props.to,
      "Reset Your Password",
      htmlContent
    );
    console.log("Password reset email sent successfully:", result);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
};

export default ForgotPasswordEmail;
