import bcrypt from "bcryptjs"; // For hashing and comparing passwords
import db from "../db";
import {
  user_authentications,
  patients,
  business_entities,
  staffs,
  physiotherapists,
} from "../schema";
import type {
  BusinessRegistration,
  StaffRegistration,
  TherapistRegistration,
  UserLogin,
} from "../../types";
import type { UserRegistration } from "../../types";
import { jwt } from "@elysiajs/jwt";
import { eq } from "drizzle-orm";

// Helper function for consistent response formatting
export default function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

// User Registration
export async function registerUser(reqBody: UserRegistration) {
  // Validate the request body for required fields
  if (!reqBody.email || !reqBody.password || !reqBody.name) {
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
    // Insert into user_authentications table
    const newUser = await db
      .insert(user_authentications)
      .values({
        email: reqBody.email,
        password: hashedPassword,
        role: reqBody.role || "patient", // default role for patient
      })
      .returning()
      .execute();

    const userId = newUser[0].userID;

    // Insert into patients table with the associated userID and default values
    await db
      .insert(patients)
      .values({
        userID: userId, // link patient to the user_authentications entry
        name: reqBody.name,
        contactDetails: null, // set optional fields to null or default values
        dob: null,
        gender: null,
        address: null,
      })
      .returning()
      .execute();

    return jsonResponse(
      { message: "User and patient profile created successfully" },
      201
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return jsonResponse({ message: "Error registering user", error }, 500);
  }
}

export async function registerBusiness(reqBody: BusinessRegistration) {
  // Validate required fields
  if (
    !reqBody.personInChargeName ||
    !reqBody.contactEmail ||
    !reqBody.contactPhone ||
    !reqBody.companyName ||
    !reqBody.businessRegistrationNumber ||
    !reqBody.contractSigneeName ||
    !reqBody.contractSigneeNRIC ||
    !reqBody.businessAddress ||
    !reqBody.state ||
    !reqBody.city ||
    !reqBody.postalCode
  ) {
    return { error: "Missing required fields", status: 400 };
  }

  // Check if a user with the same email already exists
  const existingUser = await db
    .select()
    .from(user_authentications)
    .where(eq(user_authentications.email, reqBody.contactEmail))
    .execute();

  if (existingUser.length > 0) {
    return jsonResponse(
      { error: "Email is already in use. Please use a different email." },
      409 // 409 Conflict
    );
  }

  try {
    // Hash the default password for security
    const hashedPassword = await bcrypt.hash("business123", 10);

    // Insert into user_authentications table
    const newBusinessUser = await db
      .insert(user_authentications)
      .values({
        email: reqBody.contactEmail,
        password: hashedPassword,
        role: "business",
      })
      .returning()
      .execute();

    const userId = newBusinessUser[0].userID;

    // Insert into business_entities table
    const newBusiness = await db
      .insert(business_entities)
      .values({
        userID: userId,
        personInChargeName: reqBody.personInChargeName,
        contactEmail: reqBody.contactEmail,
        contactPhone: reqBody.contactPhone,
        companyName: reqBody.companyName,
        businessRegistrationNumber: reqBody.businessRegistrationNumber,
        contractSigneeName: reqBody.contractSigneeName,
        contractSigneeNRIC: reqBody.contractSigneeNRIC,
        businessAddress: reqBody.businessAddress,
        state: reqBody.state,
        city: reqBody.city,
        postalCode: reqBody.postalCode,
      })
      .returning()
      .execute();

    return jsonResponse(
      { message: "Business registration successful", business: newBusiness[0] },
      201
    );
  } catch (error) {
    console.error("Error registering business:", error);
    return jsonResponse(
      { error: "Error registering business", detail: error },
      500
    );
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

  const { password: hashedPassword, userID, email, role } = user[0];

  const passwordMatches = await bcrypt.compare(
    reqBody.password,
    hashedPassword
  );

  if (!passwordMatches) {
    return { error: "Invalid credentials", status: 401 };
  }
  // Fetch businessID if the user is a business account
  let businessID = null;
  if (role === "business") {
    const business = await db
      .select()
      .from(business_entities)
      .where(eq(business_entities.userID, userID))
      .execute();

    if (business.length > 0) {
      businessID = business[0].businessID;
    }
  }

  // Return user details without the token (token will be generated in the login route)
  return { id: userID, email, businessID, status: 200 };
}

export async function registerStaff(
  reqBody: StaffRegistration,
  jwt: any,
  token: string
) {
  if (!reqBody.email || !reqBody.password || !reqBody.name || !reqBody.role) {
    return { error: "Missing required fields", status: 400 };
  }

  // Decode JWT token to get businessID
  const decodedToken = await jwt.verify(token, "secretKey");
  console.log("Decoded Token:", decodedToken);
  const businessID = decodedToken.businessID;

  if (!businessID) {
    return { error: "Only business accounts can register staff", status: 403 };
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

  try {
    // Hash the password for security
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    // Insert into user_authentications table
    const newStaffUser = await db
      .insert(user_authentications)
      .values({
        email: reqBody.email,
        password: hashedPassword,
        role: "staff",
      })
      .returning()
      .execute();

    const userId = newStaffUser[0].userID;

    // Insert into staffs table using businessID from the decoded token
    const newStaff = await db
      .insert(staffs)
      .values({
        userID: userId,
        name: reqBody.name,
        role: reqBody.role,
        businessID: businessID, // Use businessID from the token
      })
      .returning()
      .execute();

    return jsonResponse(
      { message: "Staff registration successful", staff: newStaff[0] },
      201
    );
  } catch (error) {
    console.error("Error registering staff:", error);
    return jsonResponse(
      { error: "Error registering staff", detail: error },
      500
    );
  }
}

export async function registerTherapist(
  reqBody: TherapistRegistration,
  jwt: any,
  token: string
) {
  if (
    !reqBody.email ||
    !reqBody.password ||
    !reqBody.name ||
    !reqBody.specialization ||
    !reqBody.contactDetails
  ) {
    return { error: "Missing required fields", status: 400 };
  }
  // Decode JWT token to get businessID
  const decodedToken = await jwt.verify(token, "secretkey");
  console.log("Decoded Token:", decodedToken);
  const businessID = decodedToken.businessID;

  if (!businessID) {
    return {
      error: "Only business accounts can register therapists",
      status: 403,
    };
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
      409
    ); // 409 Conflict
  }

  try {
    // Hash the password for security
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    //insert into user_authentications table
    const newTherapistUser = await db
      .insert(user_authentications)
      .values({
        email: reqBody.email,
        password: hashedPassword,
        role: "therapist",
      })
      .returning()
      .execute();

    const userId = newTherapistUser[0].userID;

    //insert into staffs table using businessID from the decoded token
    const newTherapist = await db
      .insert(physiotherapists)
      .values({
        userID: userId,
        name: reqBody.name,
        specialization: reqBody.specialization,
        contactDetails: reqBody.contactDetails,
        businessID: businessID, // Use businessID from the token
      })
      .returning()
      .execute();
    return jsonResponse(
      {
        message: "Physiotherapist registration successful",
        therapist: newTherapist[0],
      },
      201
    );
  } catch (error) {
    console.error("Error registering therapist:", error);
    return jsonResponse(
      { error: "Error registering therapist", detail: error },
      500
    );
  }
}
