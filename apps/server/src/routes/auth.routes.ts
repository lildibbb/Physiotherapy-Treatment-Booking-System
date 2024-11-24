import { Elysia } from "elysia";
import jsonResponse, {
  registerUser,
  loginUser,
  updatePasswordResetToken,
  requestResetPassword,
  verifyAuth,
} from "../services/auth-services";
import {
  UserRegistrationSchema,
  UserLoginSchema,
  type UserRegistration,
  type UserLogin,
} from "../../types";
import { basePath, jwtAccessSetup } from "./setup";
import { sendEmail } from "../services/sendEmail";

export const authRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/auth`, (group) => {
    group
      .post(
        `/register/user`,
        async ({ body }) => {
          return await registerUser(body as UserRegistration); // Cast body to UserRegistration type
        },
        {
          body: UserRegistrationSchema,
          detail: {
            description: "Registers a new user",
            tags: ["Authentication"],
            responses: {
              201: {
                description: "User successfully registered",
              },
              400: {
                description: "Bad Request",
              },
              500: {
                description: "Internal Server Error",
              },
            },
          },
        }
      )
      .post(
        "/login",
        async ({ body, jwt, cookie: { auth }, set }) => {
          const loginResponse = await loginUser(body as UserLogin);

          if (loginResponse.status !== 200) {
            set.status = loginResponse.status;
            return { message: loginResponse.error };
          }

          const { id, email, businessID } = loginResponse;

          // Validate that email is defined
          if (!email) {
            set.status = 400;
            return { message: "Email is required to generate a token" };
          }

          // Create JWT token
          const tokenPayload: {
            id: number;
            email: string;
            businessID?: number;
          } = {
            id,
            email,
          };
          console.log("TokenPayLoad: ", tokenPayload); //For debugging purposes
          // Only add `businessID` if it's defined (not null)
          if (businessID !== null) {
            tokenPayload.businessID = businessID;
          }

          const token = await jwt.sign(tokenPayload);
          auth.set({
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
          });

          return { message: "Login successful", email, token };
        },
        {
          body: UserLoginSchema,
          detail: {
            description: "Logs in a user and returns a JWT",
            tags: ["Authentication"],
            responses: {
              200: { description: "Login successful, JWT returned" },
              401: { description: "Unauthorized" },
              500: { description: "Internal Server Error" },
            },
          },
        }
      );
    return group;
  });
authRoutes.post(
  `${basePath}/request-password-reset`,
  async ({ body, jwt, set }) => {
    try {
      const { email } = body as { email: string };

      if (!email) {
        set.status = 400;
        return { message: "Email is required" };
      }

      const result = await requestResetPassword(jwt, { email });
      return result; // The function returns a generic message for security
    } catch (error) {
      console.error("Error in password reset request:", error);
      set.status = 500;
      return { message: "Internal server error" };
    }
  },
  {
    detail: {
      description: "Requests a password reset email",
      tags: ["Email"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  description: "User's email address",
                },
              },
              required: ["email"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "If the email exists, a reset link will be sent.",
        },
        400: { description: "Bad Request - Email is required" },
        500: { description: "Internal Server Error" },
      },
    },
  }
);
authRoutes.patch(
  `${basePath}/reset-password`,
  async ({ body, jwt }) => {
    const { token, password, confirmPassword } = body as {
      token: string;
      password: string;
      confirmPassword: string;
    };

    // Validate required fields
    if (!token || !password || !confirmPassword) {
      return jsonResponse({ error: "Missing required fields" }, 400);
    }

    try {
      // Call the updatePasswordResetToken function
      const response = await updatePasswordResetToken(
        jwt,
        { password, confirmPassword },
        token
      );
      console.log("Response from updatePasswordResetToken:", response);
      // Ensure response is defined before accessing properties
      if (response) {
        // Extract JSON body and status from the response
        const data = await response.json(); // Parse JSON data from the response
        const status = response.status; // Get status code from response

        // Return the parsed data and status using jsonResponse
        return jsonResponse(data, status);
      } else {
        // Handle the case where response is undefined
        return jsonResponse({ error: "Failed to update password" }, 500);
      }
    } catch (error) {
      console.error("Error in update_password_reset route:", error);
      return jsonResponse({ error: "Internal server error" }, 500);
    }
  },
  {
    detail: {
      description:
        "Updates the user's password after verifying the reset token.",
      tags: ["Authentication"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  description: "JWT token for password reset",
                },
                password: {
                  type: "string",
                  description: "New password for the user",
                },
                confirmPassword: {
                  type: "string",
                  description: "Confirmation of the new password",
                },
              },
              required: ["token", "password", "confirmPassword"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Password updated successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request - missing required fields or invalid data",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Missing required fields",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized - token has expired or is invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Token has expired" },
                },
              },
            },
          },
        },
        500: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Internal server error",
                  },
                },
              },
            },
          },
        },
      },
    },
  }
);

// Send Email endpoint
authRoutes
  .post(
    `${basePath}/send-email`,
    async ({ body }) => {
      const { to, subject, html } = body as {
        to: string;
        subject: string;
        html: string;
      };
      try {
        await sendEmail({ to, subject, html });
        return { status: "success", message: "Email sent successfully" };
      } catch (error) {
        return { status: "error", message: "Failed to send email" };
      }
    },
    {
      detail: {
        description: "Sends an email with specified content",
        tags: ["Email"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  to: {
                    type: "string",
                    description: "Recipient's email address",
                  },
                  subject: { type: "string", description: "Email subject" },
                  html: {
                    type: "string",
                    description: "HTML content of the email",
                  },
                },
                required: ["to", "subject", "html"],
              },
            },
          },
        },
        responses: {
          200: { description: "Email sent successfully" },
          400: { description: "Bad Request" },
          500: { description: "Failed to send email" },
        },
      },
    }
  )
  .get("/check-session", async ({ cookie: { auth }, jwt }) => {
    const authResult = await verifyAuth(jwt, auth?.value);
    console.log("Auth Result {checkSession} :", authResult);
    if ("error" in authResult) {
      return { error: authResult.error, status: authResult.status };
    }
    return jsonResponse({ status: "success" }, 200);
  });
