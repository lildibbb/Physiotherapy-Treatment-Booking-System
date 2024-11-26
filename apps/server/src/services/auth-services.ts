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
  Email,
  StaffRegistration,
  TherapistRegistration,
  UserLogin,
} from "../../types";
import type { UserRegistration } from "../../types";

import { eq } from "drizzle-orm";

// Helper function for consistent response formatting
export default function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

// Helper function to verify JWT from cookie
export const verifyAuth = async (jwt: any, auth: string | undefined) => {
  if (!auth) {
    return { error: "Unauthorized - no token provided", status: 401 };
  }

  try {
    const profile = await jwt.verify(auth); // decode dulu
    if (!profile) {
      return { error: "Unauthorized - invalid token", status: 401 };
    }
    console.log("Decoded token{from verifyAuth : ", profile); // for testing purposes
    return { profile, status: 200 }; //return  decoded token data directly
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      console.error("Token expired:", error);
      return { error: "Session expired. Please log in again.", status: 401 };
    }
    return { error: "Unauthorized - invalid token", status: 401 };
  }
};
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
        role: "patient", // default role for patient
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
  let therapistID = null;
  if (role === "therapist") {
    const therapist = await db
      .select()
      .from(physiotherapists)
      .where(eq(physiotherapists.userID, userID))
      .execute();
    if (therapist.length > 0) {
      therapistID = therapist[0].therapistID;
    }
  }
  let staffID = null;
  if (role === "staff") {
    const staff = await db
      .select()
      .from(staffs)
      .where(eq(staffs.userID, userID))
      .execute();
    if (staff.length > 0) {
      staffID = staff[0].staffID;
    }
  }
  // Return user details without the token (token will be generated in the login route)
  return { id: userID, email, businessID, therapistID, staffID, status: 200 };
}

