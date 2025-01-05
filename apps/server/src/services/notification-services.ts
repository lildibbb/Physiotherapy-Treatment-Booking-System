import * as webPush from "web-push";
import * as fs from "fs";
import * as path from "path";
export interface Subscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
export interface UserSubscription {
  userID: number;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}
export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
}

webPush.setVapidDetails(
  "mailto:adib.asyraaf766666@gmail.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);
console.log("VAPID Public Key:", process.env.VAPID_PUBLIC_KEY);
console.log("VAPID Private Key:", process.env.VAPID_PRIVATE_KEY);
export const sendNotification = async (
  subscription: Subscription,
  payload: NotificationPayload,
  userID?: number
) => {
  try {
    console.log("subcription data in send-notifcation:", subscription);
    await webPush.sendNotification(subscription, JSON.stringify(payload));
    console.log("Notification sent successfully!");
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

const FILE_PATH = path.resolve(__dirname, "./helpers/subscriptions.json");
console.log("File path", FILE_PATH);
export const saveSubscriptionsToFile = (subscriptions: UserSubscription[]) => {
  const dir = path.dirname(FILE_PATH);
  console.log("Saving subscriptions:", subscriptions);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(FILE_PATH, JSON.stringify(subscriptions, null, 2));
};

export const loadSubscriptionsFromFile = (): UserSubscription[] => {
  if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    console.log("data ", data);
    try {
      return JSON.parse(data) as UserSubscription[];
    } catch (error) {
      console.error("Error parsing subscriptions.json:", error);
      return [];
    }
  }
  return []; // Return an empty array if the file does not exist
};

// Helper function to send notification to a specific user
export async function sendNotificationToUser(
  userID: number,
  payload: NotificationPayload
) {
  try {
    const subscriptions = loadSubscriptionsFromFile();
    const userSubscription = subscriptions.find((sub) => sub.userID === userID);

    if (!userSubscription) {
      console.error(`No subscription found for user ID: ${userID}`);
      return;
    }

    await sendNotification(userSubscription.subscription, payload);
    console.log(`Notification sent to user ID: ${userID}`);
  } catch (error) {
    console.error(`Error sending notification to user ID: ${userID}`, error);
  }
}
