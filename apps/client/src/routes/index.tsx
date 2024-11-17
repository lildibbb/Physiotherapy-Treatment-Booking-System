import { Header } from "@/components/header";
import Hero from "@/components/hero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <Hero />
    </>
  );
}
