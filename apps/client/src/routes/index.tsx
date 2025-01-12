import { FAQ } from "@/components/faq";
import { FeatureBusiness } from "@/components/featureBusiness";
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import Hero from "@/components/hero";
import { Testimonial } from "@/components/testimonial";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="place-items-center">
      <Header />
      <Hero />
      <Testimonial />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-transparent h-32" />
        <FeatureBusiness />
      </div>
      <FAQ />
      <Footer />
    </div>
  );
}
