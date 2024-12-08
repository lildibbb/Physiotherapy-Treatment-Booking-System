import { Elysia } from "elysia";
import jsonResponse, {
  registerStaff,
  verifyAuth,
} from "../services/auth-services";
import { jwt } from "@elysiajs/jwt";
import {
  StaffRegistrationSchema,
  StaffSchema,
  type Staff,
  type StaffRegistration,
} from "../../types";
import {
  getAllStaffByBusiness,
  updateStaffDetails,
} from "../services/services";

import { basePath, jwtAccessSetup } from "./setup";

export const staffRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/staff`, (group) => {
    group
      .get(
        "/",
        async ({ jwt, cookie: { auth } }) => {
          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result {fromGetAllStaff} :", authResult);

          if ("error" in authResult) {
            return jsonResponse(authResult, 401);
          }

          try {
            // Call the helper function to get staff data by business ID
            const staffData = await getAllStaffByBusiness(authResult.profile);

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

      .patch(
        `/:staffID`,
        async ({ jwt, cookie: { auth }, body, params }) => {
          const authResult = await verifyAuth(jwt, auth?.value);
          const staffID = params.staffID;

          if ("error" in authResult) {
            return jsonResponse(authResult, 401);
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
          return await updateStaffDetails(bodyObj, authResult.profile, staffID);
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

      .post(
        "/register",
        async ({ body, cookie: { auth }, jwt }) => {
          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result:", authResult);
          if ("error" in authResult) {
            return { error: authResult.error, status: authResult.status };
          }

          console.log("body:", body);

          return await registerStaff(
            body as StaffRegistration,
            authResult.profile
          );
        },
        {
          body: StaffRegistrationSchema,
          detail: {
            description: "Registers a new staff member",
            tags: ["Staff"],
            responses: {
              201: { description: "Staff registered successfully" },
              400: { description: "Bad Request" },
              409: { description: "Conflict - Email already in use" },
              500: { description: "Internal Server Error" },
            },
          },
        }
      );

    return group; // Return the group instance to satisfy the type requirement
  });
