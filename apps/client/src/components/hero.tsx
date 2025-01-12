import { Link } from "@tanstack/react-router";
import HeroImage from "../assets/HeroImage.png";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center mt-10 py-20 md:py-32 gap-10 ">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Physio
            </span>
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Connect
            </span>{" "}
            Your Daily
          </h1>{" "}
          <h2 className="inline">Online Physiotherapist</h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Book your physiotherapy sessions online effortlessly and get
          personalized treatments tailored to your needs.
        </p>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
          <Link to="/findDoctor">
            <Button className="sm:w-auto">Find My Doctor</Button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-lg mt-6">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold">500+</h3>
            <p className="text-sm text-muted-foreground">Expert Doctors</p>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold">24/7</h3>
            <p className="text-sm text-muted-foreground">Support</p>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold">98%</h3>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="z-10">
        <img
          src={HeroImage}
          alt="placeholder hero"
          className="max-h-96 w-full rounded-md object-cover"
        />
      </div>
    </section>
  );
};

export default Hero;
