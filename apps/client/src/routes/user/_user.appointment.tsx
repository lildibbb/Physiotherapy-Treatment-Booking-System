import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { fetchAppointments } from "@/lib/api";
import { AppointmentTable } from "@/components/appointmentTable";
import { Spinner } from "@/components/spinner";
import { Bell, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/dashboard/patient/user-nav";
import { MainNav } from "@/components/dashboard/patient/main-nav";
interface AppointmentData {
  appointmentDate: string;
  time: string;

  patientName: string;
  therapistName: string;
  status: string;
}
export const Route = createFileRoute("/user/_user/appointment")({
  component: RouteComponent,
});

function RouteComponent() {
  const [data, setData] = React.useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadAppointments = async () => {
      try {
        const appointments = await fetchAppointments();
        console.log(appointments);
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
    return <Spinner />; // Replace with your spinner component
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className=" flex-1 flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-secondary-600">
              {" "}
              Welcome back, {data.length > 0 ? data[0].patientName : "Guest"}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search patients..."
                className="w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-secondary-600">
              <Filter className="w-5 h-5" />
            </button>

            <button className="relative p-2 hover:bg-gray-100 rounded-lg text-secondary-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* <CalendarDateRangePicker /> */}
          </div>
        </div>
        <div className="grid gap-4 ">
          <AppointmentTable data={data} />
        </div>
      </div>
    </div>
  );
}
