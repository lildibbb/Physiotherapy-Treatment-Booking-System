// src/types/forms.ts
import * as z from "zod";

export const appointmentFormSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
