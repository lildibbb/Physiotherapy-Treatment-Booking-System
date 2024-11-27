import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { fetchAppointments } from "@/lib/api";
import { AppointmentTable } from "@/components/appointmentTable";
import { Spinner } from "@/components/spinner";

export const Route = createFileRoute("/appointment")({
  component: RouteComponent,
});

function RouteComponent() {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadAppointments = async () => {
      try {
        const appointments = await fetchAppointments();
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

  return <AppointmentTable data={data} />;
}
