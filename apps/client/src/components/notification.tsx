// components/notification.tsx
import { subscribeToNotifications } from "@/lib/api";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

function NotificationSetup() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    if (!("Notification" in window)) {
      setIsSupported(false);
      setLoading(false);
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setIsSupported(false);
      setLoading(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();
      setIsSubscribed(!!existingSubscription);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsSupported(false);
    }
    setLoading(false);
  };

  const handleSubscriptionChange = async (enabled: boolean) => {
    if (!isSupported) return;

    setLoading(true);
    try {
      if (enabled) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("Notification permission not granted");
          return;
        }

        const registration = await navigator.serviceWorker.ready;
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
        setIsSubscribed(true);
      } else {
        // Unsubscribe logic
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          // You might want to call an API to remove the subscription from your backend
          setIsSubscribed(false);
        }
      }
    } catch (error) {
      console.error("Failed to update notification subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="push-notifications">Push Notifications</Label>
        <p className="text-sm text-muted-foreground">
          {!isSupported
            ? "Push notifications are not supported in this browser"
            : isSubscribed
              ? "You will receive push notifications"
              : "Enable push notifications to stay updated"}
        </p>
      </div>
      <Switch
        id="push-notifications"
        disabled={!isSupported || loading}
        checked={isSubscribed}
        onCheckedChange={handleSubscriptionChange}
      />
    </div>
  );
}

export default NotificationSetup;
