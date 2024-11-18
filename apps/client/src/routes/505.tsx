import { createFileRoute } from "@tanstack/react-router";
import { InternalServerError } from "@/components/505";

export const Route = createFileRoute("/505")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <InternalServerError />
    </>
  );
}
