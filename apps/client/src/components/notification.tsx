import { subscribeToNotifications } from "@/lib/api";
import { useEffect, useRef } from "react";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

function NotificationSetup() {
  const setupComplete = useRef(false);

  useEffect(() => {
    const setupNotifications = async () => {
      // Only run setup once
      if (setupComplete.current) return;

      if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("Notification permission not granted");
          return;
        }

        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
          console.log("Push notifications not supported");
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        const existingSubscription =
          await registration.pushManager.getSubscription();

        // If we have an existing subscription, use it
        if (existingSubscription) {
          console.log("Using existing push subscription");
          const subscriptionJSON = existingSubscription.toJSON();
          await subscribeToNotifications({
            endpoint: subscriptionJSON.endpoint || "",
            keys: {
              p256dh: subscriptionJSON.keys?.p256dh || "",
              auth: subscriptionJSON.keys?.auth || "",
            },
          });
          setupComplete.current = true;
          return;
        }

        // Create new subscription
        console.log("Creating new push subscription");
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        const subscriptionJSON = subscription.toJSON();
        await subscribeToNotifications({
          endpoint: subscriptionJSON.endpoint || "",
          keys: {
            p256dh: subscriptionJSON.keys?.p256dh || "",
            auth: subscriptionJSON.keys?.auth || "",
          },
        });

        setupComplete.current = true;
      } catch (error) {
        console.error("Failed to setup notifications:", error);
      }
    };

    setupNotifications();
  }, []);

  return null;
}

export default NotificationSetup;
