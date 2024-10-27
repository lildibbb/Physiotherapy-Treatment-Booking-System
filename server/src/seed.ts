import db from "./db"; // Adjusted import to go up one directory
import {
  hospitals,
  staffs,
  patients,
  physiotherapists,
  appointments,
  treatment_plans,
  exercises,
  user_authentications,
} from "./schema";

async function seed() {
  try {
    // Insert into user_authentications
    await db.insert(user_authentications).values([
      {
        userID: 1,
        email: "johndoe1@example.com",
        password: "hashedpassword123",
        role: "patient",
        associatedID: "1",
        name: "John Doe",
        avatar: "avatar-url-1.png",
      },
      {
        userID: 2,
        email: "janedoe@example.com",
        password: "hashedpassword123",
        role: "patient",
        associatedID: "2",
        name: "Jane Doe",
        avatar: "avatar-url-2.png",
      },
      {
        userID: 3,
        email: "mikesmith@example.com",
        password: "hashedpassword123",
        role: "therapist",
        associatedID: "3",
        name: "Mike Smith",
        avatar: "avatar-url-3.png",
      },
      {
        userID: 4,
        email: "alicejones@example.com",
        password: "hashedpassword123",
        role: "staff",
        associatedID: "4",
        name: "Alice Jones",
        avatar: "avatar-url-4.png",
      },
      {
        userID: 5,
        email: "robertjohnson@example.com",
        password: "hashedpassword123",
        role: "patient",
        associatedID: "5",
        name: "Robert Johnson",
        avatar: "avatar-url-5.png",
      },
      {
        userID: 6,
        email: "marywhite@example.com",
        password: "hashedpassword123",
        role: "therapist",
        associatedID: "6",
        name: "Mary White",
        avatar: "avatar-url-6.png",
      },
      {
        userID: 7,
        email: "jamesbrown@example.com",
        password: "hashedpassword123",
        role: "staff",
        associatedID: "7",
        name: "James Brown",
        avatar: "avatar-url-7.png",
      },
      {
        userID: 8,
        email: "sarawilson@example.com",
        password: "hashedpassword123",
        role: "patient",
        associatedID: "8",
        name: "Sara Wilson",
        avatar: "avatar-url-8.png",
      },
      {
        userID: 9,
        email: "davidlee@example.com",
        password: "hashedpassword123",
        role: "patient",
        associatedID: "9",
        name: "David Lee",
        avatar: "avatar-url-9.png",
      },
      {
        userID: 10,
        email: "emilyclark@example.com",
        password: "hashedpassword123",
        role: "therapist",
        associatedID: "10",
        name: "Emily Clark",
        avatar: "avatar-url-10.png",
      },
    ]);

    // Insert into hospitals (located in Jitra, Kedah)
    await db.insert(hospitals).values([
      {
        hospitalID: 1,
        name: "Jitra General Hospital",
        location: "101 Main St, Jitra, Kedah",
        longitude: "100.4311",
        latitude: "6.2684",
      },
      {
        hospitalID: 2,
        name: "Jitra Medical Center",
        location: "102 Main St, Jitra, Kedah",
        longitude: "100.4321",
        latitude: "6.2691",
      },
      {
        hospitalID: 3,
        name: "Jitra Specialist Hospital",
        location: "103 Main St, Jitra, Kedah",
        longitude: "100.4331",
        latitude: "6.2701",
      },
      {
        hospitalID: 4,
        name: "Kedah Community Hospital",
        location: "104 Main St, Jitra, Kedah",
        longitude: "100.4341",
        latitude: "6.2711",
      },
      {
        hospitalID: 5,
        name: "Alor Setar Clinic",
        location: "105 Main St, Jitra, Kedah",
        longitude: "100.4351",
        latitude: "6.2721",
      },
      {
        hospitalID: 6,
        name: "Jitra Family Health Center",
        location: "106 Main St, Jitra, Kedah",
        longitude: "100.4361",
        latitude: "6.2731",
      },
      {
        hospitalID: 7,
        name: "Jitra Women's Hospital",
        location: "107 Main St, Jitra, Kedah",
        longitude: "100.4371",
        latitude: "6.2741",
      },
      {
        hospitalID: 8,
        name: "Kedah Children's Hospital",
        location: "108 Main St, Jitra, Kedah",
        longitude: "100.4381",
        latitude: "6.2751",
      },
      {
        hospitalID: 9,
        name: "Jitra Mental Health Institute",
        location: "109 Main St, Jitra, Kedah",
        longitude: "100.4391",
        latitude: "6.2761",
      },
      {
        hospitalID: 10,
        name: "Jitra Rehab Center",
        location: "110 Main St, Jitra, Kedah",
        longitude: "100.4401",
        latitude: "6.2771",
      },
    ]);

    // Insert into staffs
    await db.insert(staffs).values([
      { staffID: 1, name: "Alice Smith", role: "Nurse", hospitalID: 1 },
      { staffID: 2, name: "Bob Johnson", role: "Technician", hospitalID: 2 },
      { staffID: 3, name: "Carol White", role: "Receptionist", hospitalID: 3 },
      { staffID: 4, name: "David Lee", role: "Accountant", hospitalID: 4 },
      { staffID: 5, name: "Emma Clark", role: "Manager", hospitalID: 5 },
      { staffID: 6, name: "Frank Brown", role: "Nurse", hospitalID: 6 },
      { staffID: 7, name: "Grace Green", role: "Technician", hospitalID: 7 },
      { staffID: 8, name: "Hank Taylor", role: "Receptionist", hospitalID: 8 },
      { staffID: 9, name: "Ivy Wilson", role: "Accountant", hospitalID: 9 },
      { staffID: 10, name: "Jack Black", role: "Manager", hospitalID: 10 },
    ]);

    // Insert into patients
    await db.insert(patients).values([
      {
        patientID: 1,
        name: "John Doe",
        contactDetails: "123-456-7890",
        dob: "1990-01-01",
        gender: "M",
        address: "456 Elm St, Jitra, Kedah",
      },
      {
        patientID: 2,
        name: "Jane Doe",
        contactDetails: "123-456-7891",
        dob: "1992-02-02",
        gender: "F",
        address: "457 Elm St, Jitra, Kedah",
      },
      {
        patientID: 3,
        name: "Mike Brown",
        contactDetails: "123-456-7892",
        dob: "1988-03-03",
        gender: "M",
        address: "458 Elm St, Jitra, Kedah",
      },
      {
        patientID: 4,
        name: "Emily Davis",
        contactDetails: "123-456-7893",
        dob: "1991-04-04",
        gender: "F",
        address: "459 Elm St, Jitra, Kedah",
      },
      {
        patientID: 5,
        name: "Robert Wilson",
        contactDetails: "123-456-7894",
        dob: "1985-05-05",
        gender: "M",
        address: "460 Elm St, Jitra, Kedah",
      },
      {
        patientID: 6,
        name: "Sarah Lee",
        contactDetails: "123-456-7895",
        dob: "1994-06-06",
        gender: "F",
        address: "461 Elm St, Jitra, Kedah",
      },
      {
        patientID: 7,
        name: "David Kim",
        contactDetails: "123-456-7896",
        dob: "1986-07-07",
        gender: "M",
        address: "462 Elm St, Jitra, Kedah",
      },
      {
        patientID: 8,
        name: "Jessica Park",
        contactDetails: "123-456-7897",
        dob: "1993-08-08",
        gender: "F",
        address: "463 Elm St, Jitra, Kedah",
      },
      {
        patientID: 9,
        name: "Thomas Lee",
        contactDetails: "123-456-7898",
        dob: "1987-09-09",
        gender: "M",
        address: "464 Elm St, Jitra, Kedah",
      },
      {
        patientID: 10,
        name: "Laura Martinez",
        contactDetails: "123-456-7899",
        dob: "1989-10-10",
        gender: "F",
        address: "465 Elm St, Jitra, Kedah",
      },
    ]);

    // Insert into physiotherapists
    await db.insert(physiotherapists).values([
      {
        therapistID: 1,
        name: "Dr. Sarah Lee",
        specialization: "Sports Medicine",
        contactDetails: "987-654-3210",
        hospitalID: 1,
      },
      // ... more physiotherapists up to 10
    ]);

    // Insert into appointments
    await db.insert(appointments).values([
      {
        appointmentID: 1,
        appointmentDate: "2024-10-21",
        time: "09:00",
        status: "Scheduled",
        patientID: 1,
        therapistID: 1,
        staffID: 1,
        userID: 1,
      },
    ]);
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

// Execute the seed function
seed();
