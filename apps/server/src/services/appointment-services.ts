import { eq, or, and, asc } from "drizzle-orm";
import type { Appointment } from "../../types";
import db from "../db";
import {
  patients,
  physiotherapists,
  staffs,
  appointments,
  user_authentications,
} from "../schema";
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
        // Default plan ID (can be null if not provided)
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
export async function getAppointment(profile: {
  id: number;
  therapistID: number;
  staffID: number;
  patientID: number;
}) {
  //pass the decoded userID from the token
  const { id, therapistID, staffID, patientID } = profile;
  if (!id) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      401
    );
  }
  console.log("User ID received:", id);
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
      })
      .from(appointments)
      .where(
        or(
          eq(appointments.patientID, patientID),
          eq(appointments.therapistID, therapistID),
          eq(appointments.staffID, staffID)
        )
      )
      .execute();

    console.log("appointmentData patientID ", appointmentData[0]?.patientID);
    console.log("appointmentData  ", appointmentData.length);
    if (appointmentData.length === 0) {
      throw {
        error: "No appointment found for the provided userID.",
        status: 404,
      };
    }
    const patientUserID = await db
      .select({ patientUserID: patients.userID })
      .from(patients)
      .where(eq(patients.patientID, appointmentData[0].patientID));

    console.log("patientUserID: " + patientUserID[0]?.patientUserID);

    const avatarData = await db
      .select({ avatar: user_authentications.avatar })
      .from(user_authentications)
      .where(eq(user_authentications.userID, patientUserID[0].patientUserID))
      .execute();

    console.log("avatarData: ", avatarData[0]?.avatar);
    const patientName = await db
      .select({
        patientName: user_authentications.name,
        gender: patients.gender,
      })
      .from(user_authentications)
      .innerJoin(patients, eq(patients.userID, patientUserID[0].patientUserID))
      .where(eq(user_authentications.userID, patientUserID[0].patientUserID))
      .execute();

    console.log("patient name: " + patientName[0]?.patientName);

    const therapistUserID = await db
      .select({ therapistUserID: physiotherapists.userID })
      .from(physiotherapists)
      .where(eq(physiotherapists.therapistID, appointmentData[0].therapistID));
    console.log("therapist userID: ", therapistUserID[0]?.therapistUserID);

    const therapistName = await db
      .select({ therapistName: user_authentications.name })
      .from(user_authentications)
      .where(
        eq(user_authentications.userID, therapistUserID[0]?.therapistUserID)
      )
      .execute();

    console.log("therapist name: ", therapistName[0]?.therapistName);
    const staffUserID = await db
      .select({ staffUserID: staffs.userID })
      .from(staffs)
      .where(eq(staffs.staffID, appointmentData[0].staffID));

    console.log("staffUserID: " + staffUserID[0]?.staffUserID);

    const staffName = await db
      .select({ staffName: user_authentications.name })
      .from(user_authentications)
      .where(eq(user_authentications.userID, staffUserID[0]?.staffUserID))
      .execute();

    console.log("staff name: ", staffName[0]?.staffName);

    const completedAppointmentData = appointmentData.map((appointment) => ({
      ...appointment,
      avatar: avatarData[0]?.avatar || null,
      patientName: patientName[0]?.patientName || "Unknown Patient",
      gender: patientName[0]?.gender || "Unknown",
      therapistName: therapistName[0]?.therapistName || "Unknown Therapist",
      staffName: staffName[0]?.staffName || "Unknown Staff",
    }));

    console.log("completedAppointmentData:", completedAppointmentData);

    return completedAppointmentData;
  } catch (error: any) {
    console.error("Error fetching appointment data:", error);
    if (error.status === 404) {
      return {
        error: "No appointment found for the provided userID",
        status: 404,
      };
    }
    return { error: "Unable to fetch appointment data", status: 500 };
  }
}

export async function cancelAppointment(
  reqBody: { appointmentID: number },
  profile: {
    id: number;
    patientID: number;
  }
) {
  const { id, patientID } = profile;
  const { appointmentID } = reqBody;
  if (!id) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      401
    );
  }
  console.log("User ID received:", id);
  try {
    const appointmentData = await db
      .update(appointments)
      .set({ status: "Waiting for approval of refund" })
      .where(
        and(
          eq(appointments.appointmentID, appointmentID),
          eq(appointments.patientID, patientID)
        )
      )
      .returning()
      .execute();
    console.log("appointmentData: ", appointmentData);
    if (appointmentData.length === 0) {
      return jsonResponse(
        { error: "Appointment not found or already cancelled." },
        404
      );
    }
    return jsonResponse(
      {
        message: "Appointment cancellation initiated.",
        data: appointmentData[0],
      },
      200
    );
  } catch (error) {
    console.error("Error fetching appointment data:", error);
    return jsonResponse({ error: "Unable to fetch appointment data" }, 500);
  }
}
