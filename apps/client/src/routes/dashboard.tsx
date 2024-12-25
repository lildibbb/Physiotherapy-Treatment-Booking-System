import { createFileRoute, redirect } from "@tanstack/react-router";

interface AuthContext {
  auth: {
    isAuthenticated: boolean;
    role: string;
  };
}

export const Route = createFileRoute("/dashboard")({
  // beforeLoad: ({ context }) => {
  //   if (!context.auth.isAuthenticated) {
  //     throw redirect({ to: "/login" });
  //   }
  //   // Redirect based on role
  //   if (context.auth.role === "staff") {
  //     throw redirect({ to: "/staff/dashboard" });
  //   }
  //   if (context.auth.role === "user") {
  //     throw redirect({ to: "/user/dashboard" });
  //   }
  //   if (context.auth.role === "business") {
  //     throw redirect({ to: "/dashboard" });
  //   }
  // },
});
