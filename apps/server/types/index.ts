import { t } from "elysia";

export type UserRegistration = {
  email: string; // Username for the user account ( Required )
  password: string; // Password for the user account ( Required )
  contactDetails: string; // Contact details for the user account ( Required )
  name: string; // Optional name for the user
};

export type UserLogin = {
  email: string; // Username for the user account ( Required )
  password: string; //password for the user account ( Required )
};

export type BusinessRegistration = {
  personInChargeName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  businessRegistrationNumber: string;
  contractSigneeName: string;
  contractSigneeNRIC: string;
  businessAddress: string;
  state: string;
  city: string;
  postalCode: string;
};

export type StaffRegistration = {
  email: string; // Email for the staff account ( Required )
  password: string; // Password for the staff account ( Required )
  name: string;
  role: string;
  contactDetails?: string; // Contact details for the staff account ( Required )
};

export type TherapistRegistration = {
  email: string; // Email for the staff account ( Required )
  password: string; // Password for the staff account ( Required )
  name: string;
  specialization: string;
  contactDetails: string;
  qualification?: string[]; // array for the qualifications
  experience?: number; // Experience in years (e.g., 3)
  languages?: string[]; // Languages spoken by the therapist
  rate: number; //
};

export type Staff = {
  email?: string; // Email for the staff account ( Optional )
  password?: string; // Password for the staff account ( Optional )
  name?: string; // Optional name for the staff
  contactDetails?: string; // Contact details for the staff account ( Optional )
  role?: string;
};

export type Therapist = {
  therapistID: number; // Unique identifier for the therapist
  email?: string; // Email for the staff account ( Optional )
  password?: string; // Password for the staff account ( Optional )
  name?: string; // Optional name for the staff
  businessName?: string;
  specialization?: string;
  contactDetails?: string;
  qualification?: string[]; // array for the qualifications
  experience?: number | null;
  about?: string;
  city?: string;
  state?: string;
  location?: string;
  avatar?: string | null;
  rate?: string;
};

export type Email = {
  email?: string; // Email for the staff account (
  to: string; // Email for the staff account
  subject: string; // Subject line for the email
  html: string;
  resetUrl?: string; //
};

export type Availability = {
  availabilityID: number; // Unique identifier for the availability
  therapistID: number; // Unique identifier for the therapist
  dayOfWeek: string; // Day of the week
  startTime: string | null;
  endTime: string | null;
  isAvailable: number; // Availability status
  specialDate?: string | null;
};
export type AvailableSlot = {
  date: string; // The date of the availability (e.g., "2023-11-19")
  day: string; // The day of the week (e.g., "Monday")
  morning: string[]; // Morning time slots (e.g., ["08:00", "08:30"])
  afternoon: string[]; // Afternoon time slots (e.g., ["13:00", "14:00"])
  unavailable: boolean; // Availability status
};

