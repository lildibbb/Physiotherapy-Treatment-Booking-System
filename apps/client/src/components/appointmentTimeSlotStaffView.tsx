// appointmentTimeSlot.tsx
import React from "react";
import { Link } from "@tanstack/react-router";

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

const AppointmentTimeSlot: React.FC<AppointmentTimeSlotProps> = ({
  time,
  appointment,
}) => {
  const formattedTime = time.padStart(2, "0") + ":00";
  const hourNumber = parseInt(time, 10);
  const isAM = hourNumber < 12;
  const displayTime = `${formattedTime} ${isAM ? "AM" : "PM"}`;

  return (
    <div className="min-h-[80px] relative group p-4 sm:p-6 border-b last:border-b-0">
      {/* Time Label */}
      <div className="absolute left-4 top-2 text-sm text-secondary-500 sm:left-6 sm:top-3">
        {displayTime}
      </div>

      {/* Appointment Details */}
      {appointment ? (
        <div className="ml-16 sm:ml-20 mt-1 p-3 bg-blue-100 rounded-lg border border-blue-200">
          <Link
            to="/staff/appointment/$appointmentID"
            params={{ appointmentID: appointment.appointmentID.toString() }}
            className="block"
          >
            <div className="font-medium text-sm sm:text-base">
              Appointment with {appointment.therapistName}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Patient: {appointment.patientName}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Status: {appointment.status}
            </div>
          </Link>
        </div>
      ) : (
        /* Hoverable Button for Available Slots */
        <button
          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-gray-50/50 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label={`Available slot at ${displayTime}`}
        />
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
  // Convert appointment times to hour numbers for comparison
  const getHourFromTime = (timeString: string): number => {
    const [hours] = timeString.split(":");
    return parseInt(hours, 10);
  };

  // Find appointment for a specific hour
  const findAppointmentForHour = (hour: number): Appointment | undefined => {
    return appointments.find((apt) => getHourFromTime(apt.time) === hour);
  };

  // Generate hours from 8 AM to 4 PM (8 to 16)
  const timeSlots = Array.from({ length: 9 }, (_, i) => i + 9);

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-1 divide-y divide-gray-200">
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
