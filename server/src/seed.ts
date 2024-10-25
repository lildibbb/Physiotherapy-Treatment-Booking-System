import db from "./db"; // Adjusted import to go up one directory
import { hospitals } from "./schema";
import { staffs } from "./schema";
import { patients } from "./schema";
import { physiotherapists } from "./schema";
import { appointments } from "./schema";
import { treatment_plans } from "./schema";
import { exercises } from "./schema";

async function seed() {
  try {
    // Insert into hospitals
    await db.insert(hospitals).values([
      {
        hospitalID: 1,
        name: "City Hospital",
        location: "123 Main St, Springfield",
      },
    ]);

    // Insert into staffs
    await db
      .insert(staffs)
      .values([
        { staffID: 1, name: "Alice Smith", role: "Nurse", hospitalID: 1 },
      ]);

    // Insert into patients
    await db.insert(patients).values([
      {
        patientID: 1,
        name: "John Doe",
        contactDetails: "123-456-7890",
        dob: "1990-01-01", // Date as a string
        gender: "M",
        address: "456 Elm St, Springfield",
      },
    ]);

    // Insert into physiotherapists
    await db.insert(physiotherapists).values([
      {
        therapistID: 1,
        name: "Dr. Jane Wilson",
        specialization: "Sports Medicine",
        contactDetails: "987-654-3210",
        hospitalID: 1,
      },
    ]);

    // Insert into appointments
    await db.insert(appointments).values([
      {
        appointmentID: 1,
        appointmentDate: "2024-10-20", // Date as a string
        time: "09:00",
        status: "Scheduled",
        patientID: 1,
        therapistID: 1,
        staffID: 1,
      },
    ]);

    // Insert into treatment_plans
    await db.insert(treatment_plans).values([
      {
        planID: 1,
        description: "Rehabilitation after knee surgery",
        startDate: "2024-10-20", // Date as a string
        endDate: "2025-01-20", // Date as a string
        patientID: 1,
      },
    ]);

    // Insert into exercises
    await db.insert(exercises).values([
      {
        exerciseID: 1,
        name: "Quadriceps Stretch",
        description: "A stretch for the quadriceps muscle.",
        planID: 1,
      },
    ]);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

// Execute the seed function
seed();
