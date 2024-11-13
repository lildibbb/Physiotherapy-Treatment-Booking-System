// src/pages/doctorList.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Get hospitalId from the URL
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define doctor data type
interface DoctorData {
  id: number;
  name: string;
  specialty: string;
  experience: number; // years of experience
  image: string; // URL to doctor's image
}

export default function DoctorList() {
  const { hospitalId } = useParams<{ hospitalId: string }>(); // Get hospitalId from URL
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Replace with the actual API endpoint to fetch doctors by hospitalId
        const response = await fetch(`/api/hospitals/${hospitalId}/doctors`);
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [hospitalId]);

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Doctors at Hospital</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            <img
              src={doctor.image || "https://via.placeholder.com/150"} // Placeholder image if no URL
              alt={doctor.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <CardContent>
              <CardTitle className="text-xl font-semibold mt-2">
                {doctor.name}
              </CardTitle>
              <CardDescription className="text-gray-500">
                Specialty: {doctor.specialty}
              </CardDescription>
              <p className="mt-2 text-sm text-gray-700">
                {doctor.experience} years of experience
              </p>
              <Button variant="default" className="mt-4 w-full">
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
