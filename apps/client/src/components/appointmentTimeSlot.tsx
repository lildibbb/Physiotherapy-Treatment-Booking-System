import { Calendar, Clock, User } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Appointment {
  appointmentID: string;
  appointmentDate: string;
  time: string;
  patientName: string;
  therapistName: string;
  status: string;
}

interface AppointmentTimeSlotProps {
  time: string;
  appointment?: Appointment;
}

const statusVariantMap: Record<
  string,
  | "ongoing"
  | "pending"
  | "Waiting for approval of refund"
  | "cancelled"
  | "default"
> = {
  Ongoing: "ongoing", // Variant for "Ongoing"
  Pending: "pending", // Variant for "Pending"
  Cancelled: "cancelled", // Variant for "Cancelled"
  "Waiting for approval of refund": "Waiting for approval of refund", // Variant for refund status
};

const AppointmentTimeSlot: React.FC<AppointmentTimeSlotProps> = ({
  time,
  appointment,
}) => {
  const formattedTime = time.padStart(2, "0") + ":00";
  const hourNumber = parseInt(time, 10);
  const isAM = hourNumber < 12;
  const displayTime = `${hourNumber > 12 ? hourNumber - 12 : hourNumber}:00 ${
    isAM ? "AM" : "PM"
  }`;

  return (
    <div className="group relative min-h-[100px] border-b last:border-b-0 p-4">
      <div className="absolute left-4 top-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{displayTime}</span>
      </div>

      {appointment ? (
        <Link
          to="/staff/appointment/$appointmentID"
          params={{ appointmentID: appointment.appointmentID.toString() }}
          className="block"
        >
          <Card className="ml-24 transition-shadow hover:shadow-md">
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    Appointment with {appointment.therapistName}
                  </span>
                </div>
                <Badge
                  variant={statusVariantMap[appointment.status] || "default"}
                >
                  {appointment.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{appointment.patientName}</span>
              </div>
            </div>
          </Card>
        </Link>
      ) : (
        <div className="ml-24 flex h-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <Link to="/findDoctor" className="w-full">
            <Button variant="outline" className="w-full">
              Book Appointment
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

interface AppointmentSlotsProps {
  appointments: Appointment[];
}

const AppointmentSlots: React.FC<AppointmentSlotsProps> = ({
  appointments,
}) => {
  const getHourFromTime = (timeString: string): number => {
    const [hours] = timeString.split(":");
    return parseInt(hours, 10);
  };

  const findAppointmentForHour = (hour: number): Appointment | undefined => {
    return appointments.find((apt) => getHourFromTime(apt.time) === hour);
  };

  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8);

  return (
    <div className="flex-1 overflow-auto rounded-lg border bg-background">
      <div className="divide-y divide-border">
        {timeSlots.map((hour) => (
          <AppointmentTimeSlot
            key={hour}
            time={hour.toString()}
            appointment={findAppointmentForHour(hour)}
          />
        ))}
      </div>
    </div>
  );
};

export default AppointmentSlots;
