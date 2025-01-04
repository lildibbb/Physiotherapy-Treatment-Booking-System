import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Testimonial = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

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
      image:
        "https://cdn.discordapp.com/avatars/684424900232085522/74ba83eb9bf7be0a9cd14d19df122e4f.webp?size=80",
      feedback:
        "Booking my physiotherapy sessions online has been a game changer! The convenience and personalized care I receive are unmatched.",
      role: "Doctor",
    },
    {
      name: "James Carter",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      feedback:
        "I’ve saved so much time by switching to this platform for my physiotherapy treatments. The therapists are top-notch and certified!",
      role: "Software Developer",
    },
    {
      name: "Emily Walker",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      feedback:
        "The virtual session option is amazing. I was able to receive expert advice from the comfort of my home!",
      role: "Stay-at-home Mom",
    },
  ];

  return (
    <div className=" bg-teal-200 w-full px-4 py-10 lg:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-bold text-left">
            What Our Patients Say
          </h2>
          <Carousel setApi={setApi} className="w-full ">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem className="lg:basis-1/2" key={index}>
                  <div className="bg-muted rounded-md h-full lg:col-span-2 p-6  flex flex-col justify-between">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-xl tracking-tight font-semibold">
                          {testimonial.feedback}
                        </h3>
                        <p className="text-muted-foreground max-w-xs text-base italic">
                          "{testimonial.feedback}"
                        </p>
                      </div>
                      <div className="flex items-center gap-x-2 sm:gap-x-4 mt-4 flex-wrap">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                          <AvatarImage src={testimonial.image} />
                          <AvatarFallback>
                            {testimonial.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="font-medium text-sm sm:text-base">
                            {testimonial.name}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};
