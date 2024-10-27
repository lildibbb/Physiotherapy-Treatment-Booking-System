import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import MapComponent from "../components/ui/MapComponent";
import LocationPermission from "../components/ui/LocationPermission";
import { HospitalData } from "../types/types";
import { fetchHospitals } from "../lib/api";

export default function Booking() {
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>({
    lat: 6.1218,
    lng: 100.3676,
  });
  const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const getHospitals = async () => {
      try {
        const data = await fetchHospitals();

        const transformedData = data.map((hospital: any) => ({
          ...hospital,
          coordinates: {
            lat: parseFloat(hospital.latitude),
            lng: parseFloat(hospital.longitude),
          },
          image: hospital.avatar,
        }));

        console.log("Transformed Hospitals:", transformedData);
        setHospitals(transformedData);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
    getHospitals();
  }, []);

  const handleLocationFound = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
    setLocationError(null); // Clear any existing location errors
  };

  const handleLocationError = (error: string) => {
    setLocationError(error);
    console.error("Location error:", error);
  };

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />

        <div className="flex-1 p-6">
          <SidebarTrigger className="mb-4" />

          <header className="mb-6">
            <h1 className="text-3xl font-bold">Book an Appointment</h1>
            <p className="text-lg text-gray-500">
              Find a hospital near you and schedule an appointment.
            </p>
          </header>

          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Search</Button>
          </div>

          <LocationPermission
            onLocationFound={handleLocationFound}
            onError={handleLocationError}
          />

          {locationError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6 h-80">
            {userLocation && (
              <MapComponent
                userLocation={userLocation}
                hospitals={filteredHospitals}
                isInteractionDisabled={isInteractionDisabled}
                onOpenChange={setIsInteractionDisabled}
              />
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredHospitals.map((hospital) => (
              <Card
                key={hospital.id || `${hospital.name}-${Math.random()}`}
                className="hover:shadow-lg transition-shadow duration-200 ease-in-out"
              >
                <img
                  src={
                    hospital.image ||
                    "https://upload.wikimedia.org/wikipedia/commons/c/cd/Jitra_Mall.jpg"
                  }
                  alt={hospital.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/path-to-default-image.jpg";
                  }}
                />
                <CardContent>
                  <CardTitle className="text-xl font-semibold mt-2">
                    {hospital.name}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    {hospital.location}
                  </CardDescription>
                  <p className="mt-2 text-sm text-gray-700">
                    {hospital.distance} km away
                  </p>
                  <Button variant="default" className="mt-4 w-full">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
