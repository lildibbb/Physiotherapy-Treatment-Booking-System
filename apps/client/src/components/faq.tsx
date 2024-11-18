import { PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const FAQ = () => (
  <div className="w-full  px-4 py-10  lg:py-20">
    <div className="container mx-auto">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left Side: FAQ Intro */}
        <div className="flex gap-10 flex-col">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">FAQ</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-bold mb-4">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-[rgb(249,83,198)] to-[rgb(185,29,115)] text-transparent bg-clip-text ">
                  Questions
                </span>
              </h3>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Have questions about our{" "}
                <span className="font-bold  ">PhysioConnect</span> We’ve got you
                covered! Explore the most common inquiries and their answers
                below.
              </p>
            </div>
            <div className="">
              <Button className="gap-4" variant="outline">
                Any questions? Reach out <PhoneCall className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="index-1">
            <AccordionTrigger>
              How do I book a physiotherapy session?
            </AccordionTrigger>
            <AccordionContent>
              To book a physiotherapy session, simply register or log into your
              account, browse available therapists, choose your preferred time
              slot, and confirm your booking.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="index-2">
            <AccordionTrigger>
              Can I cancel or reschedule a booking?
            </AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel or reschedule your booking from your
              dashboard. Please note that cancellations or reschedules must be
              made at least 24 hours in advance to avoid charges.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="index-3">
            <AccordionTrigger>
              Are the physiotherapists certified?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely! All our physiotherapists are certified and experienced
              professionals, ensuring you receive the highest quality care.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="index-4">
            <AccordionTrigger>
              Do you offer virtual physiotherapy sessions?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we provide virtual physiotherapy sessions for your
              convenience. Simply select the "Virtual Session" option when
              booking.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="index-5">
            <AccordionTrigger>
              What should I expect during my first session?
            </AccordionTrigger>
            <AccordionContent>
              During your first session, your physiotherapist will assess your
              condition, discuss your medical history, and create a personalized
              treatment plan tailored to your needs.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="index-6">
            <AccordionTrigger>Is my personal data secure?</AccordionTrigger>
            <AccordionContent>
              Yes, we prioritize your privacy. Your personal data is encrypted
              and securely stored in compliance with all applicable data
              protection regulations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="index-7">
            <AccordionTrigger>
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent>
              We accept various payment methods, including credit/debit cards,
              online bank transfers, and digital wallets, for your convenience.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="index-8">
            <AccordionTrigger>
              How do I contact support for further help?
            </AccordionTrigger>
            <AccordionContent>
              You can contact our support team by clicking the "Any Questions?
              Reach Out" button above or by emailing us at
              support@yourdomain.com.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </div>
);
