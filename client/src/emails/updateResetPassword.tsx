// src/templates/UpdateResetPassword.tsx
import React from "react";
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

interface UpdateResetPasswordProps {
  name: string;
  email: string;
  updateUrl: string;
  to: string;
}

const previewText = "Your password has been successfully updated"; // Descriptive preview text for email clients

const UpdateResetPassword: React.FC<UpdateResetPasswordProps> = ({
  name,
  email,
  updateUrl,
}) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading as="h1" className="text-indigo-400 text-center">
              Password Update Confirmation
            </Heading>

            <Text className="text-gray-700 mt-4">
              Hello <strong>{name}</strong>,
            </Text>
            <Text className="text-gray-700 mt-2">
              Your password for the account associated with{" "}
              <strong>{email}</strong> has been successfully updated.
            </Text>

            <Text className="text-gray-700 mt-4">
              If you did not make this change, please secure your account
              immediately by updating your password again or contacting support.
            </Text>

            <Button
              className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white my-4"
              href={updateUrl}
            >
              Secure Your Account
            </Button>

            <Text className="text-gray-700 mt-4">
              Thank you for keeping your account secure.
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

// Function to send the Password Update Confirmation email
export const sendUpdateResetPasswordEmail = async (
  props: UpdateResetPasswordProps
) => {
  const htmlContent = renderToStaticMarkup(<UpdateResetPassword {...props} />);
  try {
    const result = await sendEmail(
      props.to,
      "Password Updated Successfully",
      htmlContent
    );
    console.log(
      "Password update confirmation email sent successfully:",
      result
    );
  } catch (error) {
    console.error("Failed to send password update confirmation email:", error);
  }
};

export default UpdateResetPassword;
