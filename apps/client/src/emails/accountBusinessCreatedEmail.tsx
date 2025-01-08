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
  Section,
} from "@react-email/components";
import { sendEmail } from "../lib/api";

interface BusinessAccountCreatedEmailProps {
  businessName: string;

  email: string;
  tempPassword: string;
  loginUrl: string;
  to: string;
  planType?: string;
}

const previewText = "Business Account Created: Welcome to Our Platform!";

const BusinessAccountCreatedEmail: React.FC<
  BusinessAccountCreatedEmailProps
> = ({
  businessName,

  email,
  tempPassword,
  loginUrl,
  planType = "Standard",
}) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading as="h1" className="text-primary text-center">
              Welcome to Our Platform!
            </Heading>

            <Text className="text-gray-700 mt-4">
              Dear <strong>{businessName}</strong>,
            </Text>

            <Text className="text-gray-700 mt-2">
              Congratulations! Your business account for{" "}
              <strong>{businessName}</strong> has been successfully created.
              You're now ready to start managing your business on our platform.
            </Text>

            <Section className="bg-gray-50 rounded-lg p-4 my-6">
              <Text className="text-gray-700 font-medium mb-2">
                Account Details:
              </Text>
              <Text className="text-gray-700 my-1">
                Business Name: <strong>{businessName}</strong>
              </Text>
              <Text className="text-gray-700 my-1">
                Account Type: <strong>{planType}</strong>
              </Text>
              <Text className="text-gray-700 my-1">
                Email: <strong>{email}</strong>
              </Text>
              <Text className="text-gray-700 my-1">
                Temporary Password: <strong>{tempPassword}</strong>
              </Text>
            </Section>

            <Text className="text-gray-700">
              To access your business dashboard, please click the button below
              and change your password upon your first login:
            </Text>

            <Button
              className="box-border w-full rounded-md bg-primary px-[12px] py-[12px] text-center font-semibold text-white my-4 hover:bg-primary/90"
              href={loginUrl}
            >
              Access Business Dashboard
            </Button>

            <Text className="text-gray-700 mt-4">
              Here's what you can do next:
            </Text>
            <ul className="list-disc pl-6 text-gray-700">
              {/* <li>Complete your business profile</li>
              <li>Set up your payment methods</li> */}
              <li>Invite team members</li>
              <li>Explore our features and tools</li>
            </ul>

            <Text className="text-gray-700 mt-4">
              If you need any assistance or have questions, our support team is
              here to help 24/7.
            </Text>

            <Text className="text-gray-700 mt-6">
              Best regards,
              <br />
              The Team
            </Text>

            <Text className="text-xs text-gray-500 mt-8 text-center">
              This is an automated message, please do not reply directly to this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// Function to send the Business Account Created email
export const sendBusinessAccountCreatedEmail = async (
  props: BusinessAccountCreatedEmailProps
) => {
  const htmlContent = renderToStaticMarkup(
    <BusinessAccountCreatedEmail {...props} />
  );
  try {
    const result = await sendEmail(
      props.to,
      "Your Business Account Has Been Created",
      htmlContent
    );
    console.log("Business account creation email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to send business account creation email:", error);
    throw error;
  }
};

export default BusinessAccountCreatedEmail;
