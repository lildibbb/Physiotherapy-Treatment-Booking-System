import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import HeroImage from "../assets/HeroImage1.gif";

export const HeroMerchant = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-grid-small-black/[0.02] -z-10" />
    <div className="w-full px-4 py-20 lg:py-32">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
          <div className="flex gap-6 flex-col">
            <div className="space-y-2">
              <Badge variant="outline" className="px-4 py-1 text-base">
                For Physiotherapy Clinics
              </Badge>
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl max-w-xl tracking-tight font-bold">
                Streamline Your{" "}
                <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                  Physiotherapy Practice
                </span>{" "}
                with Ease
              </h1>
              <p className="text-xl leading-relaxed text-muted-foreground max-w-lg">
                Transform your clinic's efficiency with our all-in-one platform.
                Simplify scheduling, patient management, and billing while
                delivering exceptional care.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/signup/business" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2"
                  variant="default"
                >
                  Start Free Trial
                  <MoveRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2"
              >
                Book a Demo
                <PhoneCall className="w-4 h-4" />
              </Button>
            </div>
            <div className="pt-6">
              <p className="text-sm text-muted-foreground">
                ✓ No credit card required &nbsp; ✓ 14-day free trial &nbsp; ✓
                Cancel anytime
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#61DAFB]/20 via-[#1fc0f1]/20 to-[#03a3d7]/20 blur-3xl -z-10" />
            <div className="grid grid-cols-5 gap-4 relative">
              <div className="col-span-3 row-span-3">
                <img
                  src={HeroImage}
                  alt="PhysioConnect dashboard interface"
                  className="w-full h-full object-cover rounded-xl shadow-2xl"
                />
              </div>
              <div className="col-span-2 row-span-2">
                <img
                  src={HeroImage}
                  alt="Patient management interface"
                  className="w-full h-full object-cover rounded-xl shadow-xl"
                />
              </div>
              <div className="col-span-2">
                <img
                  src={HeroImage}
                  alt="Scheduling interface"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
