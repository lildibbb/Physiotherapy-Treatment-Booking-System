import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import woman1 from "../assets/woman1.jpg";
import woman2 from "../assets/woman2.jpg";
import woman3 from "../assets/woman3.avif";

export const Testimonial = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const autoScroll = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent((prev) => prev + 1);
      }
    }, 4000);

    return () => clearTimeout(autoScroll);
  }, [api, current]);

  const testimonials = [
    {
      name: "Sarah Yasmein",
      image: woman1,
      feedback:
        "Booking my physiotherapy sessions online has been a game changer! The convenience and personalized care I receive are unmatched.",
      role: "Doctor",
    },
    {
      name: "James Carter",
      image: woman2,
      feedback:
        "I've saved so much time by switching to this platform for my physiotherapy treatments. The therapists are top-notch and certified!",
      role: "Software Developer",
    },
    {
      name: "Emily Walker",
      image: woman3,
      feedback:
        "The virtual session option is amazing. I was able to receive expert advice from the comfort of my home!",
      role: "Stay-at-home Mom",
    },
  ];

  return (
    <section className="w-full bg-teal-50/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover why thousands of patients trust PhysioConnect for their
            physiotherapy needs.
          </p>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <blockquote className="space-y-6">
                        <p className="text-base leading-relaxed text-muted-foreground">
                          "{testimonial.feedback}"
                        </p>
                        <footer className="mt-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={testimonial.image}
                                alt={testimonial.name}
                              />
                              <AvatarFallback>
                                {testimonial.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <div className="font-semibold text-foreground">
                                {testimonial.name}
                              </div>
                              <div className="text-muted-foreground">
                                {testimonial.role}
                              </div>
                            </div>
                          </div>
                        </footer>
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
