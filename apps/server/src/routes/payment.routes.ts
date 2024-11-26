import Elysia from "elysia";
import {
  createCheckoutSession,
  fulfillCheckoutRequest,
} from "../services/payment-service";
import { basePath, jwtAccessSetup } from "./setup";
import jsonResponse from "../services/auth-services";

export const paymentRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/payment`, (group) => {
    group
      .post(`/checkout`, async (req) => {
        const { appointmentID } = req.body as { appointmentID: number }; // Ensure appointmentID is received from the client
        console.log("Appointment Id in endpoints: ", appointmentID);
        if (!appointmentID) {
          return jsonResponse({ error: "Appointment ID is required" }, 400);
        }
        try {
          const checkoutUrl = await createCheckoutSession(appointmentID);
          return {
            status: 200,
            data: { url: checkoutUrl },
          };
        } catch (error) {
          return {
            status: 500,
            message: (error as Error).message,
          };
        }
      })
      .patch(
        `/success`,
        async (req) => {
          const { sessionID } = req.body as { sessionID: string };
          console.log("Session Id in success endpoint: ", sessionID);

          if (!sessionID) {
            return jsonResponse({ error: "Session ID is required" }, 400);
          }
          try {
            const fulfillCheckout = await fulfillCheckoutRequest(sessionID);
            return jsonResponse({ message: "Payment updated" }, 200);
          } catch (error) {
            return jsonResponse(
              { error: "Failed to update payment due to server error" },
              500
            );
          }
        },
        {
          detail: {
            description: "Update payment status",
            tags: ["Payment"],
            responses: {
              200: {
                description:
                  "Payment status updated successfully or payment has been cancelled.",
              },
              400: { description: "Bad request - Session ID is required." },
              500: {
                description:
                  "Internal Server Error - Failed to update payment.",
              },
            },
          },
        }
      );
    return group;
  });
