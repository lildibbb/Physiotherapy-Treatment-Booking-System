import Elysia from "elysia";
import { createCheckoutSession } from "../services/payment-service";
import { basePath, jwtAccessSetup } from "./setup";

export const paymentRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/payment`, (group) => {
    group.post(`/checkout`, async (req) => {
      try {
        const checkoutUrl = await createCheckoutSession();
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
    });
    return group;
  });
