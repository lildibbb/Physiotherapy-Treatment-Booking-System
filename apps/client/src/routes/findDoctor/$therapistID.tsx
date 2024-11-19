import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

import {
  fetchTherapistDetailsByID,
  fetchTherapistAvailability,
} from "../../lib/api"; // Adjust the path to your api.ts
import { useEffect } from "react";

export const Route = createFileRoute("/findDoctor/$therapistID")({
  component: RouteComponent,
});

function RouteComponent({ params }: { params: { therapistID: string } }) {
  const [therapist, setTherapist] = React.useState(null);
  const [availability, setAvailability] = React.useState([]);
  const { therapistID } = Route.useParams();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  if (!therapistID) {
    console.error("therapistID is missing in params:", params);
    return <p>Error: Therapist ID is required.</p>;
  }

  const id = Number(therapistID);
  if (isNaN(id)) {
    console.error("Invalid therapistID:", therapistID);
    return <p>Error: Invalid Therapist ID.</p>;
  }

  useEffect(() => {
    async function fetchDetails() {
      if (!therapistID) {
        setError("Therapist ID is required");
        setIsLoading(false);
        return;
      }
      const id = Number(therapistID);
      if (isNaN(id)) {
        console.error("Invalid therapistID: Not a number");
        return;
      }
      try {
        const therapistData = await fetchTherapistDetailsByID(id);
        setTherapist(therapistData);
      } catch (error) {
        console.error("Error fetching therapist details:", error);
      }
    }
    fetchDetails();
  }, [therapistID]);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const availabilityData = await fetchTherapistAvailability(
          Number(therapistID)
        );
        console.log("Fetched availability data:", availabilityData);
        setAvailability(availabilityData);
      } catch (error: any) {
        console.error("Error fetching availability slots:", error);
        setError(error.message || "Failed to fetch availability");
      }
    }
    fetchAvailability();
  }, [therapistID]);

  if (!therapist) {
    return <p className="text-center text-lg">Loading therapist details...</p>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <DoctorDetails therapist={therapist} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConsultationType />
        <Availability availability={availability} />
      </div>
    </div>
  );
}

function DoctorDetails({ therapist }: { therapist: any }) {
  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h2 className="text-2xl font-bold">{therapist.name}</h2>
      <p className="text-gray-600">{therapist.specialization}</p>
      <p className="text-sm text-gray-500">
        {therapist.experience} Years Experience
      </p>
      <p className="text-sm text-gray-500">{therapist.location}</p>
      <div className="flex gap-2 mt-4">
        <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
          Highly recommended
        </span>
        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
          Excellent wait time
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold">About Doctor</h3>
      <p className="text-gray-600">
        {therapist.description || "No description available"}
      </p>
      <h3 className="mt-4 text-lg font-semibold">Practices</h3>
      <p className="text-blue-600">{therapist.businessName}</p>
    </div>
  );
}

function ConsultationType() {
  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h3 className="text-lg font-semibold">
        Step 1: Choose Consultation Type
      </h3>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Video
      </button>
    </div>
  );
}

function Availability({ availability }: { availability: any[] }) {
  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h3 className="text-lg font-semibold">Step 2: Choose Date & Time</h3>
      <div className="mt-4 space-y-4">
        {availability.map((slot) => (
          <div key={slot.date} className="border p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800">{slot.date}</h4>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <h5 className="font-medium text-gray-600">Morning</h5>
                {slot.morning.length ? (
                  slot.morning.map((time: string) => (
                    <button
                      key={time}
                      className="mt-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Unavailable</p>
                )}
              </div>
              <div>
                <h5 className="font-medium text-gray-600">Afternoon</h5>
                {slot.afternoon.length ? (
                  slot.afternoon.map((time: string) => (
                    <button
                      key={time}
                      className="mt-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Unavailable</p>
                )}
              </div>
              <div>
                <h5 className="font-medium text-gray-600">Evening</h5>
                {slot.evening.length ? (
                  slot.evening.map((time: string) => (
                    <button
                      key={time}
                      className="mt-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Unavailable</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
