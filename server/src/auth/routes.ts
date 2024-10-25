import { eq } from "drizzle-orm";
import db from "../db";
import type { Appointment } from "../../types/index";
import { patients, physiotherapists, appointments } from "../schema";

// Helper function for consistent response formatting
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

export async function getAppointments() {
  try {
    const appointmentsData = await db.select().from(appointments).execute();
    console.log(
      `Successfully retrieved ${appointmentsData.length} appointments`
    );
    return jsonResponse(appointmentsData);
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return jsonResponse({ error: "Unable to retrieve appointments" }, 500);
  }
}

export async function getAppointmentById(id: number) {
  try {
    const result = await db
      .select()
      .from(appointments)
      .where(eq(appointments.appointmentID, id))
      .execute();
    if (result.length === 0) {
      console.log(`Appointment with ID ${id} not found`);
      return jsonResponse({ error: `Appointment with ID ${id}` }, 400);
    }
    console.log(`Successfully retrieved appointment with ID ${id}`);
    return jsonResponse(result[0]);
  } catch (error) {
    console.error("Error retrieving appointment by ID:", error);
    return jsonResponse({ error: "Unable to retrieve appointment" }, 500);
  }
}

export async function createAppointment(reqBody: Appointment) {
  // Validate input before inserting
  if (!reqBody.appointmentDate || !reqBody.time || !reqBody.status) {
    return jsonResponse(
      { error: "appointmentDate, time, and status are required." },
      400
    );
  }

  try {
    const newAppointment: Appointment[] = await db
      .insert(appointments)
      .values(reqBody)
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

export async function updateAppointment(
  id: number,
  reqBody: Partial<Appointment>
) {
  try {
    const updatedAppointment: Appointment[] = await db
      .update(appointments)
      .set(reqBody)
      .where(eq(appointments.appointmentID, id))
      .returning()
      .execute();
    if (updatedAppointment.length === 0) {
      console.log(`Appointment with ID ${id} not found for update`);
      return jsonResponse({ error: `Appointment with ID ${id}` }, 400);
    }
    console.log(`Successfully updated appointment with ID ${id}`);
    return jsonResponse(updatedAppointment[0], 201);
  } catch (error) {
    console.error(`Error updating appointment with ID ${id}`, error);
    return jsonResponse({ error: "Unable to update appointment" }, 500);
  }
}
