import bcrypt from "bcryptjs"; // For hashing and comparing passwords
import db from "../db";
import {
  user_authentications,
  patients,
  business_entities,
  staffs,
  physiotherapists,
  availabilities,
} from "../schema";
import type {
  BusinessRegistration,
  Email,
  StaffRegistration,
  TherapistRegistration,
  UserLogin,
} from "../../types";
import type { UserRegistration } from "../../types";

import { eq, or } from "drizzle-orm";
import { decimal } from "drizzle-orm/mysql-core";

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
  if (
    !reqBody.email ||
    !reqBody.password ||
    !reqBody.name ||
    !reqBody.contactDetails
  ) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  // Check for existing contact details or email in user_authentications if provided
  if (reqBody.contactDetails || reqBody.email) {
    const conditions = [];
    if (reqBody.contactDetails) {
      conditions.push(
        eq(user_authentications.contactDetails, reqBody.contactDetails)
      );
    }
    if (reqBody.email) {
      conditions.push(eq(user_authentications.email, reqBody.email));
    }

    const existingUsers = await db
      .select()
      .from(user_authentications)
      .where(or(...conditions))
      .execute();

    const conflicts = [];
    if (
      existingUsers.some(
        (user) => user.contactDetails === reqBody.contactDetails
      )
    ) {
      conflicts.push("Contact details");
    }
    if (existingUsers.some((user) => user.email === reqBody.email)) {
      conflicts.push("Email");
    }

    if (conflicts.length > 0) {
      return jsonResponse(
        {
          error: "Some fields are already in use.",
          field: conflicts, // Return an array of conflicting fields
        },
        409
      );
    }
  }

  const hashedPassword = await bcrypt.hash(reqBody.password, 10); // Hash the password with bcrypt

  try {
    // Insert into user_authentications table
    const newUser = await db
      .insert(user_authentications)
      .values({
        name: reqBody.name,
        email: reqBody.email,
        password: hashedPassword,
        role: "patient", // default role for patient
        contactDetails: reqBody.contactDetails,
      })
      .returning()
      .execute();

    const userId = newUser[0].userID;

    // Insert into patients table with the associated userID and default values
    await db
      .insert(patients)
      .values({
        userID: userId, // link patient to the user_authentications entry

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

  // Check for existing contact details or email in user_authentications if provided
  if (reqBody.contactPhone || reqBody.contactEmail) {
    const conditions = [];
    if (reqBody.contactPhone) {
      conditions.push(
        eq(user_authentications.contactDetails, reqBody.contactPhone)
      );
    }
    if (reqBody.contactEmail) {
      conditions.push(eq(user_authentications.email, reqBody.contactEmail));
    }

    const existingUsers = await db
      .select()
      .from(user_authentications)
      .where(or(...conditions))
      .execute();

    const conflicts = [];
    if (
      existingUsers.some((user) => user.contactDetails === reqBody.contactPhone)
    ) {
      conflicts.push("Contact details");
    }
    if (existingUsers.some((user) => user.email === reqBody.contactEmail)) {
      conflicts.push("Email");
    }

    if (conflicts.length > 0) {
      return jsonResponse(
        {
          error: "Some fields are already in use.",
          field: conflicts, // Return an array of conflicting fields
        },
        409
      );
    }
  }

  try {
    // Hash the default password for security
    const hashedPassword = await bcrypt.hash("business123", 10);

    // Insert into user_authentications table
    const newBusinessUser = await db
      .insert(user_authentications)
      .values({
        name: reqBody.companyName,
        email: reqBody.contactEmail,
        password: hashedPassword,
        contactDetails: reqBody.contactPhone,
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
  let patientID = null;
  if (role === "patient") {
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.userID, userID))
      .execute();
    if (patient.length > 0) {
      patientID = patient[0].patientID;
    }
  }
  // Return user details without the token (token will be generated in the login route)
  return {
    id: userID,
    email,
    businessID,
    therapistID,
    staffID,
    patientID,
    role,
    status: 200,
  };
}

export async function registerStaff(
  reqBody: StaffRegistration,
  profile: { businessID: number }
) {
  console.log("contactdetails: ", reqBody.contactDetails);
  if (
    !reqBody.email ||
    !reqBody.password ||
    !reqBody.contactDetails ||
    !reqBody.name ||
    !reqBody.role
  ) {
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

  //check for existing contact details or email in user_authentication if provided
  if (reqBody.contactDetails || reqBody.email) {
    const conditions = [];
    if (reqBody.contactDetails) {
      conditions.push(
        eq(user_authentications.contactDetails, reqBody.contactDetails)
      );
    }
    if (reqBody.email) {
      conditions.push(eq(user_authentications.email, reqBody.email));
    }
    const existingUser = await db
      .select()
      .from(user_authentications)
      .where(or(...conditions))
      .execute();

    if (existingUser.length > 0) {
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
    // Hash the password for security
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    // Insert into user_authentications table
    const newStaffUser = await db
      .insert(user_authentications)
      .values({
        name: reqBody.name,
        email: reqBody.email,
        password: hashedPassword,
        contactDetails: reqBody.contactDetails,
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
    !reqBody.contactDetails ||
    !reqBody.rate
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
  // Check for existing contact details or email in user_authentications if provided
  if (reqBody.contactDetails || reqBody.email) {
    const conditions = [];
    if (reqBody.contactDetails) {
      conditions.push(
        eq(user_authentications.contactDetails, reqBody.contactDetails)
      );
    }
    if (reqBody.email) {
      conditions.push(eq(user_authentications.email, reqBody.email));
    }

    const existingUsers = await db
      .select()
      .from(user_authentications)
      .where(or(...conditions))
      .execute();

    const conflicts = [];
    if (
      existingUsers.some(
        (user) => user.contactDetails === reqBody.contactDetails
      )
    ) {
      conflicts.push("Contact details");
    }
    if (existingUsers.some((user) => user.email === reqBody.email)) {
      conflicts.push("Email");
    }

    if (conflicts.length > 0) {
      return jsonResponse(
        {
          error: "Some fields are already in use.",
          field: conflicts, // Return an array of conflicting fields
        },
        409
      );
    }
  }

  try {
    // Hash the password for security
    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    //insert into user_authentications table
    const newTherapistUser = await db
      .insert(user_authentications)
      .values({
        name: reqBody.name,
        email: reqBody.email,
        password: hashedPassword,
        contactDetails: reqBody.contactDetails,
        role: "therapist",
      })
      .returning()
      .execute();

    const userId = newTherapistUser[0].userID;
    const fakeData = {
      qualification: [],
      experience: 10,
      languages: ["English", "Malay"],
    };
    const rate = reqBody.rate.toString();
    //insert into staffs table using businessID from the decoded token
    const newTherapist = await db
      .insert(physiotherapists)
      .values({
        userID: userId,
        about: null,
        specialization: reqBody.specialization,
        qualification: reqBody.qualification || fakeData.qualification || null,
        experience: reqBody.experience || null,
        language: reqBody.languages || fakeData.languages || null,
        rate: rate, // Convert rate to string
        businessID: businessID, // Use businessID from the token
      })
      .returning()
      .execute();
    console.log("newTherapist", newTherapist);
    // Define all days of the week
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Prepare availability records
    const availabilityRecords = daysOfWeek.map((day) => ({
      therapistID: newTherapist[0].therapistID,
      dayOfWeek: day,
    }));

    // Insert all availability records in a single batch
    await db.insert(availabilities).values(availabilityRecords).execute();

    console.log("Availability records inserted:", availabilityRecords);
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
          name: user_authentications.name,
          role: user_authentications.role,
        })
        .from(user_authentications)
        .where(eq(user_authentications.email, reqBody.email))
        .execute();

      console.log("Existing user: ", existingUser);

      if (existingUser.length > 0) {
        const { userID, name, role } = existingUser[0];
        // let name;

        // // Fetch the name from the relevant table based on the role
        // if (role === "patient") {
        //   const patient = await db
        //     .select({ name: patients.name })
        //     .from(patients)
        //     .where(eq(patients.userID, userID))
        //     .execute();
        //   name = patient.length > 0 ? patient[0].name : null;
        // } else if (role === "business") {
        //   const business = await db
        //     .select({
        //       name: business_entities.personInChargeName,
        //     })
        //     .from(business_entities)
        //     .where(eq(business_entities.userID, userID))
        //     .execute();
        //   name = business.length > 0 ? business[0].name : null;
        // } else if (role === "staff") {
        //   const staff = await db
        //     .select({ name: staffs.name })
        //     .from(staffs)
        //     .where(eq(staffs.userID, userID))
        //     .execute();
        //   name = staff.length > 0 ? staff[0].name : null;
        // } else if (role === "therapist") {
        //   const therapist = await db
        //     .select({ name: physiotherapists.name })
        //     .from(physiotherapists)
        //     .where(eq(physiotherapists.userID, userID))
        //     .execute();
        //   name = therapist.length > 0 ? therapist[0].name : null;
        // }

        // if (!name) {
        //   return jsonResponse({ error: "Name not found for user" }, 404);
        // }
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
        name: user_authentications.name,
        email: user_authentications.email,
        role: user_authentications.role,
      })
      .from(user_authentications)
      .where(eq(user_authentications.userID, userID))
      .execute();

    if (userEmail.length > 0) {
      const { email, name, role } = userEmail[0];
      // let name;

      // // Fetch the name from the relevant table based on the role
      // if (role === "patient") {
      //   const patient = await db
      //     .select({ name: patients.name })
      //     .from(patients)
      //     .where(eq(patients.userID, userID))
      //     .execute();
      //   name = patient.length > 0 ? patient[0].name : null;
      // } else if (role === "business") {
      //   const business = await db
      //     .select({
      //       name: business_entities.personInChargeName,
      //     })
      //     .from(business_entities)
      //     .where(eq(business_entities.userID, userID))
      //     .execute();
      //   name = business.length > 0 ? business[0].name : null;
      // } else if (role === "staff") {
      //   const staff = await db
      //     .select({ name: staffs.name })
      //     .from(staffs)
      //     .where(eq(staffs.userID, userID))
      //     .execute();
      //   name = staff.length > 0 ? staff[0].name : null;
      // } else if (role === "therapist") {
      //   const therapist = await db
      //     .select({ name: physiotherapists.name })
      //     .from(physiotherapists)
      //     .where(eq(physiotherapists.userID, userID))
      //     .execute();
      //   name = therapist.length > 0 ? therapist[0].name : null;
      // }

      // if (!name) {
      //   return jsonResponse({ error: "Name not found for user" }, 404);
      // }

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
