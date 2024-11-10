import { eq } from "drizzle-orm";
import db from "../db";
import { jwt } from "@elysiajs/jwt";
import {
  appointments,
  patients,
  physiotherapists,
  staffs,
  user_authentications,
} from "../schema";
import type { Staff } from "../../types";
import bcrypt from "bcryptjs";

// Helper function for consistent response formatting
export default function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

//Function to retrieve all staff under business (with Authorization check)
export async function getAllStaffByBusiness(jwt: any, token: string) {
  // Decode the token and extract the business ID
  const decodedToken = await jwt.verify(token, "secretKey");
  const businessID = decodedToken.businessID;

  if (!businessID) {
    throw { message: "Only authorized users can access this", status: 403 };
  }

  // Query the database for staff belonging to this businessID
  const staffData = await db
    .select({
      staffID: staffs.staffID,
      name: staffs.name,
      email: user_authentications.email,
      password: user_authentications.password,
      role: staffs.role,
    })
    .from(staffs)
    .innerJoin(
      user_authentications,
      eq(staffs.userID, user_authentications.userID)
    )
    .where(eq(staffs.businessID, businessID))
    .execute();

  return staffData;
}

// Fixed version of updateStaffDetails function
export async function updateStaffDetails(
  reqBody: Partial<Staff>,
  jwt: any,
  token: string,
  staffID: string
) {
  // Convert staffID to a number
  const staffIDNumber = parseInt(staffID, 10);

  // Decode the token to extract the businessID
  const decodedToken = await jwt.verify(token, "secretKey");
  const businessID = decodedToken.businessID;

  if (!businessID) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      403
    );
  }

  // Step 1: Fetch the staff record by `staffID` and verify it belongs to the current `businessID`
  const staffData = await db
    .select({
      userID: staffs.userID,
      businessID: staffs.businessID,
    })
    .from(staffs)
    .where(eq(staffs.staffID, staffIDNumber))
    .execute();

  // Step 2: Check if the staff exists and belongs to the correct business
  if (staffData.length === 0 || staffData[0].businessID !== businessID) {
    return jsonResponse(
      { error: "Staff member not found or unauthorized to update" },
      403
    );
  }

  // Extract the userID from the staffData
  const userID = staffData[0].userID;

  // Step 3: Check if a user with the same email already exists to avoid conflicts
  if (reqBody.email) {
    const existingUser = await db
      .select()
      .from(user_authentications)
      .where(eq(user_authentications.email, reqBody.email))
      .execute();

    if (existingUser.length > 0 && existingUser[0].userID !== userID) {
      return jsonResponse(
        { error: "Email is already in use. Please use a different email." },
        409
      );
    }
  }

  try {
    // Step 4: Update `user_authentications` table (for email and password)
    const authUpdateFields: Partial<Staff> = {};
    if (reqBody.email) authUpdateFields.email = reqBody.email;

    if (reqBody.password) {
      const hashedPassword = await bcrypt.hash(reqBody.password, 10);
      authUpdateFields.password = hashedPassword;
    }

    if (Object.keys(authUpdateFields).length > 0) {
      await db
        .update(user_authentications)
        .set(authUpdateFields)
        .where(eq(user_authentications.userID, userID))
        .execute();
    }

    // Step 5: Update `staffs` table (for role and name)
    const staffUpdateFields: Partial<Staff> = {};
    if (reqBody.name) staffUpdateFields.name = reqBody.name;
    if (reqBody.role) staffUpdateFields.role = reqBody.role;

    if (Object.keys(staffUpdateFields).length > 0) {
      await db
        .update(staffs)
        .set(staffUpdateFields)
        .where(eq(staffs.staffID, staffIDNumber))
        .execute();
    }

    return jsonResponse(
      {
        message: "Staff details updated successfully",
        staff: staffUpdateFields,
      },
      200
    );
  } catch (error) {
    console.error("Error updating staff:", error);
    return jsonResponse({ message: "Error updating staff", error }, 500);
  }
}
export async function getAllTherapistByBusiness(jwt: any, token: string) {
  const decodedToken = await jwt.verify(token, "secretKey");
  const businessID = decodedToken.businessID;

  if (!businessID) {
    throw { message: "Only authorized users can access this", status: 403 };
  }

  const therapistData = await db
    .select({
      therapistID: physiotherapists.therapistID,
      name: physiotherapists.name,
      email: user_authentications.email,
      password: user_authentications.password,
      specialization: physiotherapists.specialization,
      contactDetails: physiotherapists.contactDetails,
    })
    .from(physiotherapists)
    .innerJoin(
      user_authentications,
      eq(physiotherapists.userID, user_authentications.userID)
    )
    .where(eq(physiotherapists.businessID, businessID))
    .execute();

  return therapistData;
}

