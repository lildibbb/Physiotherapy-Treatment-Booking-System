// routes/_user.notification.tsx
import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Calendar } from "lucide-react";
import { MainNav } from "@/components/dashboard/patient/main-nav";
import { UserNav } from "@/components/dashboard/patient/user-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import NotificationSetup from "@/components/notification";

export const Route = createFileRoute("/user/_user/notification")({
  component: RouteComponent,
});

function RouteComponent() {
  const [appointmentNotifications, setAppointmentNotifications] =
    React.useState(false);

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <MainNav />
          <UserNav />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6" />
              <div>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Push Notifications Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                <NotificationSetup />
              </div>

              <Separator />

              {/* Notification Categories Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Notification Categories
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <Label htmlFor="appointment-notifications">
                          Appointment Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about upcoming appointments and
                          reminders
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="appointment-notifications"
                      checked={appointmentNotifications}
                      onCheckedChange={setAppointmentNotifications}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Note: Push notifications require browser permissions. Make
                    sure to allow notifications when prompted to receive updates
                    about your appointments.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
