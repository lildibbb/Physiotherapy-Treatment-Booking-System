import { Elysia } from "elysia";
import * as webPush from "web-push";
import {
  loadSubscriptionsFromFile,
  saveSubscriptionsToFile,
  type NotificationPayload,
  type Subscription,
  type UserSubscription,
} from "../services/notification-services";
import { basePath, jwtAccessSetup } from "./setup";
import jsonResponse, { verifyAuth } from "../services/auth-services";

export const NotificationRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/notifications`, (group) => {
    let subscriptions: UserSubscription[] = loadSubscriptionsFromFile();

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
        // Verify the authentication token
        const authResult = await verifyAuth(jwt, auth?.value);
        if ("error" in authResult) {
          return jsonResponse(authResult, 401);
        }

        const userID = authResult.profile.id;
        console.log("Processing subscription for user:", userID);

        // Validate the subscription object
        if (!body?.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
          return jsonResponse({ error: "Invalid subscription data" }, 400);
        }

        // Remove any existing subscriptions for this user
        subscriptions = subscriptions.filter((sub) => sub.userID !== userID);
        console.log(`Removed existing subscriptions for user ${userID}`);

        // Add the new subscription
        const newSubscription: UserSubscription = {
          userID,
          subscription: {
            endpoint: body.endpoint,
            keys: body.keys,
          },
        };

        subscriptions.push(newSubscription);
        console.log(`Added new subscription for user ${userID}`);

        // Save updated subscriptions to file
        try {
          saveSubscriptionsToFile(subscriptions);
          console.log("Updated subscriptions saved to file");
          return jsonResponse(
            {
              message: "Subscription updated successfully",
              subscription: newSubscription,
            },
            200
          );
        } catch (error) {
          console.error("Error saving subscription:", error);
          return jsonResponse(
            {
              error: "Failed to save subscription",
            },
            500
          );
        }
      }
    );

    group.post(
      "/send-notification",
      async ({ body }: { body: { payload: NotificationPayload } }) => {
        const { payload } = body;
        console.log("Processing notification payload:", payload);

        if (!subscriptions.length) {
          return jsonResponse(
            {
              error: "No subscriptions available",
            },
            404
          );
        }

        const validSubscriptions: UserSubscription[] = [];
        const results = await Promise.all(
          subscriptions.map(async (sub) => {
            try {
              await webPush.sendNotification(
                sub.subscription,
                JSON.stringify(payload)
              );
              validSubscriptions.push(sub);
              return { success: true, userID: sub.userID };
            } catch (error: any) {
              console.error(
                `Error sending notification to user ${sub.userID}:`,
                error.message
              );
              return {
                success: false,
                userID: sub.userID,
                error: error.message,
                endpoint: sub.subscription.endpoint,
              };
            }
          })
        );

        // Update subscriptions list with only valid ones
        subscriptions = validSubscriptions;
        saveSubscriptionsToFile(subscriptions);

        const failed = results.filter((result) => !result.success);
        return jsonResponse(
          {
            message: "Notifications processed",
            total: subscriptions.length,
            successful: subscriptions.length,
            failed: failed.length,
            errors: failed,
          },
          200
        );
      }
    );

    return group;
  });
