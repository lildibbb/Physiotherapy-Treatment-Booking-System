import { MainNav } from "@/components/dashboard/patient/main-nav";
import { Stats } from "@/components/dashboard/patient/stats";
import { UserNav } from "@/components/dashboard/patient/user-nav";
import PatientCard from "@/components/dashboard/therapist/patientCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";

import { Search, Filter, Bell } from "lucide-react";

export const Route = createFileRoute("/staff/_staff/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
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
            <p className="text-secondary-600">Welcome back, Dr. Smith</p>
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

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <Stats />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-transparent ">
            <CardHeader>
              <CardTitle>Recent Patient</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <PatientCard
                patientName="John Doe"
                patientId="12345"
                appointmentTime="10:00 AM"
                patientStatus="Active"
                patientImage="https://cdn.vectorstock.com/i/1000v/07/33/tiny-cute-cartoon-patient-man-character-broken-vector-25530733.jpg"
              />
              <PatientCard
                patientName="John Doe"
                patientId="12345"
                appointmentTime="10:00 AM"
                patientStatus="Active"
                patientImage="https://cdn.vectorstock.com/i/1000v/07/33/tiny-cute-cartoon-patient-man-character-broken-vector-25530733.jpg"
              />
            </CardContent>
          </Card>
          <Card className="col-span-3 border-transparent">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>{/* <RecentSales /> */}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
