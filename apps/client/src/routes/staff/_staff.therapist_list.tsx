import { createFileRoute } from "@tanstack/react-router";

import { MainNav } from "@/components/dashboard/patient/main-nav";
import { UserNav } from "@/components/dashboard/patient/user-nav";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { useEffect, useState } from "react";
import { getDataTherapistForStaff } from "@/lib/api";
import { columns } from "@/components/dashboard/staff/columns-therapist";
import { DataTable } from "@/components/dashboard/staff/data-table";

export const Route = createFileRoute("/staff/_staff/therapist_list")({
  component: RouteComponent,
});
interface Availability {
  availabilityID: number;
  therapistID: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: number; // 1 for available, 0 for not available
  specialDate?: string | null;
}
interface TherapistData {
  therapistID: number;
  name: string;
  contactDetails: string;
  availability: Availability[];
}
function RouteComponent() {
  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [therapists, setTherapists] = useState<TherapistData[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const getTherapistData = async () => {
      try {
        const data = await getDataTherapistForStaff();
        console.log("Data fetched {TherapistData}:  ", data);
        if (data.TherapistData) {
          setTherapists(data.TherapistData);
        } else {
          setError("TherapistData key not found in fetched data.");
          console.error("TherapistData key not found in fetched data.");
        }
      } catch (err) {
        console.error("Failed to fetch therapist data", err);
        setError("Failed to fetch therapist data.");
      } finally {
        setIsLoading(false);
      }
    };
    getTherapistData();
  }, []);
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <MainNav />
          <UserNav />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Physiotherapist</h2>
            <p className="text-secondary-600 mt-1 sm:mt-2">
              Your associated physiotherapist
            </p>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <DataTable columns={columns} data={therapists} />
        )}
      </main>
    </div>
  );
}
