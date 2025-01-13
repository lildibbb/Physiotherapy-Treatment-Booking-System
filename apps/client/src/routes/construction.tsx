import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import UnderConstruction from "@/components/construction";

export const Route = createFileRoute("/construction")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UnderConstruction />;
}
