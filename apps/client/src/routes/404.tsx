import { NotFound } from "@/components/404";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/404")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <NotFound />
    </>
  );
}
