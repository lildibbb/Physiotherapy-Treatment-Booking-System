// src/pages/dashboard/index.tsx

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "./DashboardLayout";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <CardContent>
            <CardTitle className="text-lg font-semibold">
              Today's Appointments
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
              You have 4 upcoming appointments today.
            </CardDescription>
            <Button variant="outline" className="mt-4 w-full">
              View All Appointments
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <CardContent>
            <CardTitle className="text-lg font-semibold">
              Notifications
            </CardTitle>
            <ul className="mt-2 space-y-2 text-gray-500 dark:text-gray-400">
              <li>
                <span className="font-medium">New update available</span> –
                Update your profile.
              </li>
              <li>
                <span className="font-medium">Reminder</span> – Your next
                appointment is at 3 PM.
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full">
              Manage Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <CardContent>
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
            <ul className="mt-2 space-y-2 text-gray-500 dark:text-gray-400">
              <li>Appointment booked with Dr. Smith.</li>
              <li>Profile updated.</li>
            </ul>
            <Button variant="outline" className="mt-4 w-full">
              View Full History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Reports */}
      <div className="mt-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <CardContent>
            <CardTitle className="text-lg font-semibold">
              Insights & Reports
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Explore your monthly activity, appointment summaries, and patient
              feedback.
            </CardDescription>
            <Button variant="default" className="mt-4">
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
