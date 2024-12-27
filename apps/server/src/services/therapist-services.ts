import { eq, or, and, asc } from "drizzle-orm";
import db from "../db";
import {
  physiotherapists,
  business_entities,
  user_authentications,
} from "../schema";
import jsonResponse from "../services/auth-services";
import type { Therapist } from "../../types";
import bcrypt from "bcryptjs";
export async function getAllTherapistPublic(): Promise<
  Array<{
    therapistID: number;
    avatar: string | null;
    name: string;
    specialization: string;
    qualification: string[];
    experience: number | null;
    businessName: string;
    location: string; // Combined city and state
  }>
> {
  try {
    const therapistDetails = await db
      .select({
        therapistID: physiotherapists.therapistID,
        avatar: user_authentications.avatar ?? null,
        name: user_authentications.name,
        specialization: physiotherapists.specialization,
        qualification: physiotherapists.qualification,
        experience: physiotherapists.experience,
        language: physiotherapists.language,
        businessName: business_entities.companyName,
        city: business_entities.city,
        state: business_entities.state,
      })
      .from(physiotherapists)
      .innerJoin(
        business_entities,
        eq(physiotherapists.businessID, business_entities.businessID)
      )
      .innerJoin(
        user_authentications,
        eq(physiotherapists.userID, user_authentications.userID)
      )
      .execute();

    const transformedTherapist = therapistDetails.map((therapist) => ({
      ...therapist,
      qualification: Array.isArray(therapist.qualification)
        ? therapist.qualification
        : [],
      location: `${String(therapist.city)}, ${String(therapist.state)}`,
    }));

    return transformedTherapist;
  } catch (error) {
    console.error("Error fetching therapists:", error);
    throw new Error("Error fetching therapists.");
  }
}

export async function getAllTherapistByBusiness(profile: {
  businessID: number;
}) {
  // pass the businessID from the decoded token
  const businessID = profile.businessID;

  if (!businessID) {
    throw { message: "Only authorized users can access this", status: 403 };
  }

  const therapistData = await db
    .select({
      therapistID: physiotherapists.therapistID,
      name: user_authentications.name,
      email: user_authentications.email,
      password: user_authentications.password,
      specialization: physiotherapists.specialization,
      contactDetails: user_authentications.contactDetails,
    })
    .from(physiotherapists)
    .innerJoin(
      user_authentications,
      eq(physiotherapists.userID, user_authentications.userID)
    )
    .where(eq(physiotherapists.businessID, businessID))
    .execute();

  return therapistData;
}

export async function updateTherapistDetails(
  reqBody: Partial<Therapist>,
  profile: { businessID: number },
  therapistID: string
) {
  const therapistIDNumber = parseInt(therapistID, 10);

  //pass the businessID from the decoded token in Endpoint
  const businessID = profile.businessID;

  if (!businessID) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      403
    );
  }

  const therapistData = await db
    .select({
      userID: physiotherapists.userID,
      businessID: physiotherapists.businessID,
    })
    .from(physiotherapists)
    .where(eq(physiotherapists.therapistID, therapistIDNumber))
    .execute();

  if (
    therapistData.length === 0 ||
    therapistData[0].businessID !== businessID
  ) {
    return jsonResponse(
      { error: "Therapist not found or unauthorized to update" },
      403
    );
  }

  const userID = therapistData[0].userID;

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
    const authUpdateFields: Partial<Therapist> = {};
    if (reqBody.email) authUpdateFields.email = reqBody.email;
    if (reqBody.name) authUpdateFields.name = reqBody.name;
    if (reqBody.password) {
      const hashedPassword = await bcrypt.hash(reqBody.password, 10);
      authUpdateFields.password = hashedPassword;
    }
    if (reqBody.contactDetails)
      authUpdateFields.contactDetails = reqBody.contactDetails;

    // Update user_authentications table if email or password is provided
    if (Object.keys(authUpdateFields).length > 0) {
      await db
        .update(user_authentications)
        .set(authUpdateFields)
        .where(eq(user_authentications.userID, userID))
        .execute();
    }

    const therapistUpdateFields: Partial<Therapist> = {};

    if (reqBody.specialization)
      therapistUpdateFields.specialization = reqBody.specialization;

    // Update physiotherapists table if specialization, name, or contactDetails is provided
    if (Object.keys(therapistUpdateFields).length > 0) {
      await db
        .update(physiotherapists)
        .set(therapistUpdateFields)
        .where(eq(physiotherapists.therapistID, therapistIDNumber))
        .execute();
    }

    return jsonResponse(
      {
        message: "Therapist details updated successfully",
        therapist: therapistUpdateFields,
      },
      200
    );
  } catch (error) {
    console.error("Error updating therapist:", error);
    return jsonResponse({ message: "Error updating therapist", error }, 500);
  }
}

export async function getTherapistByID(
  therapistID: number
): Promise<Therapist> {
  try {
    const therapistDetail = await db
      .select({
        therapistID: physiotherapists.therapistID,
        avatar: user_authentications.avatar,
        name: user_authentications.name,
        specialization: physiotherapists.specialization,
        qualification: physiotherapists.qualification,
        experience: physiotherapists.experience,
        about: physiotherapists.about,
        businessName: business_entities.companyName,
        city: business_entities.city,
        state: business_entities.state,
      })
      .from(physiotherapists)
      .innerJoin(
        business_entities,
        eq(physiotherapists.businessID, business_entities.businessID)
      )
      .innerJoin(
        user_authentications,
        eq(physiotherapists.userID, user_authentications.userID)
      )
      .where(eq(physiotherapists.therapistID, therapistID)) // Filter by therapist ID
      .execute();

    if (!therapistDetail || therapistDetail.length === 0) {
      throw new Error(`Therapist with ID ${therapistID} not found.`);
    }
    console.log("therapist detail", therapistDetail);
    // Since you expect only one therapist, access the first result (index 0)
    const therapist = therapistDetail[0];

    const transformedTherapist: Therapist = {
      therapistID: therapist.therapistID,
      name: therapist.name,
      avatar: therapist.avatar,
      specialization: therapist.specialization,
      qualification: Array.isArray(therapist.qualification)
        ? therapist.qualification
        : [],
      experience: therapist.experience,
      about: therapist.about ?? undefined,
      businessName: therapist.businessName, // Include businessName if needed
      location: `${String(therapist.city)}, ${String(therapist.state)}`,
    };

    return transformedTherapist;
  } catch (error) {
    console.error("Error fetching therapist by ID:", error);
    throw new Error(`Error fetching therapist with ID ${therapistID}.`);
  }
}