export async function updateTherapistDetails(
  reqBody: Partial<Staff>,
  jwt: any,
  token: string,
  therapistID: string
) {
  const therapistIDNumber = parseInt(therapistID, 10);

  const decodedToken = await jwt.verify(token, "secretKey");
  const businessID = decodedToken.businessID;

  if (!businessID) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      403
    );
  }

  const therapistData = await db
    .select({
      userID: physiotherapists.userID,
      businessID: physiotherapists.businessID,
    })
    .from(physiotherapists)
    .where(eq(physiotherapists.therapistID, therapistIDNumber))
    .execute();

  if (
    therapistData.length === 0 ||
    therapistData[0].businessID !== businessID
  ) {
    return jsonResponse(
      { error: "Therapist not found or unauthorized to update" },
      403
    );
  }

  const userID = therapistData[0].userID;

  if (reqBody.email) {
    const existingUser = await db
      .select()
      .from(user_authentications)
      .where(eq(user_authentications.email, reqBody.email))
      .execute();

    if (existingUser.length > 0 && existingUser[0].userID !== userID) {
      return jsonResponse(
        { error: "Email is already in use. Please use a different email." },
        409
      );
    }
  }

  try {
    const authUpdateFields: Partial<Staff> = {};
    if (reqBody.email) authUpdateFields.email = reqBody.email;

    if (reqBody.password) {
      const hashedPassword = await bcrypt.hash(reqBody.password, 10);
      authUpdateFields.password = hashedPassword;
    }

    if (Object.keys(authUpdateFields).length > 0) {
      await db
        .update(user_authentications)
        .set(authUpdateFields)
        .where(eq(user_authentications.userID, userID))
        .execute();
    }

    const therapistUpdateFields: Partial<Staff> = {};
    if (reqBody.name) therapistUpdateFields.name = reqBody.name;
    if (reqBody.role) therapistUpdateFields.role = reqBody.role;

    if (Object.keys(therapistUpdateFields).length > 0) {
      await db
        .update(physiotherapists)
        .set(therapistUpdateFields)
        .where(eq(physiotherapists.therapistID, therapistIDNumber))
        .execute();
    }

    return jsonResponse(
      {
        message: "Therapist details updated successfully",
        therapist: therapistUpdateFields,
      },
      200
    );
  } catch (error) {
    console.error("Error updating therapist:", error);
    return jsonResponse({ message: "Error updating therapist", error }, 500);
  }
}
// Function to retrieve all appointments - can add filtering by user if needed
// export async function getAppointments(userId: number) {
//   try {
//     const appointmentsData = await db
//       .select({
//         appointmentID: appointments.appointmentID,
//         appointmentDate: appointments.appointmentDate,
//         time: appointments.time,
//         status: appointments.status,
//         patientName: patients.name,
//         therapistName: physiotherapists.name,
//         staffName: staffs.name,
//       })
//       .from(appointments)
//       .innerJoin(patients, eq(appointments.patientID, patients.patientID))
//       .innerJoin(
//         physiotherapists,
//         eq(appointments.therapistID, physiotherapists.therapistID)
//       )
//       .innerJoin(staffs, eq(appointments.staffID, staffs.staffID))
//       .where(eq(appointments.userID, userId))
//       .execute();

//     console.log(
//       `Successfully retrieved ${appointmentsData.length} appointments`
//     );
//     return new Response(JSON.stringify(appointmentsData), { status: 200 });
//   } catch (error) {
//     console.error("Error retrieving appointments:", error);
//     return new Response(
//       JSON.stringify({ error: "Unable to retrieve appointments" }),
//       { status: 500 }
//     );
//   }
// }

// // Retrieve appointment by ID with user authorization
// export async function getAppointmentById(id: number, userId: number) {
//   try {
//     const result = await db
//       .select()
//       .from(appointments)
//       .where(
//         eq(appointments.appointmentID, id) && eq(appointments.userID, userId)
//       )
//       .execute();

//     if (result.length === 0) {
//       console.log(`Appointment with ID ${id} not found or unauthorized`);
//       return jsonResponse(
//         { error: `Appointment with ID ${id} not found or unauthorized` },
//         403
//       );
//     }

//     console.log(`Successfully retrieved appointment with ID ${id}`);
//     return jsonResponse(result[0]);
//   } catch (error) {
//     console.error("Error retrieving appointment by ID:", error);
//     return jsonResponse({ error: "Unable to retrieve appointment" }, 500);
//   }
// }

// Create appointment and associate it with the logged-in user
// export async function createAppointment(reqBody: Appointment, userId: number) {
//   if (!reqBody.appointmentDate || !reqBody.time || !reqBody.status) {
//     return jsonResponse(
//       { error: "appointmentDate, time, and status are required." },
//       400
//     );
//   }

//   try {
//     // Check if the staffID exists in the staffs table
//     const staffExists = await db
//       .select()
//       .from(staffs)
//       .where(eq(staffs.staffID, reqBody.staffID))
//       .execute();

//     if (staffExists.length === 0) {
//       return jsonResponse(
//         { error: `Staff with ID ${reqBody.staffID} does not exist.` },
//         400
//       );
//     }
//     const newAppointment = await db
//       .insert(appointments)
//       .values({ ...reqBody, userID: userId }) // Associate appointment with user
//       .returning()
//       .execute();

//     console.log(
//       `Successfully created appointment with ID ${newAppointment[0].appointmentID}`
//     );
//     return jsonResponse(newAppointment[0], 201);
//   } catch (error) {
//     console.error("Error creating appointment:", error);
//     return jsonResponse({ error: "Unable to create appointment" }, 500);
//   }
// }

// // Update appointment by ID with authorization check
// export async function updateAppointment(
//   id: number,
//   reqBody: Partial<Appointment>,
//   userId: number
// ) {
//   try {
//     // Check if the appointment belongs to the user
//     const existingAppointment = await db
//       .select()
//       .from(appointments)
//       .where(
//         eq(appointments.appointmentID, id) && eq(appointments.userID, userId)
//       )
//       .execute();

//     if (existingAppointment.length === 0) {
//       console.log(`Appointment with ID ${id} not found or unauthorized`);
//       return jsonResponse(
//         { error: `Appointment with ID ${id} not found or unauthorized` },
//         403
//       );
//     }

//     const updatedAppointment = await db
//       .update(appointments)
//       .set(reqBody)
//       .where(eq(appointments.appointmentID, id))
//       .returning()
//       .execute();

//     console.log(`Successfully updated appointment with ID ${id}`);
//     return jsonResponse(updatedAppointment[0], 200);
//   } catch (error) {
//     console.error(`Error updating appointment with ID ${id}`, error);
//     return jsonResponse({ error: "Unable to update appointment" }, 500);
//   }
// }
