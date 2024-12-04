import { FAQ } from "@/components/faq";
import { FeatureBusiness } from "@/components/featureBusiness";
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import Hero from "@/components/hero";
import { Testimonial } from "@/components/testimonial";
import TherapistCard from "@/components/therapistCard";
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
      <FeatureBusiness />
      <FAQ />

      <Footer />
    </div>
  );
}
