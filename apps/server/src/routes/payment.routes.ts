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
      .post(`/success`, async (req) => {
        const { sessionID } = req.body as { sessionID: string };
        console.log("Session Id in success endpoint: ", sessionID);

        if (!sessionID) {
          return jsonResponse({ error: "Session ID is required" }, 400);
        }
        try {
          const fulfillCheckout = await fulfillCheckoutRequest(sessionID);
          return jsonResponse({ message: "Payment updated" }, 200);
        } catch (error) {
          return jsonResponse({ error: "Payment not updated" }, 400);
        }
      });
    return group;
  });
