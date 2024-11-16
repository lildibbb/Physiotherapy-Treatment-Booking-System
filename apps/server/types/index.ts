import { t } from "elysia";

export type UserRegistration = {
  email: string; // Username for the user account ( Required )
  password: string; // Password for the user account ( Required )
  role?: string; // Optional role for the user
  associatedID?: string; // Reference to the associated user
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
  role?: string;
};

export type TherapistRegistration = {
  email: string; // Email for the staff account ( Required )
  password: string; // Password for the staff account ( Required )
  name: string;
  specialization: string;
  contactDetails: string;
  qualification?: string[]; // array for the qualifications
  experience?: number; // Experience in years (e.g., 3)
};

export type Staff = {
  email?: string; // Email for the staff account ( Optional )
  password?: string; // Password for the staff account ( Optional )
  name?: string; // Optional name for the staff
  role?: string;
};

export type Therapist = {
  email?: string; // Email for the staff account ( Optional )
  password?: string; // Password for the staff account ( Optional )
  name?: string; // Optional name for the staff
  specialization?: string;
  contactDetails?: string;
  qualification?: string[]; // array for the qualifications
  experience?: number;
};

export type Email = {
  email?: string; // Email for the staff account (
  to: string; // Email for the staff account
  subject: string; // Subject line for the email
  html: string;
  resetUrl?: string; //
};

export type Availability = {
  dayOfWeek: string; // Day of the week
  startTime: string; // Start time of the availability
  endTime: string; // End time of the availability
  isAvailable: boolean; // Availability status
  specialDate?: string; // Special date for the availability
};
export type AvailableSlot = {
  date: string; // The date of the availability (e.g., "2023-11-19")
  day: string; // The day of the week (e.g., "Monday")
  morning: string[]; // Morning time slots (e.g., ["08:00", "08:30"])
  afternoon: string[]; // Afternoon time slots (e.g., ["13:00", "14:00"])
  evening: string[]; // Evening time slots (e.g., ["18:00", "19:30"])
};

// Define the UserRegistration type schema
export const UserRegistrationSchema = t.Object({
  email: t.String(),
  password: t.String(),
  role: t.String(),
  associatedID: t.String(),
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
});

export const TherapistRegistrationSchema = t.Object({
  email: t.String(),
  password: t.String(),
  name: t.String(),
  specialization: t.String(),
  contactDetails: t.String(),
  qualification: t.Optional(t.Array(t.String())), // Optional field
  experience: t.Optional(t.Number()), // Optional field
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
  specialization: t.String(),
  contactDetails: t.String(),
  qualification: t.Array(t.String()),
  experience: t.Number(), // Experience in years (e.g., 3)
});

export const EmailSchema = t.Object({
  email: t.String(), // Email for the staff account ( Optional )
  to: t.String(),
  subject: t.String(),
  html: t.String(),
  resetUrl: t.String(),
});

export const AvailabilitySchema = t.Object({
  dayOfWeek: t.String(), // Day of the week
  startTime: t.String(), // Start time of the availability
  endTime: t.String(), // End time of the availability
  isAvailable: t.Boolean(), // Availability status
  specialDate: t.String(), // Special date for the availability
});

//Define the AvailableSlot type schema
export const AvailableSlotSchema = t.Object({
  date: t.String(), // Date in string format
  day: t.String(), // Day of the week (e.g., "Monday")
  morning: t.Array(t.String()), // Array of strings for morning slots
  afternoon: t.Array(t.String()), // Array of strings for afternoon slots
  evening: t.Array(t.String()), // Array of strings for evening slots
});

// Define the AvailableSlotsResponse type schema
export const AvailableSlotsResponseSchema = t.Array(AvailableSlotSchema);
