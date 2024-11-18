import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import Business from "../assets/Business.jpg";
export const FeatureBusiness = () => (
  <div className="w-full px-4 py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1">
          <img
            src={Business}
            alt="placeholder hero"
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
        <div className="flex gap-4 pl-0 lg:pl-20 flex-col flex-1">
          <div>
            <Badge>PhysioConnect Platform</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Revolutionize Your Physiotherapy Practice
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Simplify your physiotherapy clinic's operations with PhysioConnect
              – the easy-to-use platform for managing appointments, treatments,
              and client progress. Save time, reduce admin, and focus on
              delivering exceptional care to your patients.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Link to="/merchant">
                {" "}
                <Button className="sm:w-auto">Check Out Now!</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
