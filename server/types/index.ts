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
};

export type UserRegistration = {
  username: string; // Username for the user account ( Required )
  password: string; // Password for the user account ( Required )
  role?: string; // Optional role for the user
  associatedID?: string; // Reference to the associated user
};
export type UserLogin = {
  username: string; // Username for the user account ( Required )
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
  username: t.String(),
  password: t.String(),
  role: t.String(),
  associatedID: t.String(),
});

// Define the UserLogin type schema
export const UserLoginSchema = t.Object({
  username: t.String(),
  password: t.String(),
});
