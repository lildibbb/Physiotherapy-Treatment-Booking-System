import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  fetchTherapistDetailsByID,
  fetchTherapistAvailability,
  createAppointment,
  createCheckoutSession,
  fetchAppointments,
} from "../../lib/api";
import { Header } from "@/components/header";

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
import { AppointmentData } from "../staff/_staff.appointment";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
type Slot = {
  date: string;
  morning: string[];
  afternoon: string[];
};

export const Route = createFileRoute("/findDoctor/$therapistID")({
  component: RouteComponent,
});

const languages = ["English", "Malay"];
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
  const [data, setData] = React.useState<AppointmentData[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
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
        console.log("Therapist Data:", therapistData);
        console.log("Therapist Details ", therapistData.about);
        setTherapist(therapistData);

        if (therapistData.avatar) {
          const apiBaseUrl = import.meta.env.VITE_ENDPOINT_AVATAR_URL; // Update with your actual API base URL
          const avatarUrl = `${apiBaseUrl}/${therapistData.avatar}`;
          console.log("Avatar URL:", avatarUrl);

          setAvatar(avatarUrl);
        }
      } catch (error) {
        console.error("Error fetching therapist details:", error);
        setError("Failed to fetch therapist details");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const appointments = await fetchAppointments();
        console.log("Fetched Appointments:", appointments);
        setData(appointments);
      } catch (error) {
        setError("Failed to fetch appointments");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);
  // Fetch availability
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const availabilityData = await fetchTherapistAvailability(id);
        console.log("Availability Data:", availabilityData);
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
      const checkoutUrl = await createCheckoutSession(
        appointmentID,
        therapist.rate
      );
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
  const formattedRate = therapist?.rate
    ? `RM ${parseFloat(therapist.rate).toFixed(2)}`
    : "Rate not available";
  const selectedSlot = availability[selectedDateIndex];
  const consultationTypes = [`Online Consultation ,  ${formattedRate}`];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pt-20">
      <Header />
      <main className="container mx-auto px-4 py-6 pt-20">
        <div className="flex flex-col md:flex-row  gap-6">
          {/* Therapist Details Section */}
          <div className="flex-1 h-auto md:mr-4">
            <div className="space-y-6">
              <div className="border rounded-lg p-6 shadow-md">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
                    {/* Left Column - Profile Image */}
                    <div className="justify-self-center md:justify-self-start">
                      <div className="relative">
                        <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-border">
                          <img
                            src={
                              avatar ||
                              "https://static.vecteezy.com/system/resources/previews/009/749/645/non_2x/teacher-avatar-man-icon-cartoon-male-profile-mascot-illustration-head-face-business-user-logo-free-vector.jpg"
                            }
                            alt={therapist.name}
                            className="w-full h-full object-full"
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-background rounded-lg px-2 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-primary" />
                          <span className="text-sm font-medium">10</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-4">
                      {/* Header Section */}
                      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                        <div>
                          <div className="space-y-1">
                            <h2 className="text-2xl font-bold flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              {therapist.name}
                              <span className="text-base font-semibold text-blue-600 font-normal">
                                • Physiotherapist
                              </span>
                            </h2>
                            <p className="text-muted-foreground text-sm">
                              {therapist.specialization}
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xl font-bold text-primary">
                            RM {therapist.rate}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per session
                          </div>
                        </div>
                      </div>

                      {/* Rating Section */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                          <span className="text-sm font-medium">Rating</span>
                          <button className="text-sm text-muted-foreground hover:underline hover:text-blue-600">
                            (120 reviews)
                          </button>
                        </div>
                        <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs font-medium">
                          ✓ Verified Profile
                        </span>
                      </div>

                      {/* Info Grid */}
                      <div className="grid gap-3 text-sm">
                        {[
                          {
                            icon: <Clock className="w-4 h-4" />,
                            text: `${therapist.experience} Years Experience`,
                          },
                          {
                            icon: <MapPin className="w-4 h-4" />,
                            text: therapist.location,
                          },
                          {
                            icon: <Building2 className="w-4 h-4" />,
                            text: therapist.businessName,
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-muted-foreground"
                          >
                            {item.icon}
                            <span>{item.text}</span>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      {/* Availability and Tags */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs font-medium border rounded-md">
                            Next Available
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            Today
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {[
                            {
                              label: "Highly recommended",
                              class: "bg-yellow-100 text-yellow-800",
                            },
                            {
                              label: "Excellent wait time",
                              class: "bg-green-100 text-green-800",
                            },
                            {
                              label: "English",
                              class: "bg-gray-100 text-gray-800",
                            },
                            {
                              label: "Malay",
                              class: "bg-gray-100 text-gray-800",
                            },
                          ].map((badge, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 text-xs font-medium rounded-full ${badge.class}`}
                            >
                              {badge.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* About Section */}
              <div className="border border-gray-200 rounded-lg p-6 shadow-md bg-white">
                {/* Section Title with Icon */}
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    About Doctor
                  </h3>
                </div>

                {/* Doctor's Description */}
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {therapist.about || "No description available."}
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

                        // Create Date object from ISO string
                        const date = new Date(slot.date);

                        // Format date components in UTC
                        const formattedWeekday = date.toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            timeZone: "UTC",
                          }
                        );
                        const formattedMonthDay = date.toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            timeZone: "UTC",
                          }
                        );

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
                              {formattedWeekday}
                            </span>
                            <span className="text-sm">{formattedMonthDay}</span>
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
                            appointments={data} // Pass the fetched appointments here
                            selectedDate={selectedSlot.date} // Pass the selected date
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No slots available
                      </p>
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
      </main>
    </div>
  );
}
