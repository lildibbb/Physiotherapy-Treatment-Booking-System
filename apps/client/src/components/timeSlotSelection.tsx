import { Sun, Sunrise } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

import { AppointmentFormData } from "./forms/formSchema";

// Define allowed period values
type PeriodType = "morning" | "afternoon";

// Define props interface
interface TimeSlotSectionProps {
  period: PeriodType;
  slots: string[];
  form: UseFormReturn<AppointmentFormData>;
}

const TimeSlotSection = ({ period, slots, form }: TimeSlotSectionProps) => {
  const iconProps = { className: "mr-2", size: 16 };

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

  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-medium text-gray-600 mb-2 flex items-center gap-2">
            {getPeriodIcon(period)}
            {period.charAt(0).toUpperCase() + period.slice(1)} Slots
          </FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2">
              {slots?.length > 0 ? (
                slots.map((time: string) => (
                  <Button
                    key={time}
                    type="button"
                    onClick={() => field.onChange(time)}
                    variant={field.value === time ? "default" : "outline"}
                    size="sm"
                    className="rounded-md"
                  >
                    {time}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No slots available</p>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TimeSlotSection;
