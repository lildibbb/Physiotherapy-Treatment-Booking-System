import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { registerBusinessUser } from "@/lib/api";
import { useState } from "react";

import rawStateCities from "../data/states-cities.json";
import rawStates from "../data/states.json";
import { PhoneInput } from "@/components/ui/phone-input";

import { Input } from "@/components/ui/input";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandItem,
  CommandInput,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { sendBusinessAccountCreatedEmail } from "@/emails/accountBusinessCreatedEmail";

// Typecast JSON data
const stateCities: { [key: string]: string[] } = rawStateCities as {
  [key: string]: string[];
};
const states: string[] = rawStates as string[];

// Define Zod schema for form validation
const formSchema = z.object({
  personInChargeName: z.string().min(1, "Person In Charge Name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z
    .string()
    .min(12, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 11 digits"),
  companyName: z.string().min(1, "Company Name is required"),
  businessRegistrationNumber: z
    .string()
    .min(1, "Business Registration Number is required"),
  contractSigneeName: z.string().min(1, "Contract Signee Name is required"),
  contractSigneeNRIC: z
    .string()
    .regex(
      /^((([02468][048]|[13579][26])(02)(29))|((\d{2})((0[1-9]|1[0-2])(0[1-9]|1\d|2[0-8])|(0[1|3-9]|1[0-2])(29|30)|(0[13578]|1[02])(31))))\-(\d{2})\-(\d{4})$/,
      "Invalid NRIC format. Expected format: XXXXXX-XX-XXXX"
    ),
  businessAddress: z.string().min(1, "Business Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal Code is required"),
});

// Extract the type from the schema
type FormData = z.infer<typeof formSchema>;
export const Route = createFileRoute("/signup/business")({
  component: RouteComponent,
});

function RouteComponent() {
  const { toast } = useToast();
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personInChargeName: "",
      contactEmail: "",
      contactPhone: "",
      companyName: "",
      businessRegistrationNumber: "",
      contractSigneeName: "",
      contractSigneeNRIC: "",
      businessAddress: "",
      state: "",
      city: "",
      postalCode: "",
    },
  });

  const handleStateChange = (selectedState: string) => {
    setAvailableCities(stateCities[selectedState] || []);
    // Reset city when state changes
    form.setValue("city", "");
  };

  const onSubmit = async (data: FormData) => {
    try {
      await registerBusinessUser(
        data.personInChargeName,
        data.contactEmail,
        data.contactPhone,
        data.companyName,
        data.businessRegistrationNumber,
        data.contractSigneeName,
        data.contractSigneeNRIC,
        data.businessAddress,
        data.state,
        data.city,
        data.postalCode
      );
      await sendBusinessAccountCreatedEmail({
        businessName: data.companyName,
        email: data.contactEmail,
        tempPassword: "business123",
        to: data.contactEmail,
        loginUrl: `${import.meta.env.VITE_APP_URL}/login`,
      });
      // toast({
      //   variant: "default",
      //   title: "Registration Successful",
      //   description: "Your business account has been created.",
      // });
      // Navigate to the success page
      navigate({ to: "/signup/success" });
    } catch (error) {
      console.error("Registration error:", error);

      // Show a specific toast for each error
      if (typeof error === "object" && error !== null && "email" in error) {
        form.setError("contactEmail", {
          type: "manual",
          message: (error as { email: string }).email,
        });
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: (error as { email: string }).email,
        });
      }
      if (
        typeof error === "object" &&
        error !== null &&
        "contactDetails" in error
      ) {
        form.setError("contactPhone", {
          type: "manual",
          message: (error as { contactDetails: string }).contactDetails,
        });
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: (error as { contactDetails: string }).contactDetails,
        });
      }

      // Generic toast for other errors
      if (
        typeof error !== "object" ||
        error === null ||
        (!("email" in error) && !("contactDetails" in error))
      ) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "An unknown error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <Header />
      <div className="flex items-center justify-center pt-15">
        <Card className="w-full max-w-2xl p-6">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold tracking-tight text-center">
              Business Sign Up
            </CardTitle>
            <CardDescription className="text-center">
              Register your business to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="personInChargeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Person In Charge Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Person in charge" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Contact email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                </div>

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="businessRegistrationNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Business Registration Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="E.g. 201401000009"
                            {...field}
                            onInput={(e) => e.preventDefault()} // Prevent non-numeric characters
                            onKeyDown={(e) => {
                              // Allow only numeric characters and backspace
                              if (
                                !/[0-9]/.test(e.key) &&
                                e.key !== "Backspace"
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contractSigneeNRIC"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Contract Signee NRIC</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="XXXXXX-XX-XXXX"
                            {...field}
                            onInput={(e) => e.preventDefault()} // Prevent invalid characters
                            onKeyDown={(e) => {
                              // Allow numeric characters, hyphen (-), and backspace
                              if (
                                !/[0-9-]/.test(e.key) &&
                                e.key !== "Backspace"
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contractSigneeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Signee Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="As shown on your business documents"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Business Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4">
                  {/* State Field */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>State</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {field.value || "Select State"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search state..." />
                              <CommandList>
                                {states.map((state) => (
                                  <CommandItem
                                    key={state}
                                    onSelect={() => {
                                      field.onChange(state);
                                      handleStateChange(state);
                                    }}
                                  >
                                    {state}
                                    <Check
                                      className={`ml-auto ${
                                        field.value === state
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* City Field */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>City</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {field.value || "Select City"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search city..." />
                              <CommandList>
                                {availableCities.length > 0 ? (
                                  availableCities.map((city) => (
                                    <CommandItem
                                      key={city}
                                      onSelect={() => field.onChange(city)}
                                    >
                                      {city}
                                      <Check
                                        className={`ml-auto ${
                                          field.value === city
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }`}
                                      />
                                    </CommandItem>
                                  ))
                                ) : (
                                  <CommandEmpty>
                                    No cities available
                                  </CommandEmpty>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Register Business
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col items-center">
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
