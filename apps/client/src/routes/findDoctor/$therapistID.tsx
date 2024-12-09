import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  fetchTherapistDetailsByID,
  fetchTherapistAvailability,
  createAppointment,
  createCheckoutSession,
} from "../../lib/api";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AppointmentPayload } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import TimeSlotSection from "@/components/timeSlotSelection";
import { Form } from "@/components/ui/form";
import {
  AppointmentFormData,
  appointmentFormSchema,
} from "@/components/forms/formSchema";
type Slot = {
  date: string;
  morning: string[];
  afternoon: string[];
};

export const Route = createFileRoute("/findDoctor/$therapistID")({
  component: RouteComponent,
});

function RouteComponent() {
  const [therapist, setTherapist] = React.useState<any>(null);
  const [availability, setAvailability] = React.useState<Slot[]>([]);
  const { therapistID } = Route.useParams();
  const [, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedConsultationType, setSelectedConsultationType] = useState<
    string | null
  >(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { toast } = useToast();
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      date: availability[0]?.date || "",
      time: "",
    },
  });

  // Input validation
  if (!therapistID) {
    console.error("therapistID is missing in params");
    return <p>Error: Therapist ID is required.</p>;
  }

  const id = Number(therapistID);
  if (isNaN(id)) {
    console.error("Invalid therapistID:", therapistID);
    return <p>Error: Invalid Therapist ID.</p>;
  }

  // Fetch therapist details
  useEffect(() => {
    async function fetchDetails() {
      try {
        const therapistData = await fetchTherapistDetailsByID(id);
        setTherapist(therapistData);
      } catch (error) {
        console.error("Error fetching therapist details:", error);
        setError("Failed to fetch therapist details");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  // Fetch availability
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const availabilityData = await fetchTherapistAvailability(id);
        setAvailability(availabilityData);
        if (availabilityData.length > 0) {
          form.setValue("date", availabilityData[0].date);
        }
      } catch (error: any) {
        console.error("Error fetching availability slots:", error);
        setError(error.message || "Failed to fetch availability");
      }
    }
    fetchAvailability();
  }, [id, form]);

  const handleDateNavigation = (direction: "prev" | "next") => {
    setSelectedDateIndex((current) =>
      direction === "prev"
        ? Math.max(0, current - 1)
        : Math.min(availability.length - 1, current + 1)
    );
  };

  const handleDateSelect = (index: number) => {
    setSelectedDateIndex(index);
    form.setValue("date", availability[index].date);
    form.setValue("time", ""); // Reset time when date changes
  };

  const onSubmit = async (values: AppointmentFormData) => {
    console.log("Using Therapist ID:", id);

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!selectedConsultationType) {
        throw new Error("Please select a consultation type");
      }

      const appointmentPayload: AppointmentPayload = {
        therapistID: id,
        appointmentDate: values.date,
        time: values.time,
        type: selectedConsultationType,
      };
      console.log("Payload:", appointmentPayload);
      const appointment = await createAppointment(appointmentPayload);
      const { appointmentID } = appointment;
      console.log("Appointment created with ID:", appointmentID);
      // On successful booking, attempt to create a checkout session
      const checkoutUrl = await createCheckoutSession(appointmentID);
      console.log("Redirecting to checkout:", checkoutUrl);

      // Redirect to the Stripe checkout URL
      window.location.href = checkoutUrl;
      // You might want to show a success message or redirect
      // For example:
      toast({
        variant: "default",
        title: "Success",
        description: "You have successfully booked an appointment!",
      });
      form.reset();

      // Or use a toast notification if you have one set up
    } catch (error: any) {
      console.error("Failed to create appointment:", error);
      setSubmitError(error.message || "Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !therapist) {
    return <p className="text-center text-lg">Loading therapist details...</p>;
  }

  const visibleDates = availability.slice(
    Math.max(0, selectedDateIndex - 2),
    Math.min(availability.length, selectedDateIndex + 3)
  );

  const selectedSlot = availability[selectedDateIndex];
  const consultationTypes = ["Online Consultation", "In-Person Consultation"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pt-20">
      <Header />

      {/* Search Section */}
      <div className="mb-6 ">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="search"
            placeholder="Location"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            type="text"
            placeholder="Search for therapists..."
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row  gap-6">
        {/* Therapist Details Section */}
        <div className="flex-1 h-auto md:mr-4">
          <div className="space-y-6">
            <div className="border rounded-lg p-6 shadow-sm">
              <CardHeader>
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 mx-auto md:mx-0">
                  <img
                    src={
                      therapist.image ||
                      "https://static.vecteezy.com/system/resources/previews/009/749/645/non_2x/teacher-avatar-man-icon-cartoon-male-profile-mascot-illustration-head-face-business-user-logo-free-vector.jpg"
                    }
                    alt={therapist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <h2 className="text-2xl sm:text-3xl font-bold">
                {therapist.name}
              </h2>
              <p className="text-gray-600">{therapist.specialization}</p>
              <p className="text-sm text-gray-500">
                {therapist.experience} Years Experience
              </p>
              <p className="text-sm text-gray-500">{therapist.location}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  Highly recommended
                </span>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Excellent wait time
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold">Practices</h3>
              <p className="text-blue-600">{therapist.businessName}</p>
            </div>

            {/* About Section */}
            <div className="border rounded-lg p-6 shadow-sm ">
              <h3 className="mt-6 text-lg font-semibold">About Doctor</h3>
              <p className="text-gray-600">
                {therapist.description || "No description available"}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          {/* Consultation Type */}
          <div className="border rounded-lg p-6 shadow-sm ">
            <h3 className="text-lg font-semibold">
              Step 1: Choose Consultation Type
            </h3>
            <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              {consultationTypes.map((type) => (
                <Button
                  key={type}
                  className="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                  variant={
                    selectedConsultationType === type ? "default" : "outline"
                  }
                  onClick={() => setSelectedConsultationType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Availability Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Step 2: Choose Date & Time
                  </CardTitle>
                </CardHeader>

                {/* Date Navigation */}
                <div className="flex items-center justify-between mt-4 space-x-2">
                  {/* Previous Button */}
                  <Button
                    type="button"
                    onClick={() => handleDateNavigation("prev")}
                    variant="outline"
                    size="sm"
                    disabled={selectedDateIndex === 0}
                    className="px-2 py-1 text-sm flex-shrink-0"
                  >
                    &lt; Prev
                  </Button>

                  {/* Date Container */}
                  <div className="flex space-x-2 overflow-x-auto flex-grow">
                    {visibleDates.map((slot: Slot) => {
                      const actualIndex = availability.findIndex(
                        (s) => s.date === slot.date
                      );
                      const date = new Date(slot.date);

                      return (
                        <Button
                          key={slot.date}
                          type="button"
                          onClick={() => handleDateSelect(actualIndex)}
                          variant={
                            actualIndex === selectedDateIndex
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className={`flex flex-col items-center ${
                            actualIndex === selectedDateIndex
                              ? "bg-pink-600 text-white"
                              : ""
                          } px-3 py-2 rounded-md min-w-[60px] sm:min-w-[80px]`}
                        >
                          <span className="text-xs font-medium">
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </span>
                          <span className="text-sm">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <Button
                    type="button"
                    onClick={() => handleDateNavigation("next")}
                    variant="outline"
                    size="sm"
                    disabled={selectedDateIndex === availability.length - 1}
                    className="px-2 py-1 text-sm flex-shrink-0"
                  >
                    Next &gt;
                  </Button>
                </div>

                {/* Time Slots */}
                <CardContent className="mt-6">
                  {selectedSlot ? (
                    <div className="space-y-4">
                      {(["morning", "afternoon"] as const).map((period) => (
                        <TimeSlotSection
                          key={period}
                          period={period}
                          slots={selectedSlot[period]}
                          form={form}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No slots available</p>
                  )}
                </CardContent>
                <div className="mt-4 space-y-2">
                  {submitError && (
                    <p className="text-sm text-red-600">{submitError}</p>
                  )}
                  <div className="flex justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          disabled={
                            !form.watch("date") ||
                            !form.watch("time") ||
                            !selectedConsultationType ||
                            isSubmitting
                          }
                        >
                          {isSubmitting ? "Booking..." : "Book Appointment"}
                        </Button>
                      </AlertDialogTrigger>
                      {/* AlertDialog for confirmation */}

                      <AlertDialogContent className="sm:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to book this appointment?
                            <br />
                            {selectedConsultationType} on {form.watch("date")}{" "}
                            at {form.watch("time")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={form.handleSubmit(onSubmit)}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
