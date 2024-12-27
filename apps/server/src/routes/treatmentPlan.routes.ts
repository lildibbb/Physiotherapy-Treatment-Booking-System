import { Elysia } from "elysia";
import jsonResponse, { verifyAuth } from "../services/auth-services";
import { basePath, jwtAccessSetup } from "./setup";
import {
  createTreatmentPlan,
  getTreatmentPlan,
} from "../services/treatmentPlan-services";
import { TreatmentPlanSchema, type TreatmentPlan } from "../../types";

export const treatmentPlanRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/treatment-plan`, (group) => {
    group
      .get(
        `/:appointmentID/treatment-plan`,
        async ({ params, jwt, cookie: { auth } }) => {
          // Verify authentication and extract user profile
          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result [fromGetTreatmentPlan]:", authResult);

          if ("error" in authResult) {
            return jsonResponse({ error: authResult.error }, 401);
          }

          const appointmentID = Number(params.appointmentID);

          // Validate appointmentID
          if (isNaN(appointmentID)) {
            return jsonResponse({ error: "Invalid appointment ID" }, 400);
          }

          try {
            // Fetch treatment plan
            const data = await getTreatmentPlan(
              appointmentID,
              authResult.profile
            );

            // If no data found
            if (!data) {
              return jsonResponse(
                { error: "No treatment plan found or access denied." },
                404
              );
            }

            return data;
          } catch (error: any) {
            // Log and handle unexpected errors
            console.error(
              `Error while fetching treatment plan for appointmentID: ${appointmentID}`,
              error.message
            );
            return jsonResponse(
              {
                error:
                  "An unexpected error occurred while fetching the treatment plan.",
              },
              500
            );
          }
        },
        {
          detail: {
            description:
              "Get treatment plan details for a specific appointment",
            tags: ["Treatment Plan"],
            parameters: [
              {
                name: "appointmentID",
                in: "path",
                required: true,
                schema: {
                  type: "integer",
                },
                description:
                  "The ID of the appointment for which the treatment plan is requested",
              },
            ],
            responses: {
              200: {
                description: "Treatment plan details returned successfully",
              },
              400: {
                description: "Invalid appointment ID",
              },
              401: {
                description:
                  "Unauthorized: Authentication failed or not provided",
              },
              404: {
                description: "No treatment plan found or access denied",
              },
              500: {
                description:
                  "Unexpected server error while fetching treatment plan",
              },
            },
          },
        }
      )
      .post(
        `/:appointmentID/create-treatment-plan`,
        async ({ body, jwt, cookie: { auth }, params }) => {
          // Authenticate user
          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result [fromCreateTreatmentPlan]:", authResult);

          if ("error" in authResult) {
            return jsonResponse({ error: authResult.error }, 401);
          }

          // Parse and validate appointmentID
          const appointmentID = Number(params.appointmentID);
          if (isNaN(appointmentID)) {
            return jsonResponse({ error: "Invalid appointment ID" }, 400);
          }

          // Call service to create the treatment plan
          try {
            const result = await createTreatmentPlan(
              body as TreatmentPlan, // Validate `body` based on the schema
              appointmentID,
              authResult.profile
            );

            return result; // `createTreatmentPlan` already returns appropriate responses
          } catch (error: any) {
            console.error(
              `Error while creating treatment plan for appointmentID: ${appointmentID}`,
              error.message
            );

            return jsonResponse(
              {
                error:
                  "An unexpected error occurred while creating the treatment plan",
              },
              500
            );
          }
        },
        {
          body: TreatmentPlanSchema,
          detail: {
            description:
              "Create a new treatment plan for a specific appointment",
            tags: ["Treatment Plan"],
            parameters: [
              {
                name: "appointmentID",
                in: "path",
                required: true,
                schema: {
                  type: "integer",
                },
                description:
                  "The ID of the appointment for which the treatment plan is to be created",
              },
            ],
            responses: {
              201: {
                description: "Treatment plan created successfully",
              },
              400: {
                description:
                  "Invalid request, such as missing fields or invalid appointment ID",
              },
              401: {
                description:
                  "Unauthorized: Authentication failed or not provided",
              },
              403: {
                description:
                  "Forbidden: User not authorized to create treatment plan for this appointment",
              },
              404: {
                description: "Appointment not found",
              },
              409: {
                description:
                  "Conflict: A treatment plan already exists for the appointment",
              },
              500: {
                description:
                  "Unexpected server error while creating the treatment plan",
              },
            },
          },
        }
      );
    return group;
  });
