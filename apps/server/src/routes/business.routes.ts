import { Elysia } from "elysia";
import { registerBusiness, verifyAuth } from "../auth/auth-services";
import {
  BusinessRegistrationSchema,
  type BusinessRegistration,
} from "../../types";
import { basePath, jwtAccessSetup } from "./setup";

export const businessRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/business`, (group) => {
    // Register a new business
    group.post(
      `/register`,
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
    );

    return group; // Return the group instance to satisfy the type requirement
  });
