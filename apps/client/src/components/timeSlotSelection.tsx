import React from "react";
import { Sun, Sunrise } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormData } from "./forms/formSchema";

// Define allowed period values
type PeriodType = "morning" | "afternoon";

interface Appointment {
  appointmentDate: string;
  time: string;
  status: string;
}

interface TimeSlotSectionProps {
  period: PeriodType;
  slots: string[];
  form: UseFormReturn<AppointmentFormData>;
  appointments: Appointment[];
  selectedDate: string;
}

const TimeSlotSelection: React.FC<TimeSlotSectionProps> = ({
  form,
  period,
  slots,
  appointments,
  selectedDate,
}) => {
  const iconProps = { className: "text-primary", size: 20 };

  const getPeriodIcon = (period: PeriodType) => {
    switch (period) {
      case "morning":
        return <Sun {...iconProps} />;
      case "afternoon":
        return <Sunrise {...iconProps} />;
      default:
        return null;
    }
  };

  // Filter out slots that match an appointment with status "ongoing" for the selected date
  const filteredSlots = slots.filter(
    (slot) =>
      !appointments.some(
        (appointment) =>
          appointment.appointmentDate === selectedDate &&
          appointment.time === slot &&
          appointment.status === "Ongoing"
      )
  );

  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem className="space-y-4 p-4 rounded-lg border bg-card">
          <FormLabel className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            {getPeriodIcon(period)}
            {period.charAt(0).toUpperCase() + period.slice(1)} Slots
          </FormLabel>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {filteredSlots.length > 0 ? (
              filteredSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  onClick={() => field.onChange(time)}
                  variant={field.value === time ? "default" : "outline"}
                  size="sm"
                  aria-label={`Select ${time} time slot`}
                  aria-selected={field.value === time}
                  className={`w-full transition-all duration-200 ${
                    field.value === time
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "hover:bg-primary/10"
                  }`}
                >
                  {time}
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground col-span-full">
                No slots available
              </p>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};

export default TimeSlotSelection;
