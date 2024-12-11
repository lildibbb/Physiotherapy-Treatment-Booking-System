import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fulfillCheckoutRequest } from "@/lib/api"; // Reuse the same function

export const Route = createFileRoute("/checkout/cancel")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const session_id = new URLSearchParams(location.search).get("session_id");
  const [message, setMessage] = useState<string>(
    "Processing your cancellation..."
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processCheckoutSession() {
      if (!session_id) {
        setError("Session ID is missing.");
        return;
      }

      try {
        const response = await fulfillCheckoutRequest(session_id);
        console.log("response {cancelled}", response);
        if (response && response.message === "Payment updated") {
          setMessage("Your cancellation has been processed successfully.");
        } else {
          // This handles other statuses dynamically
          setMessage(`An error occurred: ${response.error}`);
        }
      } catch (error) {
        console.error("Error processing checkout session:", error);
        setError("Failed to process the checkout session.");
      }
    }

    processCheckoutSession();
  }, [session_id]);
  window.location.href = "/user/dashboard";
  return <div>{error ? <div>Error: {error}</div> : <div>{message}</div>}</div>;
}
