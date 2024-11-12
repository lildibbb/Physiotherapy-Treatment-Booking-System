// server/index.ts
import { Elysia } from "elysia";
import { Client } from "pg";
import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import {
  getAllStaffByBusiness,
  getAllTherapistByBusiness,
  updateStaffDetails,
  updateTherapistDetails,
} from "./auth/routes";
import {
  registerUser,
  loginUser,
  registerBusiness,
  registerTherapist,
  requestResetPassword,
  updatePasswordResetToken,
} from "./auth/auth"; // Import authentication functions
import {
  type BusinessRegistration,
  BusinessRegistrationSchema,
  type Staff,
  type StaffRegistration,
  StaffSchema,
  type TherapistRegistration,
  TherapistRegistrationSchema,
} from "../types/index";
import {
  type UserRegistration,
  type UserLogin,
  UserRegistrationSchema,
  UserLoginSchema,
} from "../types/index";

import { registerStaff } from "./auth/auth";
import { StaffRegistrationSchema } from "../types/index";
import jsonResponse from "./auth/auth";
import { sendEmail } from "./services/sendEmail";

// Base API path
const basePath = "/api";

// PostgreSQL Client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

// Set up the Elysia server
const app = new Elysia()
  .use(cors()) // Enable CORS for cross-origin requests// Enable JWT for authentication
  .use(
    swagger({
      documentation: {
        info: {
          title: "Appointment Booking and Physiotherapy Treatment System",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    })
  )
  .use(
    jwt({
      name: "jwt",
      secret: "secretKey",
      expiresIn: "1h",
    })
  )

  // .get(`${basePath}/auth/profile`, async ({ jwt, set, headers }) => {
  //   try {
  //     const authHeader = headers.authorization || "";
  //     const token = authHeader.replace("Bearer ", "");

  //     if (!token) {
  //       set.status = 401;
  //       return { message: "Unauthorized access - token missing" };
  //     }

  //     const profile = (await jwt.verify(token)) as {
  //       id: string;
  //       email: string;
  //     };

  //     if (!profile) {
  //       set.status = 401;
  //       return { message: "Unauthorized access - invalid token" };
  //     }

  //     const userId = parseInt(profile.id, 10);
  //     if (isNaN(userId)) {
  //       set.status = 400;
  //       return { message: "Invalid user ID format" };
  //     }

  //     const userDetails = await db
  //       .select()
  //       .from(user_authentications)
  //       .where(eq(user_authentications.userID, userId))
  //       .execute();

  //     if (userDetails.length === 0) {
  //       set.status = 404;
  //       return { message: "User not found" };
  //     }

  //     const { email, name, avatar } = userDetails[0];
  //     return {
  //       message: "Profile retrieved successfully",
  //       id: profile.id,
  //       name: name || "Default Name",
  //       avatar: avatar || "/default-avatar.png",
  //       email,
  //     };
  //   } catch (error) {
  //     console.error("Error in /auth/profile route:", error);
  //     set.status = 500;
  //     return { message: "Internal server error" };
  //   }
  // })
  // // Define the PUT endpoint to update a user's profile

  // .put(
  //   `${basePath}/auth/profile/:id`,
  //   async ({ params, body, set, headers, jwt }) => {
  //     try {
  //       // Extract user ID from parameters
  //       const userId = parseInt(params["id"], 10);
  //       if (isNaN(userId)) {
  //         set.status = 400;
  //         return { message: "Invalid user ID format" };
  //       }

  //       // Verify the token
  //       const authHeader = headers.authorization || "";
  //       const token = authHeader.replace("Bearer ", "");
  //       if (!token) {
  //         set.status = 401;
  //         return { message: "Unauthorized access - token missing" };
  //       }

  //       const profile = (await jwt.verify(token)) as { id: string };
  //       if (parseInt(profile.id, 10) !== userId) {
  //         set.status = 403;
  //         return {
  //           message: "Forbidden - You can only update your own profile",
  //         };
  //       }
  //       // Filter out empty fields from the body
  //       const filteredBody = Object.fromEntries(
  //         Object.entries(body).filter(
  //           ([, value]) => value !== "" && value !== undefined
  //         )
  //       );

  //       if (Object.keys(filteredBody).length === 0) {
  //         set.status = 400;
  //         return { message: "No valid fields to update" };
  //       }
  //       // Update user profile in the database
  //       const updateResponse = await db
  //         .update(user_authentications)
  //         .set(filteredBody as Partial<UserProfile>) // Use the filtered object
  //         .where(eq(user_authentications.userID, userId))
  //         .execute();

  //       if (updateResponse.rowCount === 0) {
  //         set.status = 404;
  //         return { message: "User not found" };
  //       }

  //       return { message: "Profile updated successfully" };
  //     } catch (error) {
  //       console.error("Error in PUT /profile/:id:", error);
  //       set.status = 500;
  //       return { message: "Internal server error" };
  //     }
  //   },
  //   {
  //     body: UserProfileSchema,
  //     detail: {
  //       description: "Updates a user's profile by ID",
  //       tags: ["Profile"],
  //       parameters: [
  //         {
  //           in: "path",
  //           name: "id",
  //           required: true,
  //           schema: { type: "integer" },
  //         },
  //       ],
  //       responses: {
  //         200: {
  //           description: "Profile updated successfully",
  //         },
  //         400: {
  //           description: "Invalid user ID format",
  //         },
  //         401: {
  //           description: "Unauthorized access",
  //         },
  //         403: {
  //           description:
  //             "Forbidden - Only the user's own profile can be updated",
  //         },
  //         404: {
  //           description: "User not found",
  //         },
  //         500: {
  //           description: "Internal server error",
  //         },
  //       },
  //     },
  //   }
  // )
  // Authentication Routes
  .post(
    `${basePath}/auth/register/user`,
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
    `${basePath}/auth/register/business`,
    async ({ body }) => {
      return await registerBusiness(body as BusinessRegistration); // Cast body to BusinessRegistration type
    },
    {
      body: BusinessRegistrationSchema,
      detail: {
        description: "Registers a new business",
        tags: ["Authentication"],
        responses: {
          201: {
            description: "Business successfully registered",
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
    `${basePath}/register/staff`,
    async ({ body, headers, jwt }) => {
      const authHeader = headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        return { error: "Unauthorized access - token missing", status: 401 };
      }

      return await registerStaff(body as StaffRegistration, jwt, token);
    },
    {
      body: StaffRegistrationSchema,
      detail: {
        description: "Registers a new staff member",
        tags: ["Registration"],
        responses: {
          201: { description: "Staff registered successfully" },
          400: { description: "Bad Request" },
          409: { description: "Conflict - Email already in use" },
          500: { description: "Internal Server Error" },
        },
      },
    }
  )

  .post(
    `${basePath}/register/physiotherapist`,
    async ({ body, headers, jwt }) => {
      const authHeader = headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        return { error: "Unauthorized access - token missing", status: 401 };
      }
      return await registerTherapist(body as TherapistRegistration, jwt, token);
    },
    {
      body: TherapistRegistrationSchema,
      detail: {
        description: "Registers a new physiotherapist",
        tags: ["Registration"],
        responses: {
          201: { description: "Physiotherapist registered successfully" },
          400: { description: "Bad Request" },
          409: { description: "Conflict - Email already in use" },
          500: { description: "Internal Server Error" },
        },
      },
    }
  )

  .post(
    `${basePath}/auth/login`,
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
      const tokenPayload: { id: number; email: string; businessID?: number } = {
        id,
        email,
      };
      console.log(tokenPayload);
      // Only add `businessID` if it's defined (not null)
      if (businessID !== null) {
        tokenPayload.businessID = businessID;
      }

      const token = await jwt.sign(tokenPayload);

      // Set JWT token as an HTTP-only cookie
      auth.set({
        value: token,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/auth/profile",
      });

      return {
        message: "Login successful",
        token, // Return token for client-side if needed
        email, // Include the email in the response
      };
    },
    {
      body: UserLoginSchema,
      detail: {
        description: "Logs in a user and returns a JWT",
        tags: ["Authentication"],
        responses: {
          200: {
            description: "Login successful, JWT returned",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    }
  )
  // Send Email endpoint
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

  .post(
    `${basePath}/auth/request-password-reset`,
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
  )
  .patch(
    `${basePath}/auth/reset-password`,
    async ({ body, jwt, set }) => {
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

        // Return the response with the appropriate status
        return jsonResponse(response.body, response.status);
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
            description:
              "Bad Request - missing required fields or invalid data",
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
                    error: { type: "string", example: "Internal server error" },
                  },
                },
              },
            },
          },
        },
      },
    }
  )
  // Staff details
  .get(
    `${basePath}/auth/staff`,
    async ({ jwt, headers }) => {
      const authHeader = headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        return jsonResponse(
          { message: "Unauthorized access - token missing" },
          401
        );
      }

      try {
        // Call the helper function to get staff data by business ID
        const staffData = await getAllStaffByBusiness(jwt, token);

        // Return the fetched staff data using jsonResponse helper
        return jsonResponse(staffData);
      } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || "Failed to fetch staff data";
        console.error("Error fetching staff data:", error);

        return jsonResponse({ message }, status);
      }
    },
    {
      detail: {
        description: "Get all staff information related to business",
        tags: ["Staff"],
        responses: {
          200: {
            description: "Staff details listed successfully",
          },
          401: {
            description: "Unauthorized - token missing or invalid",
          },
          403: {
            description:
              "Forbidden - Unauthorized access due to missing or invalid business ID",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    }
  )
  // Therapist details
  .get(
    `${basePath}/auth/therapist`,
    async ({ jwt, headers }) => {
      const authHeader = headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        return jsonResponse(
          { message: "Unauthorized access - token missing" },
          401
        );
      }

      try {
        // Call the helper function to get staff data by business ID
        const therapistData = await getAllTherapistByBusiness(jwt, token);

        // Return the fetched staff data using jsonResponse helper
        return jsonResponse(therapistData);
      } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || "Failed to fetch therapist data";
        console.error("Error fetching therapist data:", error);

        return jsonResponse({ message }, status);
      }
    },
    {
      detail: {
        description: "Get all physiotherapist information related to business",
        tags: ["Physiotherapist"],
        responses: {
          200: {
            description: "Physiotherapist details listed successfully",
          },
          401: {
            description: "Unauthorized - token missing or invalid",
          },
          403: {
            description:
              "Forbidden - Unauthorized access due to missing or invalid business ID",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    }
  )
  .patch(
    `${basePath}/auth/staff/:staffID`,
    async ({ jwt, headers, body, params }) => {
      const authHeader = headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      const staffID = params.staffID;

      if (!token) {
        return jsonResponse(
          { message: "Unauthorized access - token missing" },
          401
        );
      }

      // Type assertion for body to ensure it's an object
      const bodyObj = body as Partial<Staff>;

      // Validate fields to ensure only valid fields are updated
      const validFields = ["email", "password", "name", "role"];
      for (const key of Object.keys(bodyObj)) {
        if (!validFields.includes(key)) {
          return jsonResponse({ error: `Invalid field: ${key}` }, 400);
        }
      }

      // Directly return the result of updateStaffDetails
      return await updateStaffDetails(bodyObj, jwt, token, staffID);
    },
    {
      body: StaffSchema,
      detail: {
        description: "Update staff details by ID",
        tags: ["Staff"],
        parameters: [
          {
            name: "staffID",
            in: "path",
            description: "ID of the staff member to update",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Staff details updated successfully" },
          400: { description: "Invalid field(s) provided" },
          401: { description: "Unauthorized - token missing or invalid" },
          409: { description: "Conflict - Email already in use" },
          500: { description: "Internal Server Error" },
        },
      },
    }
  )

  .patch(
    `${basePath}/auth/therapist/:therapistID`,
    async ({ jwt, headers, body, params }) => {
      const authHeader = headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      const therapistID = params.therapistID;

      if (!token) {
        return jsonResponse(
          { message: "Unauthorized access - token missing" },
          401
        );
      }

      // Type assertion for body to ensure it's an object
      const bodyObj = body as Partial<TherapistRegistration>;

      // Validate fields to ensure only valid fields are updated
      const validFields = [
        "email",
        "password",
        "name",
        "specialization",
        "contactDetails",
      ];
      for (const key of Object.keys(bodyObj)) {
        if (!validFields.includes(key)) {
          return jsonResponse({ error: `Invalid field: ${key}` }, 400);
        }
      }

      // Call the updateTherapistDetails function with the provided parameters
      return await updateTherapistDetails(bodyObj, jwt, token, therapistID);
    },
    {
      body: TherapistRegistrationSchema,
      detail: {
        description: "Update therapist details by ID",
        tags: ["Physiotherapist"],
        parameters: [
          {
            name: "therapistID",
            in: "path",
            description: "ID of the therapist to update",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Therapist details updated successfully" },
          400: { description: "Invalid field(s) provided" },
          401: { description: "Unauthorized - token missing or invalid" },
          409: { description: "Conflict - Email already in use" },
          500: { description: "Internal Server Error" },
        },
      },
    }
  );
// Appointments Routes
// .get(
//   `${basePath}/appointments`,
//   async ({ jwt, headers, set }) => {
//     const authHeader = headers.authorization || "";
//     const token = authHeader.replace("Bearer ", "");

//     if (!token) {
//       set.status = 401;
//       return { message: "Unauthorized access - token missing" };
//     }

//     try {
//       const profile = (await jwt.verify(token)) as { id: string };
//       const userId = parseInt(profile.id, 10);

//       if (isNaN(userId)) {
//         set.status = 400;
//         return { message: "Invalid user ID format" };
//       }

//       // Fetch appointments for the logged-in user
//       const appointments = await getAppointments(userId); // Pass userId to fetch only user's appointments
//       return appointments;
//     } catch (error) {
//       console.error("Error verifying token:", error);
//       set.status = 401;
//       return { message: "Unauthorized access - invalid token" };
//     }
//   },
//   {
//     detail: {
//       description:
//         "Returns a list of all appointments for the authenticated user",
//       tags: ["Appointments"],
//       responses: {
//         200: { description: "List of appointments retrieved successfully" },
//         401: { description: "Unauthorized" },
//         500: { description: "Internal Server Error" },
//       },
//     },
//   }
// )
// // Define the GET endpoint to retrieve a list of hospitals
// .get(`${basePath}/hospitals`, async ({ set }) => {
//   try {
//     // Fetch all hospital records from the database
//     const hospitalData = await db.select().from(hospitals).execute();

//     if (hospitalData.length === 0) {
//       set.status = 404;
//       return { message: "No hospitals found" };
//     }

//     return hospitalData;
//   } catch (error) {
//     console.error("Error fetching hospitals:", error);
//     set.status = 500;
//     return { message: "Internal server error" };
//   }
// })

// // Fetch appointments associated with the logged-in user

// .get(`${basePath}/appointments/user`, async ({ jwt, headers, set }) => {
//   const authHeader = headers.authorization || "";
//   const token = authHeader.replace("Bearer ", "");

//   if (!token) {
//     set.status = 401;
//     return { message: "Unauthorized access - token missing" };
//   }

//   try {
//     const profile = (await jwt.verify(token)) as { id: string };
//     const userId = parseInt(profile.id, 10);

//     if (isNaN(userId)) {
//       set.status = 400;
//       return { message: "Invalid user ID format" };
//     }

//     // Fetch appointments for the logged-in user
//     const appointments = await getAppointments(userId); // Pass userId to fetch only user's appointments
//     return appointments;
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     set.status = 401;
//     return { message: "Unauthorized access - invalid token" };
//   }
// })

// .get(
//   `${basePath}/auth/appointments/:id`,
//   async ({ params, jwt, headers, set }) => {
//     const appointmentID = parseInt(params["id"], 10);
//     if (isNaN(appointmentID))
//       return new Response("Invalid ID", { status: 400 });

//     const authHeader = headers.authorization || "";
//     const token = authHeader.replace("Bearer ", "");
//     if (!token) {
//       set.status = 401;
//       return { message: "Unauthorized access - token missing" };
//     }

//     try {
//       const profile = (await jwt.verify(token)) as { id: string };
//       const userId = parseInt(profile.id, 10);
//       return await getAppointmentById(appointmentID, userId); // Pass userId
//     } catch (error) {
//       console.error("Error verifying token:", error);
//       set.status = 401;
//       return { message: "Unauthorized access - invalid token" };
//     }
//   },
//   {
//     detail: {
//       description: "Returns an appointment by ID",
//       tags: ["Appointments"],
//       parameters: [
//         {
//           in: "path",
//           name: "id",
//           required: true,
//           schema: { type: "integer" },
//         },
//       ],
//       responses: {
//         200: { description: "Appointment details" },
//         400: { description: "Invalid appointment ID" },
//         401: { description: "Unauthorized" },
//         404: { description: "Appointment not found" },
//       },
//     },
//   }
// )
// .post(
//   `${basePath}/appointment`,
//   async ({ body, jwt, headers, set }) => {
//     const authHeader = headers.authorization || "";
//     const token = authHeader.replace("Bearer ", "");
//     if (!token) {
//       set.status = 401;
//       return { message: "Unauthorized access - token missing" };
//     }

//     try {
//       const profile = (await jwt.verify(token)) as { id: string };
//       const userId = parseInt(profile.id, 10);
//       return await createAppointment(body as Appointment, userId); // Pass userId
//     } catch (error) {
//       console.error("Error verifying token:", error);
//       set.status = 401;
//       return { message: "Unauthorized access - invalid token" };
//     }
//   },
//   {
//     body: AppointmentSchema,
//     detail: {
//       description: "Creates a new appointment",
//       tags: ["Appointments"],
//       responses: {
//         201: { description: "Appointment created successfully" },
//         400: { description: "Bad Request" },
//         401: { description: "Unauthorized" },
//         500: { description: "Internal Server Error" },
//       },
//     },
//   }
// )
// .put(
//   `${basePath}/appointment/:id`,
//   async ({ params, body, jwt, headers, set }) => {
//     const appointmentID = parseInt(params["id"], 10);
//     if (isNaN(appointmentID))
//       return new Response("Invalid ID", { status: 400 });

//     const authHeader = headers.authorization || "";
//     const token = authHeader.replace("Bearer ", "");
//     if (!token) {
//       set.status = 401;
//       return { message: "Unauthorized access - token missing" };
//     }

//     try {
//       const profile = (await jwt.verify(token)) as { id: string };
//       const userId = parseInt(profile.id, 10);
//       return await updateAppointment(
//         appointmentID,
//         body as Appointment,
//         userId
//       ); // Pass userId
//     } catch (error) {
//       console.error("Error verifying token:", error);
//       set.status = 401;
//       return { message: "Unauthorized access - invalid token" };
//     }
//   },
//   {
//     body: AppointmentSchema,
//     detail: {
//       description: "Updates an existing appointment",
//       tags: ["Appointments"],
//       parameters: [
//         {
//           in: "path",
//           name: "id",
//           required: true,
//           schema: { type: "integer" },
//         },
//       ],
//       responses: {
//         200: { description: "Appointment updated successfully" },
//         400: { description: "Invalid appointment ID" },
//         401: { description: "Unauthorized" },
//         404: { description: "Appointment not found" },
//       },
//     },
//   }
// )

// // Start the server
app.listen(5431, () => console.log("Server running on port 5431"));
