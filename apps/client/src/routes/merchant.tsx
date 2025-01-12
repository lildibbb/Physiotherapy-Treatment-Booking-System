import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { HeroMerchant } from "@/components/heroMerchant";
import { Features } from "@/components/featuresBusinessPage";
import { FAQ } from "@/components/faq";
import { Statistics } from "@/components/statistics";
import { CTASection } from "@/components/cta-section";

export const Route = createFileRoute("/merchant")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroMerchant />
        <Statistics />
        <Features />
        <FAQ />
        <CTASection />
      </main>
    </div>
  );
}
