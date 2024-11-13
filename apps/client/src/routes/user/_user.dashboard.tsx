import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/_user/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return "Hello /_user/dashboard!";
}
