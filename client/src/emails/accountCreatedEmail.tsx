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

interface AccountCreatedEmailProps {
  name: string;
  role: string;
  email: string;
  tempPassword: string;
  loginUrl: string;
  to: string;
}

const previewText = "Account Created: Welcome to the Team!"; // Descriptive preview text for email clients

const AccountCreatedEmail: React.FC<AccountCreatedEmailProps> = ({
  name,
  role,
  email,
  tempPassword,
  loginUrl,
}) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading as="h1" className="text-indigo-400 text-center">
              Welcome to Our Team, {name}!
            </Heading>

            <Text className="text-gray-700 mt-4">
              Dear <strong>{name}</strong>,
            </Text>
            <Text className="text-gray-700 mt-2">
              We are excited to inform you that your account as a{" "}
              <strong>{role}</strong> has been created. You can now access your
              account and get started.
            </Text>

            <Text className="text-gray-700 mt-4">
              <strong>Your Login Credentials:</strong>
            </Text>
            <Text className="text-gray-700">
              Email: <strong>{email}</strong>
            </Text>
            <Text className="text-gray-700">
              Temporary Password: <strong>{tempPassword}</strong>
            </Text>

            <Text className="text-gray-700 mt-4">
              Please use the following link to log in and change your password
              upon your first login:
            </Text>

            <Button
              className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white my-4"
              href={loginUrl}
            >
              Log in to your account
            </Button>

            <Text className="text-gray-700 mt-4">
              If you have any questions or need assistance, feel free to reach
              out to our support team.
            </Text>
            <Text className="text-gray-700 mt-6">
              Best regards,
              <br />
              The Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// Function to send the Account Created email
export const sendAccountCreatedEmail = async (
  props: AccountCreatedEmailProps
) => {
  const htmlContent = renderToStaticMarkup(<AccountCreatedEmail {...props} />);
  try {
    const result = await sendEmail(
      props.to,
      "Your Account Has Been Created",
      htmlContent
    );
    console.log("Account creation email sent successfully:", result);
  } catch (error) {
    console.error("Failed to send account creation email:", error);
  }
};

export default AccountCreatedEmail;
