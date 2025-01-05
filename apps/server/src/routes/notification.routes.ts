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
        body: Subscription; // No nested subscription key
        jwt: any;
        cookie: { auth: { value: string | undefined } };
      }) => {
        // Verify the authentication token
        const authResult = await verifyAuth(jwt, auth?.value);
        if ("error" in authResult) {
          return jsonResponse(authResult, 401);
        }
        console.log("Received request at /subscribe:", body);

        // Extract userID from the authenticated user's profile
        const userID = authResult.profile.id;
        console.log("User ID:", userID);

        // Validate the subscription object
        if (!body?.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
          return { error: "Invalid subscription data" };
        }
        console.log("New subscription received for user:", userID);

        // Check if the subscription already exists
        const exists = subscriptions.some(
          (sub) =>
            sub.userID === userID && sub.subscription.endpoint === body.endpoint
        );

        if (exists) {
          console.log("Subscription already exists for user:", userID);
          return { message: "Subscription already exists!" };
        }

        // Add the new subscription with userID to the subscriptions list
        subscriptions.push({
          userID,
          subscription: {
            endpoint: body.endpoint,
            keys: body.keys,
          },
        });

        // Save subscriptions to file
        try {
          saveSubscriptionsToFile(subscriptions);
          console.log("Subscriptions saved to file.");
        } catch (error) {
          console.error("Error saving subscriptions to file:", error);
          return { error: "Failed to save subscription data." };
        }

        return { message: "Subscription saved successfully!" };
      }
    );
    group.post(
      "/send-notification",
      async ({ body }: { body: { payload: NotificationPayload } }) => {
        const { payload } = body;
        console.log("Payload being sent to subscription:", payload);
        console.log("subscription data:", subscriptions);

        if (!subscriptions.length) {
          return { error: "No subscriptions available to send notifications." };
        }

        // Validate subscriptions
        const validSubscriptions = subscriptions.filter(
          (sub: UserSubscription) => {
            const subscription = sub.subscription; // Access the subscription object
            if (
              !subscription.endpoint ||
              !subscription.keys?.p256dh ||
              !subscription.keys?.auth
            ) {
              console.error("Invalid subscription object:", subscription);
              return false;
            }
            return true;
          }
        );

        const results = await Promise.all(
          validSubscriptions.map(async (sub: UserSubscription) => {
            const subscription = sub.subscription; // Access the subscription object
            try {
              await webPush.sendNotification(
                subscription,
                JSON.stringify(payload)
              );
              console.log("Payload sent:", JSON.stringify(payload));

              return { success: true };
            } catch (error: any) {
              console.error(
                "Error sending notification:",
                error.message,
                "Endpoint:",
                subscription.endpoint
              );
              // Remove invalid subscription
              if (error.statusCode === 410) {
                console.log(
                  "Removing expired subscription:",
                  subscription.endpoint
                );
                const subIndex = subscriptions.findIndex(
                  (s) => s.subscription.endpoint === subscription.endpoint
                );
                if (subIndex !== -1) {
                  subscriptions.splice(subIndex, 1); // Remove the invalid subscription
                }
                saveSubscriptionsToFile(subscriptions); // Save updated subscriptions
              }
              return {
                success: false,
                error: error.message,
                endpoint: subscription.endpoint,
              };
            }
          })
        );

        const failed = results.filter((result) => !result.success);
        return {
          message: "Notifications processed.",
          total: validSubscriptions.length,
          failed: failed.length,
          errors: failed, // Include detailed errors in the response
        };
      }
    );

    return group;
  });
