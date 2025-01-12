// src/routes/user/_user.appointment_.$appointmentID.tsx

import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

// ShadCN UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Custom Components
import { MainNav } from "@/components/dashboard/patient/main-nav";
import { UserNav } from "@/components/dashboard/patient/user-nav";
import { Spinner } from "@/components/spinner"; // Assuming you have a Spinner component
import { useEffect, useState } from "react";
import {
  cancelAppointment,
  checkSession,
  createExercise,
  createMeetingLink,
  createTreatmentPlan,
  fetchAppointmentByID,
  fetchExerciseByID,
  getTreatmentPlan,
} from "@/lib/api";
import { Pen, Video } from "lucide-react";
import TreatmentPlanForm from "@/components/forms/treatmentPlan";
import { ExercisePayload, TreatmentPayload } from "@/types/types";
import ExerciseForm from "@/components/forms/exerciseForm";
import { toast } from "@/hooks/use-toast";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { divIcon } from "leaflet";
import MeetingLinkForm from "@/components/forms/meetingLinkForm";
export const Route = createFileRoute(
  "/therapist/_therapist/appointment_/$appointmentID"
)({
  component: RouteComponent,
});
interface AppointmentData {
  appointmentID: string;
  patientID: string;
  therapistID: string;
  appointmentDate: string;
  time: string;
  patientName: string;
  therapistName: string;
  gender: string;
  status: string;
  contactDetails: string;
  avatar?: string | null;

