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
};

export type Email = {
  email?: string; // Email for the staff account (
  to: string; // Email for the staff account
  subject: string; // Subject line for the email
  html: string;
  resetUrl?: string; //
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
});

export const EmailSchema = t.Object({
  email: t.String(), // Email for the staff account ( Optional )
  to: t.String(),
  subject: t.String(),
  html: t.String(),
  resetUrl: t.String(),
});
