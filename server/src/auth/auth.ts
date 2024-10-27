import bcrypt from "bcryptjs"; // For hashing and comparing passwords
import db from "../db";
import { user_authentications, patients, staffs, hospitals } from "../schema";
import type { PatientRegistration, StaffRegistration } from "../../types";
import type { UserRegistration, UserLogin } from "../../types";
import type { HospitalRegistration } from "../../types";

import { eq } from "drizzle-orm";

// Helper function for consistent response formatting
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

// User Registration
export async function registerUser(reqBody: UserRegistration) {
  // Validate the request body for required fields
  if (!reqBody.email || !reqBody.password) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }
  // Check if a user with the same email already exists
  const existingUser = await db
    .select()
    .from(user_authentications)
    .where(eq(user_authentications.email, reqBody.email))
    .execute();

  if (existingUser.length > 0) {
    return jsonResponse(
      { error: "Email is already in use. Please use a different email." },
      409 // 409 Conflict
    );
  }
  const hashedPassword = await bcrypt.hash(reqBody.password, 10); // Hash the password with bcrypt
  try {
    const newUser = await db
      .insert(user_authentications)
      .values({
        email: reqBody.email,
        password: hashedPassword,
        role: reqBody.role || "user",
        associatedID: reqBody.associatedID ?? null,
        name: reqBody.name ?? null,
        avatar: reqBody.avatar ?? null, // Add avatar for profile images (can be nullable)
      })
      .returning()
      .execute();

    return jsonResponse(newUser[0], 201);
  } catch (error) {
    console.error("Error registering user:", error);
    return jsonResponse({ message: "Error registering user", error }, 500);
  }
}

export async function loginUser(reqBody: UserLogin) {
  if (!reqBody.email || !reqBody.password) {
    return { error: "Missing required fields", status: 400 };
  }

  const user = await db
    .select()
    .from(user_authentications)
    .where(eq(user_authentications.email, reqBody.email))
    .execute();

  if (user.length === 0) {
    return { error: "Invalid credentials", status: 401 };
  }

  const { password: hashedPassword, userID, email } = user[0];

  const passwordMatches = await bcrypt.compare(
    reqBody.password,
    hashedPassword
  );

  if (!passwordMatches) {
    return { error: "Invalid credentials", status: 401 };
  }

  // Return user details without the token (token will be generated in the login route)
  return { id: userID, email, status: 200 };
}

// Register Patient
export async function registerPatient(reqBody: PatientRegistration) {
  const { email, password, name, contactDetails, dob, gender, address } =
    reqBody;

  const existingUser = await db
    .select()
    .from(user_authentications)
    .where(eq(user_authentications.email, email))
    .execute();

  if (existingUser.length > 0) {
    return jsonResponse({ error: "Email is already in use." }, 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await db
      .insert(user_authentications)
      .values({
        email,
        password: hashedPassword,
        role: "patient",
        name,
        associatedID: null, // Will update this after patient is created
      })
      .returning()
      .execute();

    const userID = newUser[0].userID;

    const newPatient = await db
      .insert(patients)
      .values({
        name,
        contactDetails,
        dob,
        gender,
        address,
      })
      .returning()
      .execute();

    await db
      .update(user_authentications)
      .set({ associatedID: newPatient[0].patientID.toString() })
      .where(eq(user_authentications.userID, userID))
      .execute();

    return jsonResponse({ message: "Patient registered successfully" }, 201);
  } catch (error) {
    console.error("Error registering patient:", error);
    return jsonResponse({ error: "Unable to register patient" }, 500);
  }
}

// Register Staff
export async function registerStaff(reqBody: StaffRegistration) {
  const { email, password, name, role, hospitalID } = reqBody;

  const existingUser = await db
    .select()
    .from(user_authentications)
    .where(eq(user_authentications.email, email))
    .execute();

  if (existingUser.length > 0) {
    return jsonResponse({ error: "Email is already in use." }, 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await db
      .insert(user_authentications)
      .values({
        email,
        password: hashedPassword,
        role: "staff",
        name,
        associatedID: null, // Will update this after staff is created
      })
      .returning()
      .execute();

    const userID = newUser[0].userID;

    const newStaff = await db
      .insert(staffs)
      .values({
        name,
        role,
        hospitalID,
      })
      .returning()
      .execute();

    await db
      .update(user_authentications)
      .set({ associatedID: newStaff[0].staffID.toString() })
      .where(eq(user_authentications.userID, userID))
      .execute();

    return jsonResponse({ message: "Staff registered successfully" }, 201);
  } catch (error) {
    console.error("Error registering staff:", error);
    return jsonResponse({ error: "Unable to register staff" }, 500);
  }
}

// Register Hospital
export async function registerHospital(reqBody: HospitalRegistration) {
  const { name, location, longitude, latitude, avatar } = reqBody;

  try {
    const newHospital = await db
      .insert(hospitals)
      .values({
        name,
        location,
        longitude,
        latitude,
        avatar: avatar || null, // If avatar is provided, use it; otherwise, set to null
      })
      .returning()
      .execute();

    console.log(
      `Successfully registered hospital with ID ${newHospital[0].hospitalID}`
    );
    return jsonResponse(
      { message: "Hospital registered successfully", hospital: newHospital[0] },
      201
    );
  } catch (error) {
    console.error("Error registering hospital:", error);
    return jsonResponse({ error: "Unable to register hospital" }, 500);
  }
}
