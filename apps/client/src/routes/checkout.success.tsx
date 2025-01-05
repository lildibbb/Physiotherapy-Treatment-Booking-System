import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fulfillCheckoutRequest } from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Loader2, XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/success")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const session_id = new URLSearchParams(location.search).get("session_id");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  useEffect(() => {
    async function fetchPaymentStatus() {
      if (!session_id) {
        setError("Session ID is missing.");
        return;
      }
      try {
        const response = await fulfillCheckoutRequest(session_id);
        console.log(response);
        if (response && response.message === "Payment updated") {
          setSuccess("Payment was successful!");
          // Wait 2 seconds before starting redirect
          setTimeout(() => {
            setIsRedirecting(true);
            setTimeout(() => {
              window.location.href = "/user/appointment";
            }, 1000); // Additional 1 second for redirect animation
          }, 4000);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <Card
        className={`w-full max-w-md transition-opacity duration-500 ${isRedirecting ? "opacity-0" : "opacity-100"}`}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Checkout Status</CardTitle>
          <CardDescription>
            {!error && !success ? "Processing your payment..." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {!error && !success && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">
                Please wait while we confirm your payment...
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-50 p-3">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-red-500 font-medium">Error</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="mt-4"
              >
                Return to Home
              </Button>
            </div>
          )}

          {success && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-50 p-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-center">
                <p className="text-green-500 font-medium">{success}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isRedirecting
                    ? "Redirecting to your appointment..."
                    : "You will be redirected shortly..."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
