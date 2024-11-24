import { createFileRoute } from "@tanstack/react-router";
import { TherapistList } from "@/components/therapistList";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/findDoctor/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Header />
      <div className=" mb-4 py-4">
        <div className="flex flex-col border-gray-400 md:flex-row gap-2">
          <Input
            type="search"
            placeholder="Location"
            className="w-full p-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            type="text"
            placeholder="Search for therapists..."
            className="w-full p-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1  h-auto md:mr-4">
          <h1 className="text-2xl font-bold mb-4">Therapist</h1>
          <TherapistList />
        </div>
        <div className="md:w-1/3 flex flex-col gap-4">
          <div className="mb-8"></div>
          <div className="bg-teal-100 h-40"></div>
          <div className="bg-teal-100 h-40"></div>
        </div>
      </div>
    </div>
  );
}
