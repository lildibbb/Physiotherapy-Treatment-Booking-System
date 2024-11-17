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
