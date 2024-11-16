import { Elysia } from "elysia";
import jsonResponse, {
  registerTherapist,
  verifyAuth,
} from "../services/auth-services";
import {
  getAllTherapistByBusiness,
  getAvailableSlot,
  updateTherapistDetails,
} from "../services/services";
import {
  TherapistRegistrationSchema,
  TherapistSchema,
  type TherapistRegistration,
  type Therapist,
} from "../../types";
import { basePath, jwtAccessSetup } from "./setup";

export const therapistRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/therapist`, (group) => {
    // GET: Fetch all therapists by business
    group
      .get(
        `/`,
        async ({ jwt, cookie: { auth } }) => {
          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result [fromGetAllTherapist] :", authResult);

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
          return await updateTherapistDetails(
            bodyObj,
            authResult.profile,
            therapistID
          );
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
      )
      .get(
        "/:therapistID/availability",
        async ({ jwt, cookie: { auth }, params }) => {
          const therapistID = Number(params.therapistID);
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
        }
      );
    return group; // Return the group instance to satisfy Elysia type requirements
  });
