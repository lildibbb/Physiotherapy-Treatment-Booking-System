import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import HeroImage from "../assets/HeroImage1.gif";
export const HeroMerchant = () => (
  <div className="w-full px-4 py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
        <div className="flex gap-4 flex-col">
          <div>
            <Badge variant="outline">Merchant!</Badge>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-bold">
              Ready to{" "}
              <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                Transform
              </span>{" "}
              Your Physiotherapy Practice?
            </h1>
            <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
              Managing a physiotherapy clinic shouldn't be more complicated than
              necessary. Sign up today and simplify your business with
              PhysioConnect – the platform built to streamline your operations
              and enhance patient care.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button size="default" className="gap-4" variant="outline">
              Jump on a call <PhoneCall className="w-4 h-4" />
            </Button>
            <Link to="/signup/business">
              <Button variant="linkHover2" size="default" className="gap-4">
                Sign me up!
                <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-muted rounded-md aspect-square">
            <img
              src={HeroImage}
              alt="placeholder hero"
              className="max-h-96 w-full rounded-md object-cover"
            />
          </div>
          <div className="bg-muted rounded-md row-span-2">
            <img
              src={HeroImage}
              alt="placeholder hero"
              className="max-h-96 w-full rounded-md object-cover"
            />
          </div>
          <div className="bg-muted rounded-md aspect-square">
            <img
              src={HeroImage}
              alt="placeholder hero"
              className="max-h-96 w-full rounded-md object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
