import type React from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import specialization from "../../data/specialization.json";
import { PhoneInput } from "../ui/phone-input";
import { toast } from "@/hooks/use-toast";

// Define Zod schema for form validation
const therapistSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  contactDetails: z
    .string()
    .min(12, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 11 digits"),
});

type TherapistFormData = z.infer<typeof therapistSchema>;

interface RegisterTherapistFormProps {
  onSubmit: (
    data: TherapistFormData
  ) => Promise<Partial<TherapistFormData> | null>;
}

const RegisterTherapistForm: React.FC<RegisterTherapistFormProps> = ({
  onSubmit,
}) => {
  const form = useForm<TherapistFormData>({
    resolver: zodResolver(therapistSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      specialization: "",
      contactDetails: "",
    },
  });
  const handleSubmit = async (data: TherapistFormData) => {
    const errors = await onSubmit(data);
    if (errors) {
      if (errors.email) {
        form.setError("email", { type: "manual", message: errors.email });
      }
      if (errors.contactDetails) {
        form.setError("contactDetails", {
          type: "manual",
          message: errors.contactDetails,
        });
      }
      // Optionally, handle other errors or display a generic toast
      if (errors.name || errors.password || errors.specialization) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Please fix the errors in the form.",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Therapist's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Specialization</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specialization.specializations.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="therapist@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter a secure password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Contact phone number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Register Therapist
        </Button>
      </form>
    </Form>
  );
};

export default RegisterTherapistForm;
