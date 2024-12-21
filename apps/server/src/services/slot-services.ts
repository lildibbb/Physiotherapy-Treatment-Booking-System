import { eq } from "drizzle-orm";
import type { Availability, AvailableSlot } from "../../types";
import db from "../db";
import { availabilities } from "../schema";
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
