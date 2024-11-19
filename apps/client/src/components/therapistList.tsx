import { useEffect, useState } from "react";
import { fetchAllTherapistPublic } from "../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Hospital,
  Hourglass,
  Languages,
  MapPinHouse,
  UserRoundMinus,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

type Therapist = {
  therapistID: number;
  name: string;
  specialization: string;
  qualification: string[];
  experience: number | null;
  businessName: string;
  location: string;
  image?: string;
  languages?: string[];
};

export const TherapistList = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getTherapists() {
      try {
        const data = await fetchAllTherapistPublic();
        console.log("Fetched Data: ", data);
        setTherapists(data.data);
      } catch (err) {
        setError("Failed to fetch therapists.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getTherapists();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {therapists.map((therapist, index) => (
        <Card key={index} className="flex flex-col bg-white  rounded-lg p-4">
          {/* Top Section: Two Columns */}
          <div className="flex flex-row space-x-6">
            {/* Left Column: Therapist Image */}
            <CardHeader>
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={therapist.image || "https://via.placeholder.com/150"}
                  alt={therapist.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardHeader>

            {/* Middle Column: Name, Specialization, Business Name */}
            <CardContent className="flex-1 space-y-2">
              <CardTitle className="text-xl font-bold mb-1">
                {therapist.name}
              </CardTitle>
              <CardDescription className="text-sm font-semibold text-gray-600">
                <UserRoundMinus className="inline mr-2 mb-1" />
                {therapist.specialization}
              </CardDescription>
              <CardDescription className="text-sm font-semibold text-gray-700">
                <Hospital className="inline mr-2 mb-1" />
                {therapist.businessName}
              </CardDescription>
              <CardDescription className="text-sm font-semibold text-gray-600">
                <MapPinHouse className="inline mr-2 mb-1" />
                {therapist.location || "Location not provided"}
              </CardDescription>
            </CardContent>

            {/* Right Column: Location, Experience, Language, Qualification */}
            <CardContent className="flex-1 space-y-2 py-7">
              <CardDescription className="text-sm text-gray-600">
                <Hourglass className="inline mr-2 mb-1" />
                <span className="font-semibold">Experience:</span>{" "}
                {therapist.experience
                  ? `${therapist.experience} years`
                  : "Not provided"}
              </CardDescription>
              <CardDescription className="text-sm text-gray-600">
                <Languages className="inline mr-2 mb-1 " />
                <span className="font-semibold">Languages:</span>{" "}
                {therapist.languages?.join(", ") || "Not provided"}
              </CardDescription>
              <CardDescription className="text-sm text-gray-600">
                <GraduationCap className="inline mr-2 mb-1" />
                <span className="font-semibold">Qualifications:</span>{" "}
                {therapist.qualification.length > 0
                  ? therapist.qualification.join(", ")
                  : "Not provided"}
              </CardDescription>
            </CardContent>
          </div>

          {/* Bottom Section: Book Button */}
          <div className="pt-4 flex justify-center">
            <Link
              to="/findDoctor/$therapistID"
              params={{ therapistID: therapist.therapistID.toString() }}
            >
              <button className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Book
              </button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};
