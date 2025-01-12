import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => (
  <section className="py-20 px-4 bg-muted/50">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about PhysioConnect
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>How long is the free trial?</AccordionTrigger>
            <AccordionContent>
              Our free trial lasts 14 days, giving you full access to all
              features. No credit card required.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Can I export my data if I decide to switch?
            </AccordionTrigger>
            <AccordionContent>
              Yes, you can export all your data at any time in standard formats
              compatible with other systems.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Is my data secure and compliant?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we maintain the highest level of security and comply with all
              healthcare data protection regulations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Do you offer training and support?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we provide comprehensive training and 24/7 support to ensure
              your success with our platform.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </section>
);