export async function registerStaff(
  reqBody: StaffRegistration,
  profile: { businessID: number }
) {
  if (!reqBody.email || !reqBody.password || !reqBody.name || !reqBody.role) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  // pass the businessID from the decoded token
  const businessID = profile.businessID;

  if (!businessID) {
    console.log(
      "Business ID is missing, unauthorized attempt to register staff."
    );
    return jsonResponse(
      { error: "Only business accounts can register staff" },
      403
    );
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
  profile: { businessID: number }
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

  // pass the businessID from the decoded token
  const businessID = profile.businessID;

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
    const fakeData = {
      qualification: [
        "Bachelor of Physiotherapy",
        "Master of Orthopedics",
        "Certification in Sports Therapy",
      ],
    };
    //insert into staffs table using businessID from the decoded token
    const newTherapist = await db
      .insert(physiotherapists)
      .values({
        userID: userId,
        name: reqBody.name,
        specialization: reqBody.specialization,
        contactDetails: reqBody.contactDetails,
        qualification: reqBody.qualification || fakeData.qualification || null,
        experience: reqBody.experience || null,
        businessID: businessID, // Use businessID from the token
      })
      .returning()
      .execute();
    console.log("newTherapist", newTherapist);
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

export async function requestResetPassword(jwt: any, reqBody: Partial<Email>) {
  try {
    if (reqBody.email) {
      const existingUser = await db
        .select({
          userID: user_authentications.userID,
          role: user_authentications.role,
        })
        .from(user_authentications)
        .where(eq(user_authentications.email, reqBody.email))
        .execute();

      console.log("Existing user: ", existingUser);

      if (existingUser.length > 0) {
        const { userID, role } = existingUser[0];
        let name;

        // Fetch the name from the relevant table based on the role
        if (role === "patient") {
          const patient = await db
            .select({ name: patients.name })
            .from(patients)
            .where(eq(patients.userID, userID))
            .execute();
          name = patient.length > 0 ? patient[0].name : null;
        } else if (role === "business") {
          const business = await db
            .select({
              name: business_entities.personInChargeName,
            })
            .from(business_entities)
            .where(eq(business_entities.userID, userID))
            .execute();
          name = business.length > 0 ? business[0].name : null;
        } else if (role === "staff") {
          const staff = await db
            .select({ name: staffs.name })
            .from(staffs)
            .where(eq(staffs.userID, userID))
            .execute();
          name = staff.length > 0 ? staff[0].name : null;
        } else if (role === "therapist") {
          const therapist = await db
            .select({ name: physiotherapists.name })
            .from(physiotherapists)
            .where(eq(physiotherapists.userID, userID))
            .execute();
          name = therapist.length > 0 ? therapist[0].name : null;
        }

        if (!name) {
          return jsonResponse({ error: "Name not found for user" }, 404);
        }
        // Generate a token with userID and purpose as payload
        const resetToken = await jwt.sign(
          {
            userID: existingUser[0].userID, // Access userID directly
            purpose: "password_reset",
          },
          { exp: "15m" } // Expiry is set here
        );

        console.log("Generated resetToken:", resetToken); // Verify if it is a string

        return jsonResponse({ token: resetToken, name });
      }
    }
  } catch (error: any) {
    console.error("Error requesting password reset:", error);
    return jsonResponse(
      { error: "Error requesting password reset", detail: error.message },
      500
    );
  }

  return jsonResponse({
    message: "If the email exists, a reset link will be sent.",
  });
}

export async function updatePasswordResetToken(
  jwt: any,
  reqBody: any,
  token: string
) {
  // Log the incoming request for debugging
  console.log("Received request to update password with token:", token);
  console.log("Request body:", reqBody);

  // Step 1: check for required fields
  if (!reqBody.password || !reqBody.confirmPassword) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  // Step 2: check if password and confirm password match
  if (reqBody.password !== reqBody.confirmPassword) {
    return jsonResponse({ error: "Passwords do not match" }, 400); // Fixed typo
  }

  try {
    // Step 3: decode JWT token to retrieve userID
    const decodedToken = await jwt.verify(token, "secretKey");
    console.log("Decoded token:", decodedToken);

    if (decodedToken.purpose !== "password_reset") {
      return jsonResponse({ error: "Token is not for password reset" }, 400);
    }

    const userID = decodedToken.userID || decodedToken.UserID;
    if (!userID) {
      return jsonResponse({ error: "Invalid Token ID" }, 400);
    }

    // Step 4: hash the new password
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    // Step 5: update the new user's password in user_authentications table
    const result = await db
      .update(user_authentications)
      .set({ password: hashedPassword })
      .where(eq(user_authentications.userID, userID))
      .execute();

    console.log("Password update result:", result); // Log the result to verify

    if (result.rowCount === 0) {
      console.warn("No rows affected; userID may not exist.");
      return jsonResponse({ error: "User not found" }, 404);
    }
    // Step 6: Retrieve user's name and email

    const userEmail = await db
      .select({
        email: user_authentications.email,
        role: user_authentications.role,
      })
      .from(user_authentications)
      .where(eq(user_authentications.userID, userID))
      .execute();

    if (userEmail.length > 0) {
      const { email, role } = userEmail[0];
      let name;

      // Fetch the name from the relevant table based on the role
      if (role === "patient") {
        const patient = await db
          .select({ name: patients.name })
          .from(patients)
          .where(eq(patients.userID, userID))
          .execute();
        name = patient.length > 0 ? patient[0].name : null;
      } else if (role === "business") {
        const business = await db
          .select({
            name: business_entities.personInChargeName,
          })
          .from(business_entities)
          .where(eq(business_entities.userID, userID))
          .execute();
        name = business.length > 0 ? business[0].name : null;
      } else if (role === "staff") {
        const staff = await db
          .select({ name: staffs.name })
          .from(staffs)
          .where(eq(staffs.userID, userID))
          .execute();
        name = staff.length > 0 ? staff[0].name : null;
      } else if (role === "therapist") {
        const therapist = await db
          .select({ name: physiotherapists.name })
          .from(physiotherapists)
          .where(eq(physiotherapists.userID, userID))
          .execute();
        name = therapist.length > 0 ? therapist[0].name : null;
      }

      if (!name) {
        return jsonResponse({ error: "Name not found for user" }, 404);
      }

      console.log("Email:", email);
      console.log("Name:", name);
      // Step 7: Return a success response
      return jsonResponse(
        { message: "Password updated successfully", email: email, name: name },
        200
      );
    }
  } catch (error: any) {
    console.error("Database update error:", error);

    // Handle token expiration error
    if (error.name === "TokenExpiredError") {
      return jsonResponse({ error: "Token has expired" }, 401);
    }

    return jsonResponse(
      { error: "Error updating password reset token", detail: error.message },
      500
    );
  }
}
