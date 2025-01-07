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
  lastUpdated: number; // Timestamp of last update
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

const FILE_PATH = path.resolve(__dirname, "./helpers/subscriptions.json");
const FILE_LOCK_PATH = `${FILE_PATH}.lock`;

// Helper function to acquire a file lock
const acquireLock = async (): Promise<boolean> => {
  try {
    if (fs.existsSync(FILE_LOCK_PATH)) {
      const lockData = fs.readFileSync(FILE_LOCK_PATH, "utf-8");
      const lockTime = parseInt(lockData);
      // If lock is older than 10 seconds, consider it stale
      if (Date.now() - lockTime < 10000) {
        return false;
      }
    }
    fs.writeFileSync(FILE_LOCK_PATH, Date.now().toString());
    return true;
  } catch (error) {
    console.error("Error acquiring lock:", error);
    return false;
  }
};

// Helper function to release the file lock
const releaseLock = () => {
  try {
    if (fs.existsSync(FILE_LOCK_PATH)) {
      fs.unlinkSync(FILE_LOCK_PATH);
    }
  } catch (error) {
    console.error("Error releasing lock:", error);
  }
};

// Save subscriptions with file locking
export const saveSubscriptionsToFile = async (
  subscriptions: UserSubscription[]
) => {
  const acquired = await acquireLock();
  if (!acquired) {
    console.log("Could not acquire lock for saving subscriptions");
    return;
  }

  try {
    const dir = path.dirname(FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(subscriptions, null, 2));
  } catch (error) {
    console.error("Error saving subscriptions:", error);
  } finally {
    releaseLock();
  }
};

// Load subscriptions with file locking
export const loadSubscriptionsFromFile = async (): Promise<
  UserSubscription[]
> => {
  const acquired = await acquireLock();
  if (!acquired) {
    console.log("Could not acquire lock for loading subscriptions");
    return [];
  }

  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(data) as UserSubscription[];
    }
    return [];
  } catch (error) {
    console.error("Error loading subscriptions:", error);
    return [];
  } finally {
    releaseLock();
  }
};

// Updated function to send notification to a user
export async function sendNotificationToUser(
  userID: number,
  payload: NotificationPayload
) {
  try {
    // Wait a short time to ensure any subscription updates are complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    const subscriptions = await loadSubscriptionsFromFile();
    const userSubscriptions = subscriptions
      .filter((sub) => sub.userID === userID)
      .sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0)); // Use most recent subscription

    if (!userSubscriptions.length) {
      console.error(`No subscriptions found for user ID: ${userID}`);
      return;
    }

    // Try to send notification to the most recent subscription first
    const latestSubscription = userSubscriptions[0];
    try {
      await webPush.sendNotification(
        latestSubscription.subscription,
        JSON.stringify(payload)
      );
      console.log(`Notification sent successfully to user ${userID}`);
      return true;
    } catch (error: any) {
      console.error(`Error sending notification to user ${userID}:`, error);

      // If it's an expired subscription, remove it
      if (error.statusCode === 410) {
        const updatedSubscriptions = subscriptions.filter(
          (sub) =>
            sub.subscription.endpoint !==
            latestSubscription.subscription.endpoint
        );
        await saveSubscriptionsToFile(updatedSubscriptions);
      }
      return false;
    }
  } catch (error) {
    console.error(`Error in sendNotificationToUser for user ${userID}:`, error);
    return false;
  }
}

// Updated function to update or add a subscription
export async function updateSubscription(
  userID: number,
  subscription: Subscription
) {
  try {
    const subscriptions = await loadSubscriptionsFromFile();

    // Remove old subscriptions for this user
    const filteredSubscriptions = subscriptions.filter(
      (sub) => sub.userID !== userID
    );

    // Add new subscription with timestamp
    const newSubscription: UserSubscription = {
      userID,
      subscription,
      lastUpdated: Date.now(),
    };

    filteredSubscriptions.push(newSubscription);
    await saveSubscriptionsToFile(filteredSubscriptions);

    return true;
  } catch (error) {
    console.error("Error updating subscription:", error);
    return false;
  }
}
