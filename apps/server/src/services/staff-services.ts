import { eq, or } from "drizzle-orm";
import type { Staff } from "../../types";
import db from "../db";
import { staffs, user_authentications } from "../schema";
import jsonResponse from "./auth-services";
import bcrypt from "bcryptjs";

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
      name: user_authentications.name,
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
    if (reqBody.name) authUpdateFields.name = reqBody.name;
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
