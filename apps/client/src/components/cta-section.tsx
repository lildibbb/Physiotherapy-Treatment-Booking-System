import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MoveRight } from "lucide-react";

export const CTASection = () => (
  <section className="py-20 px-4">
    <div className="container mx-auto">
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary" />
        <div className="relative px-8 py-16 sm:px-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of successful physiotherapy clinics already using
              PhysioConnect. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup/business">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto gap-2"
                >
                  Start Free Trial
                  <MoveRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:text-primary hover:bg-white"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
