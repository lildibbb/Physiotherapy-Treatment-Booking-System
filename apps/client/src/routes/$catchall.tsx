import { NotFound } from "@/components/404";
import UnderConstruction from "@/components/construction";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$catchall")({
  component: NotFoundComponent,
});

function NotFoundComponent() {
  return (
    <>
      <UnderConstruction />
    </>
  );
}
