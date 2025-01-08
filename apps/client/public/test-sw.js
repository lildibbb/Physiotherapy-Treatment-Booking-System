self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  console.log("Push event received:", data);
  const title = data.title || "Default Title";
  const options = {
    body: data.body || "Default notification body",
    icon: "/pwa-192x192.png", // Path to your app's icon
    badge: "/pwa-192x192.png",
    data: {
      url: data.url || "/", // Set the URL in the notification data
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
