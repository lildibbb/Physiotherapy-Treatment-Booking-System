// server/index.ts
import { Elysia } from "elysia";
import { Client } from "pg";
import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
} from "./auth/routes";
import { type Appointment, AppointmentSchema } from "../types/index";
import { registerUser, loginUser } from "./auth/auth"; // Import authentication functions
import { jwt } from "@elysiajs/jwt"; // Import the JWT plugin
import {
  type UserRegistration,
  type UserLogin,
  UserRegistrationSchema,
  UserLoginSchema,
} from "../types/index";

// Base API path
const basePath = "/api";

// PostgreSQL Client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

// Set up the Elysia server
new Elysia()
  .use(cors()) // Enable CORS for cross-origin requests
  .use(
    swagger({
      documentation: {
        info: {
          title: "Appointment Booking and Physiotherapy Treatment System",
          version: "1.0.0",
        },
      },
    })
  )
  .use(
    jwt({
      secret: "your_jwt_secret_key", // The secret key used for signing and verifying JWTs
    })
  )

  // Authentication Routes
  .post(
    `${basePath}/auth/register`,
    async ({ body }) => {
      // User registration
      return await registerUser(body as UserRegistration); // Cast body to UserRegistration
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
    `${basePath}/auth/login`,
    async ({ body }) => {
      // User login
      return await loginUser(body as UserLogin); // Cast body to login type
    },
    {
      body: UserLoginSchema,
      detail: {
        description: "Logs in a user",
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

  // RESTful API GET for appointments, protected by JWT middleware
  .get(
    `${basePath}/appointments`,
    async ({ jwt }) => {
      // JWT verification is handled automatically
      return await getAppointments();
    },
    {
      detail: {
        description: "Returns a list of all appointments",
        tags: ["Appointments"],
        responses: {
          200: {
            description: "List of appointments retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      appointmentID: { type: "integer" },
                      appointmentDate: { type: "string", format: "date" },
                      time: { type: "string" },
                      status: { type: "string" },
                      patientID: { type: "integer" },
                      therapistID: { type: "integer" },
                      staffID: { type: "integer" },
                    },
                  },
                },
              },
            },
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
  .get(
    `${basePath}/appointments/:id`,
    async ({ jwt, params }) => {
      const appointmentID = parseInt(params["id"], 10);
      if (isNaN(appointmentID)) {
        return new Response("Invalid ID", { status: 400 });
      }
      return await getAppointmentById(appointmentID);
    },
    {
      detail: {
        description: "Returns an appointment by ID",
        tags: ["Appointments"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Appointment details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    appointmentID: { type: "integer" },
                    appointmentDate: { type: "string", format: "date" },
                    time: { type: "string" },
                    status: { type: "string" },
                    patientID: { type: "integer" },
                    therapistID: { type: "integer" },
                    staffID: { type: "integer" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid appointment ID",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Appointment not found",
          },
        },
      },
    }
  )

  // RESTful API POST to create an appointment, protected by JWT middleware
  .post(
    `${basePath}/appointment`,
    async ({ jwt, body }) => {
      // create new appointment
      return await createAppointment(body as Appointment);
    },
    {
      body: AppointmentSchema,
      detail: {
        description: "Creates a new appointment",
        tags: ["Appointments"],
        responses: {
          201: {
            description: "Appointment created successfully",
          },
          400: {
            description: "Bad Request",
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

  // RESTful API PUT to update an appointment, protected by JWT middleware
  .put(
    `${basePath}/appointment/:id`,
    async ({ jwt, params, body }) => {
      const appointmentID = parseInt(params["id"], 10);
      if (isNaN(appointmentID)) {
        return new Response("Invalid ID", { status: 400 });
      }
      return await updateAppointment(appointmentID, body as Appointment);
    },
    {
      body: AppointmentSchema,
      detail: {
        description: "Updates an existing appointment",
        tags: ["Appointments"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Appointment updated successfully",
          },
          400: {
            description: "Invalid appointment ID",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Appointment not found",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    }
  )

  // Start the server
  .listen(5431);
