import type React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";
import { DatePicker } from "../ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

const treatmentPlanSchema = z.object({
  goals: z.string().min(1, "Please enter your treatment goals."),
  startDate: z.date().refine((date) => date >= new Date(), {
    message: "Start date cannot be in the past.",
  }),
  duration: z.number().min(1, "Duration must be at least 1 day."),
  frequency: z.number().min(1, "Frequency must be at least 1 session."),
});

type TreatmentPlanData = z.infer<typeof treatmentPlanSchema>;

interface TreatmentPlanFormProps {
  onSubmit: (
    data: TreatmentPlanData
  ) => Promise<Partial<TreatmentPlanData> | null>;
}

const TreatmentPlanForm: React.FC<TreatmentPlanFormProps> = ({ onSubmit }) => {
  const form = useForm<TreatmentPlanData>({
    resolver: zodResolver(treatmentPlanSchema),
    defaultValues: {
      goals: "",
      startDate: undefined,
      duration: 0,
      frequency: 0,
    },
  });

  const handleSubmit = async (data: TreatmentPlanData) => {
    try {
      const response = await onSubmit(data);

      //   // Handle a validation error from the server
      //   if (!response) {
      //     form.setError("goals", {
      //       type: "server",
      //       message: "Goals are invalid or incomplete.",
      //     });
      //     form.setError("frequency", {
      //       type: "server",
      //       message: "Frequency cannot exceed 10 sessions per week.",
      //     });
      //     return;
      //   }

      toast({
        title: "Treatment Plan Created",
        description: "Your treatment plan has been created successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error Creating Treatment Plan",
        description: "An error occurred while creating your treatment plan.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Treatment Goals */}
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goals</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Improve mobility, reduce pain"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal rounded-md",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Select a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (weeks)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="e.g., 30"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Frequency */}
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency (sessions per week)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="e.g., 3"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full rounded-lg">
          Create Treatment Plan
        </Button>
      </form>
    </Form>
  );
};

export default TreatmentPlanForm;
