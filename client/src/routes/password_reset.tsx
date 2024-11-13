import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/password_reset")({
	component: RouteComponent,
});

function RouteComponent() {
	return "Hello /password_reset!";
}
