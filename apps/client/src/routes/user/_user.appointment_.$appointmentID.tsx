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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
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

// Custom Components
import { MainNav } from "@/components/dashboard/patient/main-nav";
import { UserNav } from "@/components/dashboard/patient/user-nav";
import { Spinner } from "@/components/spinner"; // Assuming you have a Spinner component

export const Route = createFileRoute("/user/_user/appointment_/$appointmentID")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { appointmentID } = Route.useParams();
  console.log("appointmentID from params: ", appointmentID);
  // Mock appointment data tailored for Physiotherapy
  const appointment = {
    id: "000003",
    appointmentDate: "Mar 30, 2024",
    time: "09:00 AM",
    patientName: "Emily Davis",
    age: 28,
    gender: "Female",
    status: "Recovering",
    primaryCondition: "Post-surgery Recovery",
    bloodType: "A+",
    lastVisit: "Mar 18, 2024",
    nextAppointment: "Apr 15, 2024",
    treatmentPlan: {
      goals: "Improve mobility and reduce pain in the knee.",
      exercises: [
        "Quadriceps strengthening",
        "Hamstring stretches",
        "Ankle pumps",
        "Balance exercises",
      ],
      doctors: ["Dr. Smith", "Physiotherapist John"],
      duration: "6 weeks",
      frequency: "3 times a week",
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
  const isLoading = false;
  const error = "";

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
      {/* Header */}
      <header className="border-b">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <MainNav />
          <UserNav />
        </div>
      </header>

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
                  View and manage your physiotherapy appointment information
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="px-4 py-2">
                Edit Appointment
              </Button>
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
                  <DropdownMenuItem>Option 1</DropdownMenuItem>
                  <DropdownMenuItem>Option 2</DropdownMenuItem>
                  <DropdownMenuItem>Option 3</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Combined Grid: Patient Profile, Treatment Plan, Past Appointments, Current Exercises, Recent Documents, Clinical Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Profile Card */}
            <Card className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
                    alt={appointment.patientName}
                  />
                  <AvatarFallback>
                    {appointment.patientName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-secondary-900">
                        {appointment.patientName}
                      </h2>
                      <p className="text-secondary-600">
                        {appointment.age} years • {appointment.gender} • ID: #
                        {appointment.id}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm border bg-amber-50 text-amber-700 border-amber-100">
                      {appointment.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-secondary-500">
                        Primary Condition
                      </p>
                      <p className="font-medium text-secondary-900">
                        {appointment.primaryCondition}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-500">Blood Type</p>
                      <p className="font-medium text-secondary-900">
                        {appointment.bloodType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-500">Last Visit</p>
                      <p className="font-medium text-secondary-900">
                        {appointment.lastVisit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-500">
                        Next Appointment
                      </p>
                      <p className="font-medium text-primary-600">
                        {appointment.nextAppointment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Treatment Plan */}
            <Card className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-secondary-900">
                    Treatment Plan
                  </h3>
                  <p className="text-sm text-secondary-500">March 2024</p>
                </div>
                <Input
                  type="month"
                  defaultValue="2024-03"
                  className="w-32 text-sm"
                  aria-label="Select Month"
                />
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
                  <h4 className="font-medium text-secondary-900">Exercises</h4>
                  <ul className="list-disc list-inside text-secondary-600">
                    {appointment.treatmentPlan.exercises.map(
                      (exercise, index) => (
                        <li key={index}>{exercise}</li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Doctors</h4>
                  <ul className="list-disc list-inside text-secondary-600">
                    {appointment.treatmentPlan.doctors.map((doctor, index) => (
                      <li key={index}>{doctor}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Duration</h4>
                  <p className="text-secondary-600">
                    {appointment.treatmentPlan.duration}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Frequency</h4>
                  <p className="text-secondary-600">
                    {appointment.treatmentPlan.frequency}
                  </p>
                </div>
              </div>
            </Card>

            {/* Past Appointments */}
            <Card className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900">
                  Past Appointments
                </h3>
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
                  className="lucide lucide-calendar w-5 h-5 text-secondary-400"
                >
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M3 10h18"></path>
                </svg>
              </div>
              <div className="space-y-4">
                {appointment.pastAppointments.map((appt, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      <div>
                        <p className="font-medium text-secondary-900">
                          {appt.date}
                        </p>
                        <p className="text-sm text-secondary-500">
                          {appt.time} • {appt.type}
                        </p>
                        <p className="text-sm text-secondary-500">
                          {appt.notes}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-secondary-400 hover:text-secondary-600"
                      aria-label="View Appointment"
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
                        className="lucide lucide-chevron-right w-5 h-5"
                      >
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium w-full text-center">
                View All Past Appointments
              </button>
            </Card>

            {/* Current Exercises */}
            <Card className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900">
                  Current Exercises
                </h3>
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
                  className="lucide lucide-dumbbell w-5 h-5 text-secondary-400"
                >
                  <path d="M4 12h2"></path>
                  <path d="M18 12h2"></path>
                  <path d="M6 12a2 2 0 1 0 4 0"></path>
                  <path d="M14 12a2 2 0 1 0 4 0"></path>
                  <path d="M10 12h4"></path>
                </svg>
              </div>
              <div className="space-y-4">
                {appointment.currentExercises.map((exercise, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-secondary-900">
                        {exercise.name}
                      </h4>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {exercise.duration}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600 mt-1">
                      {exercise.description}
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
                          {/* Increased from max-w-3xl to max-w-5xl */}
                          <DialogHeader>
                            <DialogTitle>{exercise.name} Tutorial</DialogTitle>
                            <DialogDescription>
                              Watch this video to learn how to perform the
                              exercise correctly.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <AspectRatio ratio={16 / 9} className="w-full">
                              {/* Using ShadCN's AspectRatio */}
                              <iframe
                                src={exercise.videoUrl}
                                title={`${exercise.name} Tutorial`}
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
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium w-full text-center">
                View All Exercises
              </button>
            </Card>

            {/* Recent Documents */}
            <Card className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900">
                  Recent Documents
                </h3>
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
                  className="lucide lucide-file-text w-5 h-5 text-secondary-400"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
              </div>
              <div className="space-y-4">
                {appointment.recentDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-secondary-900">
                        {doc.title}
                      </h4>
                      <p className="text-sm text-secondary-500">
                        {doc.date} • {doc.category}
                      </p>
                    </div>
                    <button
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      aria-label={`View ${doc.title}`}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium w-full text-center">
                View All Documents
              </button>
            </Card>

            {/* Clinical Notes */}
            <Card className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900">
                  Clinical Notes
                </h3>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Add Note
                </button>
              </div>
              <div className="space-y-4">
                {appointment.clinicalNotes.map((note, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-secondary-900">
                        {note.author}
                      </p>
                      <p className="text-xs text-secondary-500">{note.date}</p>
                    </div>
                    <p className="text-sm text-secondary-600">{note.note}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RouteComponent;
