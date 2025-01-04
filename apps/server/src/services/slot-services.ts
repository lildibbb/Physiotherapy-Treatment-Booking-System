import { eq, inArray } from "drizzle-orm";
import type { Availability, AvailableSlot, Therapist } from "../../types";
import db from "../db";
import {
  availabilities,
  physiotherapists,
  staffs,
  user_authentications,
} from "../schema";
import {
  generateWeekDates,
  getDayOfWeek,
  validateSpecialDate,
  calculateDateForDay,
  isMorning,
  isAfternoon,
  addOneHour,
} from "./helpers/helper";
import jsonResponse from "./auth-services";

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
    console.log("Available Slots:", availableSlots);
    console.log("Therapist ID received:", therapistID);

    // Generate the 7 days starting from today (current week) in UTC
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
    console.log("Initial slotsByDate:", slotsByDate);

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
      console.log("Valid dateKey:", dateKey);

      // Mark the day as available only if there's a start and end time
      if (slot.startTime && slot.endTime && slot.isAvailable === 1) {
        if (!slotsByDate[dateKey]) {
          slotsByDate[dateKey] = {
            date: dateKey,
            day: getDayOfWeek(dateKey), // Ensure consistency by deriving from dateKey
            morning: [],
            afternoon: [],
            unavailable: false, // Mark available
          };
          console.log(`Initialized AvailableSlot for ${dateKey}`);
        } else {
          slotsByDate[dateKey].unavailable = false; // Mark as available
          console.log(`Marked ${dateKey} as available`);
        }

        let currentTime = slot.startTime;
        while (currentTime < slot.endTime) {
          if (isMorning(currentTime)) {
            slotsByDate[dateKey].morning.push(currentTime);
            console.log(`Added morning slot ${currentTime} to ${dateKey}`);
          } else if (isAfternoon(currentTime)) {
            slotsByDate[dateKey].afternoon.push(currentTime);
            console.log(`Added afternoon slot ${currentTime} to ${dateKey}`);
          }
          currentTime = addOneHour(currentTime);
        }
      } else {
        console.log(
          `Slot is unavailable or missing times: ${JSON.stringify(slot)}`
        );
      }
    });

    console.log("Final slotsByDate:", slotsByDate);
    return Object.values(slotsByDate);
  } catch (error) {
    console.error("Error fetching availability slots:", error);
    throw new Error("Error fetching availability slots");
  }
}
export async function getAvailability(profile: { staffID: number }) {
  const staffID = profile.staffID;
  console.log("Staff ID received:", staffID);

  // Step 1: Validate the staffID
  if (!staffID) {
    return jsonResponse({ error: "Invalid staff ID" }, 400);
  }

  try {
    // Step 2: Retrieve the businessID for the given staffID
    const staffRecords = await db
      .select({ businessID: staffs.businessID })
      .from(staffs)
      .where(eq(staffs.staffID, staffID))
      .execute();

    if (staffRecords.length === 0) {
      return jsonResponse({ error: "businessID not found" }, 404);
    }

    const businessID = staffRecords[0].businessID;
    console.log("Business ID retrieved:", businessID);

    // Step 3: Fetch all therapists associated with the businessID
    const therapistData: Therapist[] = await db
      .select({
        therapistID: physiotherapists.therapistID,
        name: user_authentications.name,
        contactDetails: user_authentications.contactDetails,
      })
      .from(physiotherapists)
      .innerJoin(
        user_authentications,
        eq(physiotherapists.userID, user_authentications.userID)
      )
      .where(eq(physiotherapists.businessID, businessID))
      .execute();

    console.log("Therapist Data:", therapistData);

    // Step 4: Extract all therapistIDs
    const therapistIDs = therapistData.map(
      (therapist) => therapist.therapistID
    );
    console.log("Therapist IDs:", therapistIDs);

    if (therapistIDs.length === 0) {
      return jsonResponse(
        { message: "No therapists found for this business." },
        200
      );
    }

    // Step 5: Retrieve all availability records for the extracted therapistIDs
    const availabilityData: Availability[] = await db
      .select({
        availabilityID: availabilities.availabilityID,
        therapistID: availabilities.therapistID,
        dayOfWeek: availabilities.dayOfWeek,
        startTime: availabilities.startTime,
        endTime: availabilities.endTime,
        isAvailable: availabilities.isAvailable,
        specialDate: availabilities.specialDate,
      })
      .from(availabilities)
      .where(inArray(availabilities.therapistID, therapistIDs))
      .execute();

    console.log("Availability Data:", availabilityData);

    // Step 6: Organize availability data by therapistID
    const availabilityByTherapist: Record<number, Availability[]> = {};

    availabilityData.forEach((availability) => {
      if (!availabilityByTherapist[availability.therapistID]) {
        availabilityByTherapist[availability.therapistID] = [];
      }
      availabilityByTherapist[availability.therapistID].push(availability);
    });

    // Step 7: Combine therapist data with their respective availability
    const therapistDataWithAvailability = therapistData.map((therapist) => ({
      ...therapist,
      availability: availabilityByTherapist[therapist.therapistID] || [],
    }));

    // Step 8: Return the aggregated data
    return jsonResponse({ TherapistData: therapistDataWithAvailability }, 200);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return jsonResponse(
      { error: "Error fetching availability", detail: error },
      500
    );
  }
}
//TODO : UI for updating availability
export async function updateAvailability(
  reqBody: Partial<Availability>,
  profile: { staffID: number }
) {
  // pass the therapistID from the decoded token
  const therapistID = reqBody.therapistID;
  const staffID = profile.staffID;
  console.log("staffID received:", staffID);
  console.log("Therapist ID received:", therapistID);

  if (!therapistID) {
    return jsonResponse({ error: "Invalid therapist ID" }, 400);
  }
  if (!staffID) {
    return jsonResponse({ error: "Invalid staff ID" }, 400);
  }

  const getBusinessIDfromStaff = await db
    .select({ businessID: staffs.businessID })
    .from(staffs)
    .where(eq(staffs.staffID, staffID))
    .execute();
  const staffBusinessID = getBusinessIDfromStaff[0].businessID;
  console.log("staffBusinessID:", staffBusinessID);

  const getTherapistIDfromBusiness = await db
    .select({ businessID: physiotherapists.businessID })
    .from(physiotherapists)
    .where(eq(physiotherapists.therapistID, therapistID))
    .execute();
  const therapistBusinessID = getTherapistIDfromBusiness[0].businessID;

  console.log("therapistBusinessID:", therapistBusinessID);

  if (staffBusinessID !== therapistBusinessID) {
    return jsonResponse(
      { error: "Only authorised user can update availability" },
      403
    );
  }

  try {
    const availabilityResult = await db
      .select({ availabilityID: availabilities.availabilityID })
      .from(availabilities)
      .where(eq(availabilities.therapistID, therapistID))
      .execute();
    console.log("availabilityResult:", availabilityResult);
    const availabilityIDArray: number[] = availabilityResult.map(
      (result) => result.availabilityID
    );

    console.log("Availability ID received:", availabilityIDArray);
    const availabilityID = reqBody.availabilityID;
    console.log("Availability ID received:", availabilityID);
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
        .where(eq(availabilities.availabilityID, availabilityID!))
        .execute();
    }
    return jsonResponse({ message: "Availability updated successfully" }, 200);
  } catch (error) {
    console.error("Error updating availability:", error);
    return jsonResponse({ message: "Error updating availability", error }, 500);
  }
}
// export async function updateBatchAvailability(
//   reqBody: Partial<Availability>[],
//   profile: { staffID: number }
// ) {
//   const staffID = profile.staffID;
//   console.log("staffID received:", staffID);