export type Appointment = {
  therapistID: number;
  appointmentDate: string;
  time: string;
  type?: string; // for consultation type
  status?: string;
  patientID: number;
  staffID: number;
  planID?: number;
};
export type Payment = {
  paymentID?: number;
  appointmentID: number;
  amount: string;
  paymentDate?: string;
  paymentMethod?: string;
  paymentStatus: string;
  transactionReference: string;
  refundAmount?: string;
  refundDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserProfile = {
  name?: string;
  avatarFile?: File;
  avatar?: string;
  password?: string;
  confirmPassword?: string;
  contactDetails?: string;
  dob?: string;
  gender?: string;
  address?: string;
  specialization?: string;
  qualification?: string[];
  experience?: number;
  language?: string[];
  about?: string;
};

export type TreatmentPlan = {
  // planID: number;
  goals: string;
  startDate: string;
  duration: number;
  frequency: number;
  patientID: number;
  therapistID: number;
  appointmentID: number;
};

export type Exercise = {
  planID: number;
  name: string;
  description: string;
  duration: number;
  videoURL?: string;
};
export type CancelAppointment = {
  appointmentID: number;
};

export type MeetingLink = {
  meetingLink: string;
};

export const MeetingLinkSchema = t.Object({
  meetingLink: t.String(),
});

export const ExerciseSchema = t.Object({
  planID: t.Number(),
  name: t.String(),
  description: t.String(),
  duration: t.Number(),
  videoURL: t.Optional(t.String()),
});

export const CancelAppointmentSchema = t.Object({
  appointmentID: t.Number(),
});
export const TreatmentPlanSchema = t.Object({
  goals: t.String(),
  startDate: t.String(),
  duration: t.Number(),
  frequency: t.Number(),
  patientID: t.Number(),
  therapistID: t.Number(),
  appointmentID: t.Number(),
});
export const UserProfileSchema = t.Object({
  name: t.Optional(t.String()),
  avatarFile: t.Optional(
    t.File({
      type: ["image/jpeg", "image/png", "image/webp"],
      maxSize: "5m",
    })
  ),
  avatar: t.Optional(t.String()),
  password: t.Optional(t.String()),
  confirmPassword: t.Optional(t.String()),
  contactDetails: t.Optional(t.String()),
  dob: t.Optional(t.String()),
  gender: t.Optional(t.String()),
  address: t.Optional(t.String()),
  specialization: t.Optional(t.String()),
  qualification: t.Optional(t.Array(t.String())),
  experience: t.Optional(t.Union([t.Number(), t.String()])),
  language: t.Optional(t.Array(t.String())),
  about: t.Optional(t.String()),
});
export const AppointmentSchema = t.Object({
  therapistID: t.Number(),
  appointmentDate: t.String(),
  time: t.String(),
  type: t.Optional(t.String()), // for consultation type
  status: t.Optional(t.String()),
});
// Define the UserRegistration type schema
export const UserRegistrationSchema = t.Object({
  email: t.String(),
  password: t.String(),

  contactDetails: t.String(),
  name: t.String(),
});

// Define the UserLogin type schema
export const UserLoginSchema = t.Object({
  email: t.String(),
  password: t.String(),
});

export const BusinessRegistrationSchema = t.Object({
  personInChargeName: t.String(),
  contactEmail: t.String(),
  contactPhone: t.String(),
  companyName: t.String(),
  businessRegistrationNumber: t.String(),
  contractSigneeName: t.String(),
  contractSigneeNRIC: t.String(),
  businessAddress: t.String(),
  state: t.String(),
  city: t.String(),
  postalCode: t.String(),
});

export const StaffRegistrationSchema = t.Object({
  email: t.String(),
  password: t.String(),
  name: t.String(),
  role: t.String(),
  contactDetails: t.Optional(t.String()),
});

export const TherapistRegistrationSchema = t.Object({
  email: t.String(),
  password: t.String(),
  name: t.String(),
  specialization: t.String(),
  contactDetails: t.String(),
  qualification: t.Optional(t.Array(t.String())), // Optional field
  experience: t.Optional(t.Number()), // Optional field
  rate: t.Number(),
});

export const StaffSchema = t.Object({
  email: t.String(),
  password: t.String(),
  name: t.String(),
  role: t.String(),
});

export const TherapistSchema = t.Object({
  email: t.String(),
  password: t.String(),
  name: t.String(),
  businessName: t.Optional(t.String()), // Optional field
  specialization: t.String(),
  contactDetails: t.String(),
  qualification: t.Optional(t.Array(t.String())),
  experience: t.Optional(t.Number()), // Experience in years (e.g., 3)\
  city: t.Optional(t.String()), // Optional field
  state: t.Optional(t.String()), // Optional field
  location: t.Optional(t.String()), // Location for the therapist
  rate: t.String(), // Rate per hour (e.g., 100)
});

export const EmailSchema = t.Object({
  email: t.String(), // Email for the staff account ( Optional )
  to: t.String(),
  subject: t.String(),
  html: t.String(),
  resetUrl: t.String(),
});

export const AvailabilitySchema = t.Object({
  availabilityID: t.Number(), // Unique identifier for the availability
  therapistID: t.Number(), // Unique identifier for the therapist
  dayOfWeek: t.String(), // Day of the week
  startTime: t.String(), // Start time of the availability
  endTime: t.String(), // End time of the availability
  isAvailable: t.Union([t.Number(), t.String()]), // Availability status
  specialDate: t.Optional(t.Union([t.String(), t.Null()])),
});

//Define the AvailableSlot type schema
export const AvailableSlotSchema = t.Object({
  date: t.String(), // Date in string format
  day: t.String(), // Day of the week (e.g., "Monday")
  morning: t.Array(t.String()), // Array of strings for morning slots
  afternoon: t.Array(t.String()), // Array of strings for afternoon slots
  evening: t.Array(t.String()), // Array of strings for evening slots
  unavailable: t.Boolean(), // Availability status
});

// Define the AvailableSlotsResponse type schema
export const AvailableSlotsResponseSchema = t.Array(AvailableSlotSchema);
export const AvailabilityBatchSchema = t.Array(AvailabilitySchema);
