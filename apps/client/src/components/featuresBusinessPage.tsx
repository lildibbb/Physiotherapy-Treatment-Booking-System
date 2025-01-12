import {
  Calendar,
  CreditCard,
  Users,
  FileText,
  MessageSquare,
  BarChart,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const Features = () => (
  <section className="py-20 px-4">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Everything You Need to Run Your Practice
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamline your operations with our comprehensive suite of tools
          designed specifically for physiotherapy clinics.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Calendar className="w-10 h-10 text-primary mb-4" />
            <CardTitle>Smart Scheduling</CardTitle>
            <CardDescription>
              Efficient appointment management with automated reminders and
              online booking.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CreditCard className="w-10 h-10 text-primary mb-4" />
            <CardTitle>Seamless Billing</CardTitle>
            <CardDescription>
              Simplified invoicing, payment processing, and insurance claim
              management.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Users className="w-10 h-10 text-primary mb-4" />
            <CardTitle>Patient Management</CardTitle>
            <CardDescription>
              Complete patient records, treatment history, and progress
              tracking.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <FileText className="w-10 h-10 text-primary mb-4" />
            <CardTitle>Clinical Documentation</CardTitle>
            <CardDescription>
              Easy-to-use templates and secure storage for all patient
              documentation.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <MessageSquare className="w-10 h-10 text-primary mb-4" />
            <CardTitle>Patient Communication</CardTitle>
            <CardDescription>
              Integrated messaging system for seamless patient communication.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <BarChart className="w-10 h-10 text-primary mb-4" />
            <CardTitle>Analytics & Reporting</CardTitle>
            <CardDescription>
              Comprehensive insights into your practice's performance and
              growth.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  </section>
);
