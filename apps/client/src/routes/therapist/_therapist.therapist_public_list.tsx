import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchAllStaffPublic } from "../../lib/api"; // Import your API function

export const Route = createFileRoute(
  "/therapist/_therapist/therapist_public_list"
)({
  component: RouteComponent,
});

// Define the Therapist type based on API response structure
type Therapist = {
  name: string;
  specialization: string;
  qualification: string[];
  experience: number | null;
  businessName: string;
  location: string;
  image?: string; // Optional field
  languages?: string[]; // Optional field
};

function RouteComponent() {
  const [therapists, setTherapists] = useState<Therapist[]>([]); // Explicit type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Allow null or string

  useEffect(() => {
    async function getTherapists() {
      try {
        const data = await fetchAllStaffPublic(); // Call the API
        setTherapists(data.data); // Assuming API response structure includes `data` key
      } catch (err) {
        setError("Failed to fetch therapists."); // Handle errors
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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Therapists</h1>
      {therapists.length === 0 ? (
        <div className="text-center py-4">No therapists available.</div>
      ) : (
        <div className="space-y-6">
          {therapists.map((therapist, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col lg:flex-row gap-4"
            >
              {/* Therapist Image */}
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={therapist.image || "https://via.placeholder.com/150"}
                  alt={therapist.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Therapist Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{therapist.name}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  {therapist.specialization}
                </p>
                <p className="text-gray-700 mb-4">{therapist.businessName}</p>
                <p className="text-sm text-gray-500">
                  {therapist.location || "Location not provided"}
                </p>
              </div>

              {/* Additional Info */}
              <div className="lg:w-1/3 flex flex-col gap-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Languages:</span>{" "}
                  {therapist.languages?.join(", ") || "Not provided"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Experience:</span>{" "}
                  {therapist.experience
                    ? `${therapist.experience} years`
                    : "Not provided"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Qualifications:</span>{" "}
                  {therapist.qualification.length > 0
                    ? therapist.qualification.join(", ")
                    : "Not provided"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 lg:mt-0">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Enquire Online
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Video Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