  meetingLink?: string | null;
}
interface Exercise {
  exerciseID: number;
  name: string;
  description: string;
  videoURL: string;
  duration: number;
  planID: number;
}
function RouteComponent() {
  const { appointmentID } = Route.useParams();
  console.log("appointmentID from params: ", appointmentID);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState<any | null>(null);
  const [data, setData] = React.useState<AppointmentData>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isPlanExist, setIsPlanExist] = useState(false);
  const [exercise, setExercise] = useState<Exercise[] | null>(null);
  const [isExerciseExist, setIsExerciseExist] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isMeetingLinkExist, setIsMeetingLinkExist] = useState(false);
  const [MeetingLink, setMeetingLink] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  // Input validation
  if (!appointmentID) {
    console.error("therapistID is missing in params");
    return <p>Error: Therapist ID is required.</p>;
  }

  const id = Number(appointmentID);
  if (isNaN(id)) {
    console.error("Invalid therapistID:", appointmentID);
    return <p>Error: Invalid Therapist ID.</p>;
  }

  // Mock appointment data tailored for Physiotherapy
  const appointment = {
    appointmentDate: data?.appointmentDate,
    avatar: avatar,
    time: new Date(),
    patientName: data?.patientName,
    gender: data?.gender,
    status: data?.status,
    meetingLink: data?.meetingLink,
    contactDetails: data?.contactDetails,
    lastVisit: data?.appointmentDate
      ? new Date(data.appointmentDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A",

    treatmentPlan: {
      goals: treatmentPlan?.goals,
      exercises: [
        "Quadriceps strengthening",
        "Hamstring stretches",
        "Ankle pumps",
        "Balance exercises",
      ],
      physiotherapist: "Physiotherapist " + data?.therapistName,
      duration: treatmentPlan?.duration + " weeks",
      frequency: treatmentPlan?.frequency + " times a week",
    },

    pastAppointments: [
      {
        date: "Mar 18, 2024",
        time: "09:00 AM",
        type: "Initial Assessment",
        notes: "Patient shows signs of improvement in mobility.",
      },
      {
        date: "Feb 25, 2024",
        time: "10:00 AM",
        type: "Follow-up Session",
        notes: "Discussed progress and adjusted exercise regimen.",
      },
    ],
    currentExercises: [
      {
        name: "Quadriceps Strengthening",
        description: "3 sets of 15 repetitions",
        duration: "15 minutes",
        videoUrl: "https://www.youtube.com/embed/ebvdzEcpva0",
      },
      {
        name: "Hamstring Stretches",
        description: "Hold each stretch for 30 seconds",
        duration: "10 minutes",
        videoUrl: "https://www.youtube.com/embed/VIDEO_ID_2",
      },
    ],
    recentDocuments: [
      {
        title: "Treatment Plan March 2024",
        date: "Mar 18, 2024",
        category: "Treatment Plan",
      },
      {
        title: "Progress Report Feb 2024",
        date: "Feb 25, 2024",
        category: "Progress Report",
      },
    ],
    clinicalNotes: [
      {
        author: "Dr. Smith",
        date: "Mar 18, 2024",
        note: "Patient recovering well. Increased range of motion observed.",
      },
      {
        author: "Physiotherapist John",
        date: "Mar 18, 2024",
        note: "Started quadriceps strengthening exercises.",
      },
    ],
  };
  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const data = await checkSession();
        console.log("data {checkSession}", data);
        if (data.authContext.isAuthenticated == true) {
          // Adjust based on your API response structure
          setIsAuthenticated(true);
          setRole(data.authContext.role);
          console.log("User is authenticated");
        } else {
          setIsAuthenticated(false);
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.log("Error in checkSession:", error);
        setIsAuthenticated(false);
      }
    };

    const getTreatmentPlanData = async (id: number) => {
      try {
        const data = await getTreatmentPlan(id);
        console.log("Fetched treatment plan data:", data);
        setTreatmentPlan(data);
        setIsPlanExist(true);
      } catch (error) {
        console.error("Failed to fetch treatment plan data or Not Found");
      }
    };
    const loadAppointments = async (id: number) => {
      try {
        const appointments = await fetchAppointmentByID(id);
        console.log("Fetched Appointments:", appointments);
        setData(appointments);

        if (!appointments.meetingLink) {
          setIsMeetingLinkExist(false);
        } else {
          setIsMeetingLinkExist(true);
        }
        console.log("ismettingexits", isMeetingLinkExist);
        if (appointments.avatar) {
          const apiBaseUrl = import.meta.env.VITE_ENDPOINT_AVATAR_URL; // Update with your actual API base URL
          const avatarUrl = `${apiBaseUrl}/${appointments.avatar}`;
          console.log("Avatar URL:", avatarUrl);

          setAvatar(avatarUrl);
        }
      } catch (error) {
        setError("Failed to fetch appointments");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getAuthUser();
    getTreatmentPlanData(id);
    loadAppointments(id);
  }, []); // Empty dependency array ensures this runs once on mount
  useEffect(() => {
    if (treatmentPlan?.planID) {
      const loadExercise = async () => {
        try {
          const exercises = await fetchExerciseByID(treatmentPlan.planID);
          console.log("Fetched Exercises:", exercises);
          // Handle exercise data appropriately
          // Sanitize and convert video URLs to embed format
          const sanitizedExercises = exercises.map(
            (exercise: Exercise): Exercise => {
              if (exercise.videoURL) {
                // Extract the video ID and construct the embed URL
                const url = new URL(exercise.videoURL);
                const videoID = url.searchParams.get("v");
                exercise.videoURL = videoID
                  ? `https://www.youtube.com/embed/${videoID}`
                  : exercise.videoURL;
              }
              return exercise;
            }
          );

          console.log(
            "Updated Exercises with embedded video URLs:",
            sanitizedExercises
          );

          setExercise(sanitizedExercises);
          setIsExerciseExist(true);
        } catch (error) {
          console.error(error);
        }
      };

      loadExercise();
    }
  }, [treatmentPlan]);

  const patientID = Number(data?.patientID);
  const therapistID = Number(data?.therapistID);
  console.log("Patient ID:", patientID);
  console.log("therapist ID:", therapistID);

  const handleCreateTreatment = async (data: {
    goals: string;
    startDate: Date;
    duration: number;
    frequency: number;
  }) => {
    try {
      const payload: TreatmentPayload = {
        patientID: patientID,
        therapistID: therapistID,
        goals: data.goals,
        duration: data.duration,
        frequency: data.frequency,
        startDate: data.startDate.toISOString(),
      };
      console.log("payload:", payload, "appointmentID", id);
      const newTreatmentPlan = await createTreatmentPlan(id, payload);
      console.log("NewtreatmentPlan:", newTreatmentPlan);
      const newdata = await getTreatmentPlan(id);
      console.log("Fetched treatment plan data:", newdata);
      setTreatmentPlan(newdata);
      setIsPlanExist(true);
      return newTreatmentPlan;
    } catch (error) {
      console.error("Failed to create treatment plan", error);
      return null;
    }
  };
  const handleCreateExercise = async (data: {
    name: string;
    description: string;
    duration: number;
    videoURL?: string;
  }) => {
    try {
      const payload: ExercisePayload = {
        planID: treatmentPlan.planID,
        name: data.name,
        description: data.description,
        duration: data.duration,
        videoURL: data.videoURL,
      };
      console.log("payload:", payload);
      const newExercise = await createExercise(payload);
      console.log("New exercise:", newExercise);
      const exercises = await fetchExerciseByID(treatmentPlan.planID);
      console.log("Fetched Exercises from exercise added:", exercises);
      // Handle exercise data appropriately
      // Sanitize and convert video URLs to embed format
      const sanitizedExercises = exercises.map(
        (exercise: Exercise): Exercise => {
          if (exercise.videoURL) {
            // Extract the video ID and construct the embed URL
            const url = new URL(exercise.videoURL);
            const videoID = url.searchParams.get("v");
            exercise.videoURL = videoID
              ? `https://www.youtube.com/embed/${videoID}`
              : exercise.videoURL;
          }
          return exercise;
        }
      );

      console.log(
        "Updated Exercises with embedded video URLs:",
        sanitizedExercises
      );

      setExercise(sanitizedExercises);
      setIsExerciseExist(true);

      return newExercise;
    } catch (error) {
      console.error("Failed to create exercise", error);
      return null;
    }
  };
  const handleCreateMeetingLink = async (data: {
    meetingLink: string;
  }): Promise<Partial<{ meetingLink: string }> | null> => {
    try {
      console.log("payload:", data.meetingLink);
      const meetingLink = await createMeetingLink(data.meetingLink, id);
      console.log("Meeting Link:", meetingLink);
      setMeetingLink(meetingLink);
      console.log("Meeting Link:", MeetingLink);
      console.log("Meeting Link:", meetingLink);
      setIsMeetingLinkExist(true);
      toast({
        title: "Meeting Link Created",
        description: "Meeting link created successfully",
        variant: "default",
      });

      // const appointments = await fetchAppointmentByID(id);
      // console.log("Fetched Appointments:", appointments);
      // setData(appointments);

      // if (appointments.avatar) {
      //   const apiBaseUrl = import.meta.env.VITE_ENDPOINT_AVATAR_URL; // Update with your actual API base URL
      //   const avatarUrl = `${apiBaseUrl}/${appointments.avatar}`;
      //   console.log("Avatar URL:", avatarUrl);

      //   setAvatar(avatarUrl);
      // }

      // Return the created meeting link as required
      return { meetingLink: data.meetingLink };
    } catch (error) {
      console.error("Failed to create meeting link", error);
      toast({
        title: "Failed to create meeting link",
        description: "Unable to create meeting link at this moment",
        variant: "destructive",
      });

      // Return null in case of failure
      return null;
    }
  };
  const handleCancelAppointment = async () => {
    try {
      const payload = {
        appointmentID: id,
      };
      console.log("payload:", payload);
      const cancelData = await cancelAppointment(payload);
      console.log("Cancelled appointment:", cancelData);
      toast({
        title: "Appointment Cancellation",
        description: "Appointment cancelled successfully",
        variant: "default",
      });
      window.location.href = "/cancellation";
    } catch (error) {
      console.error("Failed to cancel appointment", error);
      toast({
        title: "Cancellation Failed",
        description: "Unable to cancel appointment at this moment",
        variant: "destructive",
      });
    } finally {
      setIsAlertOpen(false); // Close the dialog
    }
  };
  // State for tracking exercise progress
  const [exerciseProgress, setExerciseProgress] = React.useState<{
    [key: number]: boolean;
  }>(
    appointment.currentExercises.reduce(
      (acc, _, index) => {
        acc[index] = false;
        return acc;
      },
      {} as { [key: number]: boolean }
    )
  );

  // Handler for checkbox toggle
  const handleCheckboxChange = (index: number) => {
    setExerciseProgress((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));

    // TODO: Save the progress to your backend or state management
    console.log(`Exercise ${index} progress: ${!exerciseProgress[index]}`);
  };

  // Placeholder for loading and error states (to be implemented when fetching data)

  // If you implement fetching logic later, replace the mock data and handle loading/error states accordingly

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg">
          {error || "Appointment not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {isMobile ? (
        <header className="border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <MainNav />
            <UserNav />
          </div>
        </header>
      ) : null}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        {/* Container */}
        <div className="max-w-7xl mx-auto">
          {/* Top Navigation and Actions */}
          <div className="flex items-center justify-between mb-8">
            {/* Back Button and Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                aria-label="Go back"
                className="p-2 hover:bg-gray-100 rounded-lg text-secondary-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-left w-5 h-5"
                >
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                  Appointment Details
                </h1>
                <p className="text-secondary-600">
                  View and manage your patient's appointment information
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* {role === "staff" || role === "therapist" ? (
                <Button variant="secondary" className="px-4 py-2">
                  Edit Appointment
                </Button>
              ) : null} */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    aria-label="More options"
                    className="p-2 hover:bg-gray-100 rounded-lg text-secondary-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-more-vertical w-5 h-5"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsAlertOpen(true)}>
                    Cancel Appointment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this appointment?
                    <br />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelAppointment}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Combined Grid: Patient Profile, Treatment Plan, Past Appointments, Current Exercises, Recent Documents, Clinical Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Profile Card */}
            <Card className="lg:col-span-3 rounded-xl border  p-6 mb-8">
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={avatar || ""}
                    alt={appointment.patientName}
                  />
                  <AvatarFallback>{appointment.patientName}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-secondary-900">
                        {appointment.patientName}
                      </h2>
                      <p className="text-secondary-600">
                        {appointment.gender} •
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm border bg-amber-50 text-amber-700 border-amber-100">
                      {appointment.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-secondary-500">Last Visit</p>
                      <p className="font-medium text-secondary-900">
                        {appointment.lastVisit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-2 rounded-xl border p-4">
              {isPlanExist === true ? (
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-secondary-900">
                        Treatment Plan
                      </h3>
                    </div>

                    <p className="font-medium text-primary-600">
                      {appointment.lastVisit}
                    </p>
                  </div>

                  {/* Treatment Plan Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-secondary-900">Goals</h4>
                      <p className="text-secondary-600">
                        {appointment.treatmentPlan.goals}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900">
                        Exercises
                      </h4>
                      <ul className="list-disc list-inside text-secondary-600">
                        {exercise?.map((exerciseItem) => (
                          <li key={exerciseItem.exerciseID}>
                            <strong>{exerciseItem.name}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900">
                        Physiotherapist
                      </h4>
                      <p className="text-secondary-600">
                        {appointment.treatmentPlan.physiotherapist}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900">
                        Duration
                      </h4>
                      <p className="text-secondary-600">
                        {appointment.treatmentPlan.duration}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900">
                        Frequency
                      </h4>
                      <p className="text-secondary-600">
                        {appointment.treatmentPlan.frequency}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-secondary-900">
                        Treatment Plan
                      </h3>
                      <p className="text-sm text-secondary-600">
                        Waiting for the physiotherapist to create a personalized
                        treatment plan.
                      </p>
                    </div>
                    {role === "therapist" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0">
                            <Pen className="h-4 w-4 mr-2" /> Create Plan
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle></DialogTitle>
                            <DialogDescription>
                              Fill out the form below to add treatment.
                            </DialogDescription>
                          </DialogHeader>
                          <TreatmentPlanForm onSubmit={handleCreateTreatment} />
                        </DialogContent>
                      </Dialog>
                    ) : null}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center rounded-lg bg-secondary-100 p-6">
                      <div className="text-center">
                        <p className="text-primary-600 font-medium">
                          No treatment plan available at the moment.
                        </p>
                        <p className="text-secondary-600 text-sm mt-1">
                          Your physiotherapist will create a plan tailored to
                          your needs soon.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* Contact with therapist */}
            <Card className="rounded-xl border p-4">
              {isMeetingLinkExist === true ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-secondary-900">
                      Contact with your therapist
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-4">
                      <a
                        href={`${MeetingLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Join Google Meet
                      </a>
                      <a
                        href={`https://wa.me/${appointment.contactDetails}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-message-circle mr-2 h-4 w-4"
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-secondary-900">
                      Contact with your therapist
                    </h3>
                    {role === "therapist" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0">
                            <Pen className="h-4 w-4 mr-2" /> Add meeting link
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle></DialogTitle>
                            <DialogDescription>
                              Fill out the form below to add meeting link.
                            </DialogDescription>
                          </DialogHeader>
                          <MeetingLinkForm onSubmit={handleCreateMeetingLink} />
                        </DialogContent>
                      </Dialog>
                    ) : null}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center rounded-lg bg-secondary-100 p-6">
                      <div className="text-center">
                        <p className="text-primary-600 font-medium">
                          No meeting link available at the moment.
                        </p>
                        <p className="text-secondary-600 text-sm mt-1">
                          Your physiotherapist will provide a meeting link soon.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* Current Exercises */}
            <Card className="lg:col-span-3  rounded-xl border  p-4">
              {isExerciseExist === true ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-secondary-900">
                      Current Exercises
                    </h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="p-0">
                          <Pen className="h-4 w-4 mr-2" /> Create Plan
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle></DialogTitle>
                          <DialogDescription>
                            Fill out the form below to add exercise.
                          </DialogDescription>
                        </DialogHeader>
                        <ExerciseForm onSubmit={handleCreateExercise} />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-4">
                    {exercise?.map((exerciseItem, index) => (
                      <div
                        key={exerciseItem.exerciseID}
                        className="p-3 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-secondary-900">
                            {exerciseItem.name}
                          </h4>
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                            {exerciseItem.duration} mins
                          </span>
                        </div>
                        <p className="text-sm text-secondary-600 mt-1">
                          {exerciseItem.description}
                        </p>
                        {/* Checkbox for Progress Tracking */}
                        <div className="mt-2 flex items-center">
                          <Checkbox
                            id={`exercise-${index}`}
                            checked={exerciseProgress[index]}
                            onCheckedChange={() => handleCheckboxChange(index)}
                          />
                          <label
                            htmlFor={`exercise-${index}`}
                            className="ml-2 text-sm text-secondary-700"
                          >
                            Mark as Completed
                          </label>
                        </div>
                        {/* Watch Tutorial Button */}
                        {exerciseItem.videoURL && (
                          <div className="mt-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="link"
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                  Watch Tutorial
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-5xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    {exerciseItem.name} Tutorial
                                  </DialogTitle>
                                  <DialogDescription>
                                    Watch this video to learn how to perform the
                                    exercise correctly.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                  <AspectRatio
                                    ratio={16 / 9}
                                    className="w-full"
                                  >
                                    <iframe
                                      src={exerciseItem.videoURL}
                                      title={`${exerciseItem.name} Tutorial`}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="w-full h-full rounded-lg"
                                    ></iframe>
                                  </AspectRatio>
                                </div>
                                <DialogClose asChild>
                                  <Button variant="secondary" className="mt-4">
                                    Close
                                  </Button>
                                </DialogClose>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium w-full text-center">
                    View All Exercises
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-secondary-900">
                      Current Exercises
                    </h3>

                    {role === "therapist" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0">
                            <Pen className="h-4 w-4 mr-2" /> Create Plan
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle></DialogTitle>
                            <DialogDescription>
                              Fill out the form below to add exercise.
                            </DialogDescription>
                          </DialogHeader>
                          <ExerciseForm onSubmit={handleCreateExercise} />
                        </DialogContent>
                      </Dialog>
                    ) : null}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center rounded-lg bg-secondary-100 p-6">
                      <div className="text-center">
                        <p className="text-primary-600 font-medium">
                          No treatment plan available at the moment.
                        </p>
                        <p className="text-secondary-600 text-sm mt-1">
                          Your physiotherapist will create a plan tailored to
                          your needs soon.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RouteComponent;
