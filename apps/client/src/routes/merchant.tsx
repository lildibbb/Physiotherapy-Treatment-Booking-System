import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/header";
import { HeroMerchant } from "@/components/heroMerchant";

export const Route = createFileRoute("/merchant")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <HeroMerchant />
    </>
  );
}
