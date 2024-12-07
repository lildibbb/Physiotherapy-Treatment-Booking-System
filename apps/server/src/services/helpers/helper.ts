export function calculateDateForDay(dayOfWeek: string): string {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date();
  const todayIndex = today.getDay(); // Returns 0 for Sunday, 1 for Monday, etc.
  const targetIndex = daysOfWeek.indexOf(dayOfWeek);

  if (targetIndex === -1) {
    throw new Error(`Invalid day of week: ${dayOfWeek}`);
  }

  let daysUntilTarget = targetIndex - todayIndex;
  if (daysUntilTarget < 0) {
    // If the target day is earlier in the week, calculate for next week
    daysUntilTarget += 7;
  }

  const targetDate = new Date();
  targetDate.setDate(today.getDate() + daysUntilTarget);

  return targetDate.toISOString().split("T")[0]; // Return the date in YYYY-MM-DD format
}

export function isMorning(time: string): boolean {
  return time >= "06:00" && time < "12:00";
}

export function isAfternoon(time: string): boolean {
  return time >= "12:00" && time < "18:00";
}
export function addOneHour(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const newHour = hour + 1;
  return `${newHour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

// Generate the next 7 days starting from today
export function generateWeekDates(): string[] {
  const today = new Date();

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const weekDay = new Date(today);
    weekDay.setDate(today.getDate() + i); // Move to the next day in the week
    weekDates.push(weekDay.toISOString().split("T")[0]); // Convert to YYYY-MM-DD format
  }
  console.log("weekdat =e:", weekDates);
  return weekDates;
}

// Get the name of the day of the week from a date (e.g., "Monday")
export function getDayOfWeek(date: string): string {
  const dayOfWeek = new Date(date).getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[dayOfWeek];
}

// Helper function to validate specialDate alignment and check if it's valid (not in the past)
export function validateSpecialDate(
  specialDate: string,
  dayOfWeek: string
): string | null {
  const specialDateObj = new Date(specialDate);
  const today = new Date();

  // Check if the specialDate is in the past
  if (specialDateObj < today) {
    console.log(`Special date ${specialDate} is in the past. Ignoring...`);
    return null; // Return null to skip this date
  }

  // Check if the specialDate corresponds to the correct day of the week
  const specialDateDayOfWeek = specialDateObj.getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const expectedDayIndex = daysOfWeek.indexOf(dayOfWeek);

  if (specialDateDayOfWeek !== expectedDayIndex) {
    console.log(
      `Special date ${specialDate} does not align with the expected day (${dayOfWeek}). Ignoring...`
    );
    return null; // Return null to skip this date
  }

  return specialDate; // If it's valid, return the date
}
