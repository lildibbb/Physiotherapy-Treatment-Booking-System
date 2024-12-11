import { eq, or, and, asc } from "drizzle-orm";
import db from "../db";
import { jwt } from "@elysiajs/jwt";
import {
  appointments,
  availabilities,
  business_entities,
  patients,
  payments,
  physiotherapists,
  staffs,
  user_authentications,
} from "../schema";
import type {
  Appointment,
  Availability,
  AvailableSlot,
  Payment,
  Staff,
  Therapist,
} from "../../types";
import bcrypt from "bcryptjs";
import jsonResponse from "../services/auth-services";
import {
  calculateDateForDay,
  isMorning,
  isAfternoon,
  addOneHour,
  getDayOfWeek,
  generateWeekDates,
  validateSpecialDate,
} from "./helpers/helper";

export async function getAllTherapistPublic(): Promise<
  Array<{
    therapistID: number;
    name: string;
    specialization: string;
    qualification: string[];
    experience: number | null;
    businessName: string;
    location: string; // Combined city and state
  }>
> {
  try {
    const therapistDetails = await db
      .select({
        therapistID: physiotherapists.therapistID,
        name: physiotherapists.name,
        specialization: physiotherapists.specialization,
        qualification: physiotherapists.qualification,
        experience: physiotherapists.experience,
        businessName: business_entities.companyName,
        city: business_entities.city,
        state: business_entities.state,
      })
      .from(physiotherapists)
      .innerJoin(
        business_entities,
        eq(physiotherapists.businessID, business_entities.businessID)
      )
      .execute();

    const transformedTherapist = therapistDetails.map((therapist) => ({
      ...therapist,
      qualification: Array.isArray(therapist.qualification)
        ? therapist.qualification
        : [],
      location: `${String(therapist.city)}, ${String(therapist.state)}`,
    }));

    return transformedTherapist;
  } catch (error) {
    console.error("Error fetching therapists:", error);
    throw new Error("Error fetching therapists.");
  }
}

