import { PushSubscriptions, subscribeToNotifications } from "@/lib/api";
import { useEffect } from "react";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
console.log("VAPID_PUBLIC_KEY:", VAPID_PUBLIC_KEY);
console.log("Environment Variables:", import.meta.env);
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

function NotificationSetup() {
  useEffect(() => {
    // Ask for notification permissions
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          subscribeToPushNotifications();
        } else {
          console.error("Notification permission denied.");
        }
      });
    }
  }, []);

  const subscribeToPushNotifications = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;

        // Check for existing subscription
        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          console.log("Existing subscription found:", existingSubscription);

          // Send existing subscription to server
          const subscriptionJSON = existingSubscription.toJSON();
          const subscriptionWithKeys: PushSubscriptions = {
            endpoint: subscriptionJSON.endpoint || "",
            keys: {
              p256dh: subscriptionJSON.keys?.p256dh || "",
              auth: subscriptionJSON.keys?.auth || "",
            },
          };

          await subscribeToNotifications(subscriptionWithKeys);
          return;
        }

        // Create a new subscription
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        console.log("New Push subscription:", newSubscription);

        // Send new subscription to server
        const newSubscriptionJSON = newSubscription.toJSON();
        const subscriptionWithKeys: PushSubscriptions = {
          endpoint: newSubscriptionJSON.endpoint || "",
          keys: {
            p256dh: newSubscriptionJSON.keys?.p256dh || "",
            auth: newSubscriptionJSON.keys?.auth || "",
          },
        };

        await subscribeToNotifications(subscriptionWithKeys);
      } catch (error) {
        console.error("Push subscription failed:", error);
      }
    }
  };
  return null;
}

export default NotificationSetup;
