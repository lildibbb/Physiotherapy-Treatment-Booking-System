import { eq, or, and, asc } from "drizzle-orm";
import type { Appointment } from "../../types";
import db from "../db";
import { patients, physiotherapists, staffs, appointments } from "../schema";
import jsonResponse from "./auth-services";

// Create appointment and associate it with the logged-in user
export async function createAppointment(
  reqBody: Appointment,
  therapistID: number,
  profile: {
    id: number;
  }
) {
  if (!reqBody.appointmentDate || !reqBody.time) {
    return jsonResponse({ error: "appointmentDate, time are required." }, 400);
  }
  // pass the userID from the decoded token
  const userID = profile.id;
  console.log("User ID received:", userID);
  try {
    //Step 0 : fetch patientID form userID
    const patientResult = await db
      .select({ patientID: patients.patientID })
      .from(patients)
      .where(eq(patients.userID, userID))
      .execute();

    if (!patientResult || patientResult.length === 0) {
      return jsonResponse(
        { error: "No patient found for the provided userID." },
        404
      );
    }

    const { patientID } = patientResult[0];
    console.log("Patient ID received:", patientID);
    //Step 1 : fetch businessID related to the therapist
    const businessResult = await db
      .select({ businessID: physiotherapists.businessID })
      .from(physiotherapists)
      .where(eq(physiotherapists.therapistID, therapistID))
      .execute();

    if (!businessResult) {
      return jsonResponse(
        { error: "No business found for the selected physiotherapist." },
        404
      );
    }

    const { businessID } = businessResult[0];

    //Step 2 : fetch staffID related to the businessID
    //TODO: Implement randomly / assign staff instead of selecting the first staff
    const staffResult = await db
      .select({ staffID: staffs.staffID })
      .from(staffs)
      .where(eq(staffs.businessID, businessID))
      .execute();

    if (!staffResult) {
      return jsonResponse(
        {
          error:
            "No staff found for the business associated with this therapist.",
        },
        404
      );
    }

    const { staffID } = staffResult[0];

    // Step 3: Create the appointment
    const newAppointment = await db
      .insert(appointments)
      .values({
        ...reqBody,
        patientID: patientID, // Add patientID
        therapistID: therapistID, // Add therapistID
        staffID: staffID, // Add staffID
        status: "pending", // Default status
        planID: null, // Default plan ID (can be null if not provided)
      })
      .returning() // Return the inserted record
      .execute();

    console.log(
      `Successfully created appointment with ID ${newAppointment[0].appointmentID}`
    );
    return jsonResponse(newAppointment[0], 201); // Return created appointment
  } catch (error) {
    console.error("Error creating appointment:", error);
    return jsonResponse({ error: "Unable to create appointment" }, 500);
  }
}

// TODO table UI for get appointment
export async function getAppointmentByID(profile: {
  id: number;
  therapistID: number;
  staffID: number;
}) {
  //pass the decoded userID from the token
  const { id, therapistID, staffID } = profile;
  if (!id) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      401
    );
  }
  try {
    const appointmentData = await db
      .select({
        patientID: appointments.patientID,
        therapistID: appointments.therapistID,
        staffID: appointments.staffID,
        appointmentID: appointments.appointmentID,
        appointmentDate: appointments.appointmentDate,
        time: appointments.time,
        status: appointments.status,
        patientName: patients.name, // Join to get patient name
        therapistName: physiotherapists.name, // Join to get therapist name
        staffName: staffs.name, // Join to get staff name
      })
      .from(appointments)
      .leftJoin(patients, eq(patients.patientID, appointments.patientID)) // Assumes patientID linkage
      .leftJoin(
        physiotherapists,
        eq(physiotherapists.therapistID, appointments.therapistID)
      )
      .leftJoin(staffs, eq(staffs.staffID, appointments.staffID))
      .where(
        or(
          eq(patients.userID, id),
          eq(physiotherapists.therapistID, therapistID),
          eq(staffs.staffID, staffID)
        )
      ) // Filter by userID
      .execute();

    return appointmentData;
  } catch (error) {
    console.error("Error fetching appointment data:", error);
    return { error: "Unable to fetch appointment data", status: 500 };
  }
}
