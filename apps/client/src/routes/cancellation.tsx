import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Cancel } from "@/components/cancel";

export const Route = createFileRoute("/cancellation")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Cancel />
    </>
  );
}
