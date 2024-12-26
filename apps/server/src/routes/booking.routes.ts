import Elysia from "elysia";
import { basePath, jwtAccessSetup } from "./setup";

import jsonResponse, { verifyAuth } from "../services/auth-services";
import { AppointmentSchema, type Appointment } from "../../types";
import {
  createAppointment,
  getAppointmentByID,
} from "../services/appointment-services";

export const bookingRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/booking`, (group) => {
    group
      .post(
        "/create",
        async ({ body, cookie: { auth }, jwt }) => {
          console.log("Received body:", body);

          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result {bookAppointment} :", authResult);
          if ("error" in authResult) {
            return jsonResponse(authResult, 401);
          }

          try {
            // Step 2: Destructure and validate request body
            const { therapistID } = body as Appointment;

            console.log("Therapist ID {bookAppointment} :", therapistID);
            return await createAppointment(
              body as Appointment,
              therapistID,
              authResult.profile
            );
          } catch (error) {
            console.error("Error {bookAppointment} :", error);
            return { error: "Internal Server Error", status: 500 };
          }
        },
        {
          body: AppointmentSchema,
          details: {
            description: "Create a new appointment",
            tags: ["Appointment"],
            responses: {
              200: {
                description: "Appointment created successfully",
              },
              400: {
                description: "Bad Request - Invalid appointment data",
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
      .get(
        "/appointment",
        async ({ jwt, cookie: { auth } }) => {
          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result:", authResult);
          if ("error" in authResult) {
            console.log("Error in authResult:", authResult);
            return jsonResponse(authResult, 401);
          }
          try {
            const appointmentData = await getAppointmentByID(
              authResult.profile
            );
            return jsonResponse(appointmentData);
          } catch (error) {
            return jsonResponse(
              { error: "Failed to fetch appointment data" },
              500
            );
          }
        },
        {
          detail: {
            description: "Get appointment details",
            tags: ["Appointment"],
            responses: {
              200: {
                description: "Appointment details fetched successfully",
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
      );

    return group;
  });
