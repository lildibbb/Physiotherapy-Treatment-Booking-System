import { Elysia } from "elysia";
import {
  loadSubscriptionsFromFile,
  updateSubscription,
  sendNotificationToUser,
  type NotificationPayload,
  type Subscription,
} from "../services/notification-services";
import { basePath, jwtAccessSetup } from "./setup";
import jsonResponse, { verifyAuth } from "../services/auth-services";

export const NotificationRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/notifications`, (group) => {
    group.post(
      "/subscribe",
      async ({
        body,
        jwt,
        cookie: { auth },
      }: {
        body: Subscription;
        jwt: any;
        cookie: { auth: { value: string | undefined } };
      }) => {
        const authResult = await verifyAuth(jwt, auth?.value);
        if ("error" in authResult) {
          return jsonResponse(authResult, 401);
        }

        const userID = authResult.profile.id;

        if (!body?.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
          return jsonResponse({ error: "Invalid subscription data" }, 400);
        }

        const success = await updateSubscription(userID, body);

        if (success) {
          return jsonResponse(
            {
              message: "Subscription updated successfully",
            },
            200
          );
        } else {
          return jsonResponse(
            {
              error: "Failed to update subscription",
            },
            500
          );
        }
      }
    );

    group.post(
      "/send-notification",
      async ({
        body,
      }: {
        body: { userID: number; payload: NotificationPayload };
      }) => {
        const { userID, payload } = body;

        const success = await sendNotificationToUser(userID, payload);

        if (success) {
          return jsonResponse(
            {
              message: "Notification sent successfully",
            },
            200
          );
        } else {
          return jsonResponse(
            {
              error: "Failed to send notification",
            },
            500
          );
        }
      }
    );

    return group;
  });
