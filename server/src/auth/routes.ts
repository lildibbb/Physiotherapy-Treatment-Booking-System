import { eq } from "drizzle-orm";
import db from "../db";
import type { Appointment } from "../../types/index";
import { appointments, patients, physiotherapists, staffs } from "../schema";

// Helper function for consistent response formatting
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

// Function to retrieve all appointments - can add filtering by user if needed
export async function getAppointments(userId: number) {
  try {
    const appointmentsData = await db
      .select({
        appointmentID: appointments.appointmentID,
        appointmentDate: appointments.appointmentDate,
        time: appointments.time,
        status: appointments.status,
        patientName: patients.name,
        therapistName: physiotherapists.name,
        staffName: staffs.name,
      })
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientID, patients.patientID))
      .innerJoin(
        physiotherapists,
        eq(appointments.therapistID, physiotherapists.therapistID)
      )
      .innerJoin(staffs, eq(appointments.staffID, staffs.staffID))
      .where(eq(appointments.userID, userId))
      .execute();

    console.log(
      `Successfully retrieved ${appointmentsData.length} appointments`
    );
    return new Response(JSON.stringify(appointmentsData), { status: 200 });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return new Response(
      JSON.stringify({ error: "Unable to retrieve appointments" }),
      { status: 500 }
    );
  }
}

// Retrieve appointment by ID with user authorization
export async function getAppointmentById(id: number, userId: number) {
  try {
    const result = await db
      .select()
      .from(appointments)
      .where(
        eq(appointments.appointmentID, id) && eq(appointments.userID, userId)
      )
      .execute();

    if (result.length === 0) {
      console.log(`Appointment with ID ${id} not found or unauthorized`);
      return jsonResponse(
        { error: `Appointment with ID ${id} not found or unauthorized` },
        403
      );
    }

    console.log(`Successfully retrieved appointment with ID ${id}`);
    return jsonResponse(result[0]);
  } catch (error) {
    console.error("Error retrieving appointment by ID:", error);
    return jsonResponse({ error: "Unable to retrieve appointment" }, 500);
  }
}

// Create appointment and associate it with the logged-in user
export async function createAppointment(reqBody: Appointment, userId: number) {
  if (!reqBody.appointmentDate || !reqBody.time || !reqBody.status) {
    return jsonResponse(
      { error: "appointmentDate, time, and status are required." },
      400
    );
  }

  try {
    // Check if the staffID exists in the staffs table
    const staffExists = await db
      .select()
      .from(staffs)
      .where(eq(staffs.staffID, reqBody.staffID))
      .execute();

    if (staffExists.length === 0) {
      return jsonResponse(
        { error: `Staff with ID ${reqBody.staffID} does not exist.` },
        400
      );
    }
    const newAppointment = await db
      .insert(appointments)
      .values({ ...reqBody, userID: userId }) // Associate appointment with user
      .returning()
      .execute();

    console.log(
      `Successfully created appointment with ID ${newAppointment[0].appointmentID}`
    );
    return jsonResponse(newAppointment[0], 201);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return jsonResponse({ error: "Unable to create appointment" }, 500);
  }
}

// Update appointment by ID with authorization check
export async function updateAppointment(
  id: number,
  reqBody: Partial<Appointment>,
  userId: number
) {
  try {
    // Check if the appointment belongs to the user
    const existingAppointment = await db
      .select()
      .from(appointments)
      .where(
        eq(appointments.appointmentID, id) && eq(appointments.userID, userId)
      )
      .execute();

    if (existingAppointment.length === 0) {
      console.log(`Appointment with ID ${id} not found or unauthorized`);
      return jsonResponse(
        { error: `Appointment with ID ${id} not found or unauthorized` },
        403
      );
    }

    const updatedAppointment = await db
      .update(appointments)
      .set(reqBody)
      .where(eq(appointments.appointmentID, id))
      .returning()
      .execute();

    console.log(`Successfully updated appointment with ID ${id}`);
    return jsonResponse(updatedAppointment[0], 200);
  } catch (error) {
    console.error(`Error updating appointment with ID ${id}`, error);
    return jsonResponse({ error: "Unable to update appointment" }, 500);
  }
}
