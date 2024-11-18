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
