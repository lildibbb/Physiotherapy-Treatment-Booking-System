import { Elysia } from "elysia";
import jsonResponse, {
  registerTherapist,
  verifyAuth,
} from "../services/auth-services";

import {
  TherapistRegistrationSchema,
  TherapistSchema,
  type TherapistRegistration,
  type Therapist,
  type Availability,
  AvailabilitySchema,
  AvailabilityBatchSchema,
} from "../../types";
import { basePath, jwtAccessSetup } from "./setup";
import {
  getAllTherapistByBusiness,
  getAllTherapistPublic,
  getTherapistByID,
  updateTherapistDetails,
} from "../services/therapist-services";
import {
  getAvailability,
  getAvailableSlot,
  updateAvailability,
} from "../services/slot-services";

export const therapistRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/therapist`, (group) => {
    // GET: Fetch all therapists by business
    group
      .get(
        `/public`,
        async () => {
          try {
            const therapists = await getAllTherapistPublic();

            if (therapists.length === 0) {
              return jsonResponse(
                { message: "No therapists available to display." },
                404
              );
            }

            return jsonResponse({ data: therapists }, 200);
          } catch (error) {
            console.error("Error fetching public therapist data:", error);
            return jsonResponse(
              { error: "Failed to fetch therapist data." },
              500
            );
          }
        },
        {
          detail: {
            description: "Get all publicly visible therapist information",
            tags: ["Public"],
            responses: {
              200: { description: "Therapist data retrieved successfully" },
              404: { description: "No therapists found" },
              500: { description: "Internal Server Error" },
            },
          },
        }
      )
      .get(
        "/:therapistID",
        async ({ params }) => {
          const therapistID = Number(params.therapistID);

          // Validate therapist ID
          if (isNaN(therapistID)) {
            return jsonResponse({ error: "Invalid therapist ID." }, 400);
          }

          try {
            const therapist = await getTherapistByID(therapistID);
            return jsonResponse(therapist, 200); // Success response with therapist data
          } catch (error: any) {
            console.error("Error fetching therapist:", error.message);
            return jsonResponse({ error: error.message }, 404); // Error response
          }
        },
        {
          detail: {
            description: "Get therapist details by ID",
            tags: ["Public"],
            responses: {
              200: { description: "Therapist details retrieved successfully" },
              400: { description: "Invalid therapist ID" },
              404: { description: "Therapist not found" },
            },
          },
        }
      )

      .get(
        `/`,
        async ({ jwt, cookie: { auth } }) => {
          const authResult = await verifyAuth(jwt, auth?.value);
          console.log(
            "Auth Result [fromGetAllTherapistByBusiness] :",
            authResult
          );

          if ("error" in authResult) {
            return jsonResponse(authResult, 401);
          }

          try {
            // Call the helper function to get staff data by business ID
            const therapistData = await getAllTherapistByBusiness(
              authResult.profile
            );

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
            description:
              "Get all physiotherapist information related to business",
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

      // POST: Register a new therapist
      .post(
        `/register`,
        async ({ body, cookie: { auth }, jwt }) => {
          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result:", authResult);
          if ("error" in authResult) {
            return { error: authResult.error, status: authResult.status };
          }

          return await registerTherapist(
            body as TherapistRegistration,
            authResult.profile
          );
        },
        {
          body: TherapistRegistrationSchema,
          detail: {
            description: "Registers a new physiotherapist",
            tags: ["Physiotherapist"],
            responses: {
              201: { description: "Physiotherapist registered successfully" },
              400: { description: "Bad Request" },
              409: { description: "Conflict - Email already in use" },
              500: { description: "Internal Server Error" },
            },
          },
        }
      )

      // PATCH: Update therapist details by ID
      .patch(
        `/:therapistID`,
        async ({ jwt, body, cookie: { auth }, params }) => {
          const authResult = await verifyAuth(jwt, auth?.value);
          const therapistID = params.therapistID;

          if ("error" in authResult) {
            return jsonResponse(authResult, 401);
          }

          // Type assertion for body to ensure it's an object
          const bodyObj = body as Partial<Therapist>;
          console.log(bodyObj);
          // Validate fields to ensure only valid fields are updated
          const validFields = [
            "email",
            "password",
            "name",
            "specialization",
            "contactDetails",
            "rate",
          ];
          for (const key of Object.keys(bodyObj)) {
            if (!validFields.includes(key)) {
              return jsonResponse({ error: `Invalid field: ${key}` }, 400);
            }
          }

          // Call the updateTherapistDetails function with the provided parameters
          return await updateTherapistDetails(
            bodyObj,
            authResult.profile,
            therapistID
          );
        },
        {
          body: TherapistSchema,
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
      )
      .get(
        "/:therapistID/availability",
        async ({ params }) => {
          const therapistID = Number(params.therapistID);
          console.log(
            "Received GET /api/therapist/:therapistID/availability",
            therapistID
          );
          if (isNaN(therapistID)) {
            return jsonResponse({ error: "Invalid therapist ID" }, 400); // Invalid ID
          }
          try {
            const availableSlots = await getAvailableSlot({ therapistID });

            if (availableSlots.length === 0) {
              return jsonResponse(
                { message: "No available slots for this therapist." },
                404
              );
            }

            return jsonResponse({ availableSlots }, 200); // Success
          } catch (error) {
            console.error("Error fetching availability slots:", error);
            return jsonResponse(
              { error: "Failed to fetch availability slots" },
              500
            );
          }
        },
        {
          detail: {
            description: "Get therapist availability slots by ID",
            tags: ["Physiotherapist"],
            // parameters: [
            //   {
            //     name: "therapistID",
            //     in: "path",
            //     description: "ID of the therapist to fetch availability slots",
            //   },
            // ],
          },
        }
      )
      .patch(
        "/availability",
        async ({ body, cookie: { auth }, jwt }) => {
          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result:", authResult);
          console.log("Received PATCH /api/therapist/availability:", body);
          if ("error" in authResult) {
            return { error: authResult.error, status: authResult.status };
          }

          if (!Array.isArray(body)) {
            return {
              error: "Payload must be an array of availability objects",
              status: 400,
            };
          }

          const results = [];
          for (const item of body as Availability[]) {
            try {
              const result = await updateAvailability(item, authResult.profile);
              results.push({ item, status: "success", result });
            } catch (error: any) {
              console.error("Error updating item:", item, error);
              results.push({
                item,
                status: "error",
                error: error.message || "Unknown error",
              });
            }
          }

          const successCount = results.filter(
            (r) => r.status === "success"
          ).length;
          const errorCount = results.filter((r) => r.status === "error").length;

          return jsonResponse(
            {
              message: "Processing completed",
              successCount,
              errorCount,
              results,
            },
            200
          );
        },
        {
          body: AvailabilityBatchSchema,
          details: {
            description: "Update therapist availability",
            tags: ["Physiotherapist"],
            responses: {
              200: { description: "Availability updated successfully" },
              400: { description: "Bad Request - Invalid availability data" },
              401: { description: "Unauthorized - token missing or invalid" },
              500: { description: "Internal Server Error" },
            },
          },
        }
      )
      // .patch(
      //   "/availability/batch",
      //   async ({ body, cookie: { auth }, jwt }) => {
      //     const authResult = await verifyAuth(jwt, auth?.value);
      //     console.log("Auth Result:", authResult);
      //     console.log(
      //       "Received PATCH /api/therapist/availability/batch:",
      //       body
      //     );
      //     if ("error" in authResult) {
      //       return { error: authResult.error, status: authResult.status };
      //     }

      //     return await updateBatchAvailability(
      //       body as Partial<Availability>[],
      //       authResult.profile
      //     );
      //   },
      //   {
      //     body: AvailabilityBatchSchema, // New batch schema
      //   }
      // )
      .get(
        "/data-and-availability",
        async ({ jwt, cookie: { auth } }) => {
          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result:", authResult);
          if ("error" in authResult) {
            return { error: authResult.error, status: authResult.status };
          }

          return await getAvailability(authResult.profile);
        },
        {
          detail: {
            description: "Get therapist data and availability",
            tags: ["Physiotherapist"],
            responses: {
              200: { description: "Data retrieved successfully" },
              401: { description: "Unauthorized - token missing or invalid" },
              500: { description: "Internal Server Error" },
            },
          },
        }
      );

    return group; // Return the group instance to satisfy Elysia type requirements
  });
