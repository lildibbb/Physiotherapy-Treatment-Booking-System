// src/types.ts

export interface HospitalData {
  id: number;
  name: string;
  image: string;
  location: string;
  distance: number; // Distance from user in km
  coordinates: { lat: number; lng: number }; // Latitude and Longitude
}

export interface BusinessData {
  location: string;
}

export interface AppointmentPayload {
  therapistID: number;
  appointmentDate: string;
  time: string;
  type?: string; // for consultation type
  price?: number;
  status?: string;
  planID?: number;
}

export interface AvailabilityPayload {
  therapistID: number;
  availabilityID: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: number;
  specialDate?: string | null;
}

export interface TreatmentPayload {
  goals: string;
  startDate: string;
  duration: number;
  frequency: number;
  patientID: number;
  therapistID: number;
}

export interface ExercisePayload {
  planID: number;
  name: string;
  description: string;
  videoURL?: string;
  duration: number;
}
