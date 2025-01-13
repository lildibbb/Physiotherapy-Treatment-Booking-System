// _user.appointment.tsx
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { fetchAppointments } from "@/lib/api";
import { Spinner } from "@/components/spinner";

import { Calendar } from "@/components/ui/calendar";

import { MainNav } from "@/components/dashboard/therapist/main-nav";
import { UserNav } from "@/components/dashboard/therapist/user-nav";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { DatePicker } from "@/components/ui/date-picker";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns-appointment";
import AppointmentSlots from "@/components/appointmentTimeSlot";

interface AppointmentData {
  appointmentID: string;
  appointmentDate: string;
  time: string;
  patientName: string;
  therapistName: string;
  status: string;
  avatar?: string | null;
}

export const Route = createFileRoute("/therapist/_therapist/appointment")({
  component: RouteComponent,
});

function RouteComponent() {
  const [data, setData] = React.useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  // Use the custom useMediaQuery hook to determine screen size
  const isSmallScreen = useMediaQuery("(max-width: 767px)"); // Tailwind's md breakpoint is 768px

  React.useEffect(() => {
    const loadAppointments = async () => {
      try {
        const appointments = await fetchAppointments();
        console.log("Fetched Appointments:", appointments);
        setData(appointments);
      } catch (error) {
        setError("Failed to fetch appointments");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  // Filter appointments based on selected date
  const formattedSelectedDate = selectedDate.toLocaleDateString("en-CA");
  const filteredAppointments = Array.isArray(data)
    ? data.filter((apt) => apt.appointmentDate === formattedSelectedDate)
    : [];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      {isSmallScreen ? (
        <header className="border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <MainNav />
            <UserNav />
          </div>
        </header>
      ) : null}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Appointments</h2>
            <p className="text-secondary-600 mt-1 sm:mt-2">
              Your appointments with your patient
            </p>
          </div>
        </div>

        {/* Appointments Section */}
        <div className=" rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Calendar for Large Screens */}
            {!isSmallScreen && (
              <div className="w-full md:w-64 border-r border-gray-200">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) setSelectedDate(date);
                  }}
                  className="w-full h-full"
                />
              </div>
            )}

            {/* DatePicker for Small Screens */}
            {isSmallScreen && (
              <div className="mb-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => {
                    if (date) setSelectedDate(date);
                  }}
                  className="w-full"
                />
              </div>
            )}

            {/* Appointment Slots */}
            <div className="flex-1">
              <AppointmentSlots appointments={filteredAppointments} />
              {/* Uncomment the line below if you wish to display a data table */}
              {/* <DataTable columns={columns} data={data} /> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