//   if (!Array.isArray(reqBody) || reqBody.length === 0) {
//     return jsonResponse(
//       { error: "Invalid payload format or empty array" },
//       400
//     );
//   }

//   try {
//     // Begin a transaction to ensure atomicity
//     await db.transaction(async (tx) => {
//       for (const slot of reqBody) {
//         const therapistID = slot.therapistID;
//         console.log("Therapist ID received:", therapistID);

//         if (!therapistID) {
//           throw { status: 400, message: "Invalid therapist ID" };
//         }

//         // Fetch business IDs
//         const getBusinessIDfromStaff = await tx
//           .select({ businessID: staffs.businessID })
//           .from(staffs)
//           .where(eq(staffs.staffID, staffID))
//           .execute();

//         if (getBusinessIDfromStaff.length === 0) {
//           throw { status: 400, message: "Staff not found" };
//         }

//         const staffBusinessID = getBusinessIDfromStaff[0].businessID;
//         console.log("staffBusinessID:", staffBusinessID);

//         const getTherapistIDfromBusiness = await tx
//           .select({ businessID: physiotherapists.businessID })
//           .from(physiotherapists)
//           .where(eq(physiotherapists.therapistID, therapistID))
//           .execute();

//         if (getTherapistIDfromBusiness.length === 0) {
//           throw {
//             status: 400,
//             message: `Therapist ID ${therapistID} not found`,
//           };
//         }

//         const therapistBusinessID = getTherapistIDfromBusiness[0].businessID;
//         console.log("therapistBusinessID:", therapistBusinessID);

//         if (staffBusinessID !== therapistBusinessID) {
//           throw {
//             status: 403,
//             message: "Only authorised user can update availability",
//           };
//         }

//         // Validate the availability slot
//         const availabilityResult = await tx
//           .select({ availabilityID: availabilities.availabilityID })
//           .from(availabilities)
//           .where(eq(availabilities.therapistID, therapistID))
//           .execute();

//         if (availabilityResult.length === 0) {
//           throw {
//             status: 400,
//             message: `No availabilities found for therapist ID ${therapistID}`,
//           };
//         }

//         const availabilityIDArray: number[] = availabilityResult.map(
//           (result) => result.availabilityID
//         );

//         const availabilityID = slot.availabilityID;
//         console.log("Availability ID received:", availabilityID);

//         if (!availabilityID || !availabilityIDArray.includes(availabilityID)) {
//           throw {
//             status: 400,
//             message: `Invalid availability ID ${availabilityID} for therapist ID ${therapistID}`,
//           };
//         }

//         const availabilityUpdateFields: Partial<Availability> = {};
//         if (slot.dayOfWeek) availabilityUpdateFields.dayOfWeek = slot.dayOfWeek;
//         if (slot.startTime) availabilityUpdateFields.startTime = slot.startTime;
//         if (slot.endTime) availabilityUpdateFields.endTime = slot.endTime;
//         if (slot.isAvailable !== undefined)
//           availabilityUpdateFields.isAvailable = slot.isAvailable ? 1 : 0;
//         if (slot.specialDate !== undefined)
//           availabilityUpdateFields.specialDate = slot.specialDate;

//         if (Object.keys(availabilityUpdateFields).length > 0) {
//           await tx
//             .update(availabilities)
//             .set(availabilityUpdateFields)
//             .where(eq(availabilities.availabilityID, availabilityID))
//             .execute();
//         }
//       }
//     });

//     return jsonResponse({ message: "Batch update successful" }, 200);
//   } catch (error: any) {
//     console.error("Error updating availability:", error);
//     if (error.status && error.message) {
//       return jsonResponse({ error: error.message }, error.status);
//     }
//     return jsonResponse({ message: "Error updating availability", error }, 500);
//   }
// }
