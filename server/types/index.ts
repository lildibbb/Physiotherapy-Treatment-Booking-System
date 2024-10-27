import { t } from "elysia";

// Define the Appointment type
export type Appointment = {
  appointmentID: number; // Unique identifier for the appointment
  appointmentDate: string; // Date of the appointment in YYYY-MM-DD format
  time: string; // Time of the appointment (e.g., "09:00")
  status: string; // Status of the appointment (e.g., "Scheduled", "Completed", "Cancelled")
  patientID: number; // Reference to the patient ID
  therapistID: number; // Reference to the therapist ID
  staffID: number; // Reference to the staff member ID
  userID: number; // Reference to the user who created the appointment
};

export type UserProfile = {
  name?: string; // Name for the user
  email?: string; // Email
  avatar?: string; // URL
};
export type UserRegistration = {
  email: string; // Username for the user account ( Required )
  password: string; // Password for the user account ( Required )
  role?: string; // Optional role for the user
  associatedID?: string; // Reference to the associated user
  name?: string; // Optional name for the user
  avatar?: string; // Optional avatar for the
};
export type UserLogin = {
  email: string; // Username for the user account ( Required )
  password: string; //password for the user account ( Required )
};

// Optionally, you can define validation schemas using Elysia or any other library if needed
export const AppointmentSchema = t.Object({
  appointmentID: t.Number(),
  appointmentDate: t.String(),
  time: t.String(),
  status: t.String(),
  patientID: t.Number(),
  therapistID: t.Number(),
  staffID: t.Number(),
});

// Define the UserRegistration type schema
export const UserRegistrationSchema = t.Object({
  email: t.String(),
  password: t.String(),
  role: t.String(),
  associatedID: t.String(),
});

// Define the UserLogin type schema
export const UserLoginSchema = t.Object({
  email: t.String(),
  password: t.String(),
});

export const UserProfileSchema = t.Object({
  name: t.String(),
  email: t.String(),
  avatar: t.String(),
});

export type PatientRegistration = {
  email: string;
  password: string;
  name: string;
  contactDetails: string;
  dob: string;
  gender: string;
  address: string;
};

export type StaffRegistration = {
  email: string;
  password: string;
  name: string;
  role: string;
  hospitalID: number;
};

export const PatientRegistrationSchema = t.Object({
  email: t.String(),
  password: t.String(),
  name: t.String(),
  contactDetails: t.String(),
  dob: t.String(),
  gender: t.String(),
  address: t.String(),
});

export const StaffRegistrationSchema = t.Object({
  email: t.String(),
  password: t.String(),
  name: t.String(),
  role: t.String(),
  hospitalID: t.Number(),
});

export type HospitalRegistration = {
  name: string;
  location: string;
  longitude: string;
  latitude: string;
  avatar?: string;
};

export const HospitalRegistrationSchema = t.Object({
  name: t.String(),
  location: t.String(),
  longitude: t.String(),
  latitude: t.String(),
  avatar: t.Optional(t.String()), // Optional field
});