//Function to retrieve all staff under business (with Authorization check)
export async function getAllStaffByBusiness(profile: { businessID: number }) {
  //pass the businessID from th decoded token
  const businessID = profile.businessID;
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
  profile: { businessID: number },
  staffID: string
) {
  // Convert staffID to a number
  const staffIDNumber = parseInt(staffID, 10);

  //pass the businessID from decoded token in Endpoint
  const businessID = profile.businessID;

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

  // Step 3: Check if a user with the same email  & contact details already exists to avoid conflicts

  if (reqBody.email || reqBody.contactDetails) {
    const conditions = [];
    if (reqBody.email)
      conditions.push(eq(user_authentications.email, reqBody.email));
    if (reqBody.contactDetails)
      conditions.push(
        eq(user_authentications.contactDetails, reqBody.contactDetails)
      );

    const existingUser = await db
      .select()
      .from(user_authentications)
      .where(or(...conditions))
      .execute();

    if (existingUser.length > 0 && existingUser[0].userID !== userID) {
      const conflictField =
        existingUser[0].contactDetails === reqBody.contactDetails
          ? "Contact details"
          : "Email";
      return jsonResponse(
        {
          error: `${conflictField} is already in use. Please use a different one.`,
        },
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
export async function getAllTherapistByBusiness(profile: {
  businessID: number;
}) {
  // pass the businessID from the decoded token
  const businessID = profile.businessID;

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
      contactDetails: user_authentications.contactDetails,
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
  reqBody: Partial<Therapist>,
  profile: { businessID: number },
  therapistID: string
) {
  const therapistIDNumber = parseInt(therapistID, 10);

  //pass the businessID from the decoded token in Endpoint
  const businessID = profile.businessID;

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

  // Check for existing contact details or email in user_authentications if provided
  if (reqBody.contactDetails || reqBody.email) {
    const conditions = [];
    if (reqBody.contactDetails) {
      conditions.push(
        eq(user_authentications.contactDetails, reqBody.contactDetails)
      );
    }
    if (reqBody.email) {
      conditions.push(eq(user_authentications.email, reqBody.email));
    }

    const existingUser = await db
      .select()
      .from(user_authentications)
      .where(or(...conditions))
      .execute();

    if (existingUser.length > 0 && existingUser[0].userID !== userID) {
      const conflictField =
        existingUser[0].contactDetails === reqBody.contactDetails
          ? "Contact details"
          : "Email";
      return jsonResponse(
        {
          error: `${conflictField} is already in use. Please use a different one.`,
        },
        409
      );
    }
  }

  try {
    const authUpdateFields: Partial<Therapist> = {};
    if (reqBody.email) authUpdateFields.email = reqBody.email;

    if (reqBody.password) {
      const hashedPassword = await bcrypt.hash(reqBody.password, 10);
      authUpdateFields.password = hashedPassword;
    }
    if (reqBody.contactDetails)
      authUpdateFields.contactDetails = reqBody.contactDetails;

    // Update user_authentications table if email or password is provided
    if (Object.keys(authUpdateFields).length > 0) {
      await db
        .update(user_authentications)
        .set(authUpdateFields)
        .where(eq(user_authentications.userID, userID))
        .execute();
    }

    const therapistUpdateFields: Partial<Therapist> = {};
    if (reqBody.name) therapistUpdateFields.name = reqBody.name;
    if (reqBody.specialization)
      therapistUpdateFields.specialization = reqBody.specialization;

    // Update physiotherapists table if specialization, name, or contactDetails is provided
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

// Retrieve all availability information for a therapist
export async function getAvailableSlot(params: {
  therapistID: number;
}): Promise<AvailableSlot[]> {
  const { therapistID } = params;

  try {
    const availableSlots = await db
      .select()
      .from(availabilities)
      .where(eq(availabilities.therapistID, therapistID));
    console.log("avaivle : ", availableSlots);
    console.log("Therapist ID received:", therapistID);

    // Generate the 7 days starting from today (current week)
    const currentWeek = generateWeekDates();

    // Initialize empty object for slots by date
    const slotsByDate = currentWeek.reduce(
      (acc, date) => {
        acc[date] = {
          date: date,
          day: getDayOfWeek(date),
          morning: [],
          afternoon: [],
          unavailable: true, // Assume unavailable by default
        };
        return acc;
      },
      {} as Record<string, AvailableSlot>
    );
    console.log("slotsByDate:", slotsByDate);
    // Process available slots from the DB and mark the respective days as available
    availableSlots.forEach((slot) => {
      // Calculate the date key, either from specialDate or by calculating from the day of the week
      let dateKey = slot.specialDate
        ? validateSpecialDate(slot.specialDate, slot.dayOfWeek)
        : calculateDateForDay(slot.dayOfWeek);

      // If the date is invalid (either past or doesn't align with the day), just continue
      // This ensures that we don't skip the day, just mark it unavailable if the date is invalid
      if (!dateKey) {
        // If the special date is invalid, skip that specific slot but don't skip the whole week
        dateKey = calculateDateForDay(slot.dayOfWeek);
      }
      console.log("Valid dateKey: ", dateKey);
      // Mark the day as available only if there's a start and end time
      if (slot.startTime && slot.endTime && slot.isAvailable === 1) {
        if (!slotsByDate[dateKey]) {
          slotsByDate[dateKey] = {
            date: dateKey,
            day: slot.dayOfWeek,
            morning: [],
            afternoon: [],
            unavailable: false, // Mark available
          };
        }

        let currentTime = slot.startTime;
        while (currentTime < slot.endTime) {
          if (isMorning(currentTime)) {
            slotsByDate[dateKey].morning.push(currentTime);
          } else if (isAfternoon(currentTime)) {
            slotsByDate[dateKey].afternoon.push(currentTime);
          }
          currentTime = addOneHour(currentTime);
        }
      }
    });

    console.log("Fetched data for therapist:", therapistID, availableSlots);

    return Object.values(slotsByDate);
  } catch (error) {
    console.error("Error fetching availability slots:", error);
    throw new Error("Error fetching availability slots");
  }
}
export async function getTherapistByID(
  therapistID: number
): Promise<Therapist> {
  try {
    const therapistDetail = await db
      .select({
        therapistID: physiotherapists.therapistID,
        name: physiotherapists.name,
        specialization: physiotherapists.specialization,
        qualification: physiotherapists.qualification,
        experience: physiotherapists.experience,
        businessName: business_entities.companyName,
        city: business_entities.city,
        state: business_entities.state,
      })
      .from(physiotherapists)
      .innerJoin(
        business_entities,
        eq(physiotherapists.businessID, business_entities.businessID)
      )
      .where(eq(physiotherapists.therapistID, therapistID)) // Filter by therapist ID
      .execute();

    if (!therapistDetail || therapistDetail.length === 0) {
      throw new Error(`Therapist with ID ${therapistID} not found.`);
    }

    // Since you expect only one therapist, access the first result (index 0)
    const therapist = therapistDetail[0];

    const transformedTherapist: Therapist = {
      therapistID: therapist.therapistID,
      name: therapist.name,
      specialization: therapist.specialization,
      qualification: Array.isArray(therapist.qualification)
        ? therapist.qualification
        : [],
      experience: therapist.experience,
      businessName: therapist.businessName, // Include businessName if needed
      location: `${String(therapist.city)}, ${String(therapist.state)}`,
    };

    return transformedTherapist;
  } catch (error) {
    console.error("Error fetching therapist by ID:", error);
    throw new Error(`Error fetching therapist with ID ${therapistID}.`);
  }
}

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

//TODO : UI for updating availability
export async function updateAvailability(
  reqBody: Partial<Availability>,
  profile: { therapistID: number }
) {
  // pass the therapistID from the decoded token
  const therapistID = profile.therapistID;
  console.log("Therapist ID received:", therapistID);
  if (!therapistID) {
    return jsonResponse(
      { error: "Only authorised user can update availability" },
      403
    );
  }

  try {
    const availbilityUpdateFields: Partial<Availability> = {};
    if (reqBody.dayOfWeek)
      availbilityUpdateFields.dayOfWeek = reqBody.dayOfWeek;
    if (reqBody.startTime)
      availbilityUpdateFields.startTime = reqBody.startTime;
    if (reqBody.endTime) availbilityUpdateFields.endTime = reqBody.endTime;
    if (reqBody.isAvailable !== undefined)
      availbilityUpdateFields.isAvailable = reqBody.isAvailable ? 1 : 0;
    if (reqBody.specialDate)
      availbilityUpdateFields.specialDate = reqBody.specialDate;

    if (Object.keys(availbilityUpdateFields).length > 0) {
      await db
        .update(availabilities)
        .set(availbilityUpdateFields)
        .where(eq(availabilities.therapistID, therapistID))
        .execute();
    }
    return jsonResponse({ message: "Availability updated successfully" }, 200);
  } catch (error) {
    console.error("Error updating availability:", error);
    return jsonResponse({ message: "Error updating availability", error }, 500);
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

// // Function to retrieve all appointments - can add filtering by user if needed
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
