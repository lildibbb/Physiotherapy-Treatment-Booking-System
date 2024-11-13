import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { fetchUserAppointments } from "../lib/api"; // Import a utility function for fetching appointments
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming an Input component for search/filter

interface AppointmentData {
  appointmentID: number;
  appointmentDate: string;
  time: string;
  status: string;
  patientName: string;
  therapistName: string;
  staffName: string;
}

export default function Appointment() {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetchUserAppointments(token); // Use the helper to fetch appointments
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          console.error("Failed to fetch appointments:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content area */}
        <div className="flex-1 p-6">
          <SidebarTrigger className="mb-4" />

          {/* Header */}
          <header className="mb-6">
            <h1 className="text-3xl font-bold">Appointment</h1>
            <p className="text-lg text-gray-500">
              Here’s a list of your appointments for this month!
            </p>
          </header>

          {/* Filters */}
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Filter tasks..."
              className="flex-1"
              // Add your onChange handler here for filtering logic
            />
            <Button variant="outline">+ Status</Button>
            <Button variant="outline">+ Priority</Button>
          </div>

          {/* Appointments Table */}
          <Card className="shadow-md rounded-lg">
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : appointments.length > 0 ? (
                <Table className="min-w-full rounded-md">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4 py-3 text-left">ID</TableHead>
                      <TableHead className="px-4 py-3 text-left">
                        Title
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left">
                        Time
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left">
                        Status
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left">
                        Patient Name
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left">
                        Therapist Name
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left">
                        Staff Name
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.appointmentID}>
                        <TableCell className="px-4 py-3 border-b">
                          {appointment.appointmentID}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-b">
                          {appointment.appointmentDate}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-b">
                          {appointment.time}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-b">
                          {appointment.status}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-b">
                          {appointment.patientName}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-b">
                          {appointment.therapistName}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-b">
                          {appointment.staffName}
                        </TableCell>
                        <TableCell className="px-4 py-3 border-b">
                          <Button>ss </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No appointments found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
