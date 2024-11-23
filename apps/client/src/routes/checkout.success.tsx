import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fulfillCheckoutRequest } from "@/lib/api";

export const Route = createFileRoute("/checkout/success")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const session_id = new URLSearchParams(location.search).get("session_id");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPaymentStatus() {
      if (!session_id) {
        setError("Session ID is missing.");
        return;
      }
      try {
        const response = await fulfillCheckoutRequest(session_id);
        if (response && response.message === "Payment updated") {
          setSuccess("Payment was successful!");
        } else {
          setError("Failed to finalize payment.");
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
        setError("Failed to fetch payment status.");
      }
    }
    fetchPaymentStatus();
  }, [session_id]); // Depend on session_id to re-run the effect when it changes

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (success) {
    return <div>{success}</div>;
  }

  return <div>Hello /checkout/success! Processing your payment...</div>;
}
