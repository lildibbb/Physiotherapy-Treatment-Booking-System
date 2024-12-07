import { createFileRoute } from "@tanstack/react-router";
import { TherapistList } from "@/components/therapistList";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import specialization from "../../data/specialization.json";
export const Route = createFileRoute("/findDoctor/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Header />
      <div className="mb-6 mt-16">
        <h1 className="text-3xl font-bold mb-4">Find a Therapist</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Enter location"
              className="pl-10 w-full"
            />
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for therapists..."
              className="pl-10 w-full"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              {specialization.specializations.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-full md:w-auto">Search</Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <TherapistList />
        </div>
        <div className="lg:w-1/3 space-y-6">
          <div className=" p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="mb-4">
              Not sure which therapist is right for you? Our team can help you
              find the perfect match.
            </p>
            <Button variant="outline" className="w-full">
              Contact Us
            </Button>
          </div>
          <div className=" p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Therapy Resources</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Understanding Different Therapy Types</li>
              <li>Preparing for Your First Session</li>
              <li>Mental Health Self-Assessment Tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
