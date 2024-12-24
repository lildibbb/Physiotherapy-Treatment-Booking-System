import bcrypt from "bcryptjs"; // For hashing and comparing passwords
import { eq } from "drizzle-orm";
import type { UserProfile } from "../../types";
import db from "../db";
import { patients, physiotherapists, user_authentications } from "../schema";
import jsonResponse from "./auth-services";
import { deleteOldAvatar, handleFileUpload } from "../routes/handleFileUpload";

export async function getUserProfile(profile: {
  id: number;
  therapistID: number;
  businessID: number;
  staffID: number;
}) {
  //pass the userID from decoded token in Endpoint
  const userID = profile.id;
  const therapistID = profile.therapistID;
  const businessID = profile.businessID;
  const staffID = profile.staffID;
  console.log("userID: " + userID);
  if (!userID) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      401
    );
  }
  try {
    if (
      userID != null &&
      therapistID == null &&
      businessID == null &&
      staffID == null
    ) {
      const userProfile = await db
        .select({
          name: user_authentications.name,
          avatar: user_authentications.avatar,
          email: user_authentications.email,
          contactDetails: user_authentications.contactDetails,

          dob: patients.dob,
          gender: patients.gender,
        })
        .from(user_authentications)
        .innerJoin(patients, eq(patients.userID, userID))
        .where(eq(user_authentications.userID, userID))
        .execute();

      return userProfile[0];
    }

    if (
      userID != null &&
      therapistID != null &&
      businessID == null &&
      staffID == null
    ) {
      const userProfile = await db
        .select({
          name: user_authentications.name,
          avatar: user_authentications.avatar,
          email: user_authentications.email,
          contactDetails: user_authentications.contactDetails,
          specialization: physiotherapists.specialization,
          qualification: physiotherapists.qualification,
          experience: physiotherapists.experience,
          language: physiotherapists.language,
        })
        .from(user_authentications)
        .innerJoin(physiotherapists, eq(physiotherapists.userID, userID))
        .where(eq(user_authentications.userID, userID))
        .execute();

      return userProfile[0];
    }
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    return jsonResponse({ error: "Failed to fetch user profile" }, 500);
  }
}
export async function userProfileUpdate(
  reqBody: Partial<UserProfile>,
  profile: {
    id: number;
    therapistID: number;
    businessID: number;
    staffID: number;
  }
) {
  //pass the userID from decoded token in Endpoint
  const userID = profile.id;
  console.log("userID: ", userID);
  const therapistID = profile.therapistID;
  const businessID = profile.businessID;
  const staffID = profile.staffID;
  if (!userID) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      401
    );
  }

  // Update the user profile
  try {
    //update common field in user_authentication table
    const updateAuthUserProfile: Partial<UserProfile> = {};

    if (reqBody.name) updateAuthUserProfile.name = reqBody.name;
    // Handle file upload
    if (reqBody.avatarFile instanceof File) {
      // delete previous avatar file if exists
      const userProfile = await db
        .select({ avatar: user_authentications.avatar })
        .from(user_authentications)
        .where(eq(user_authentications.userID, userID))
        .execute();
      if (userProfile[0].avatar) {
        const filePath = userProfile[0].avatar;
        console.log("Old filePath", filePath);
        await deleteOldAvatar(filePath);
      }
      const handleFile = await handleFileUpload(reqBody.avatarFile);
      if (handleFile.error) {
        return jsonResponse({ error: handleFile.error }, 400);
      }
      updateAuthUserProfile.avatar = handleFile.path;
    }

    if (reqBody.password && reqBody.confirmPassword) {
      //check if password and confirm password match
      if (reqBody.password !== reqBody.confirmPassword) {
        return jsonResponse({ error: "Passwords do not match" }, 400); // Fixed typo
      } else {
        const hashedPassword = await bcrypt.hash(reqBody.password, 10);
        updateAuthUserProfile.password = hashedPassword;
      }
    }
    if (reqBody.contactDetails)
      updateAuthUserProfile.contactDetails = reqBody.contactDetails;

    if (Object.keys(updateAuthUserProfile).length > 0) {
      await db
        .update(user_authentications)
        .set(updateAuthUserProfile)
        .where(eq(user_authentications.userID, userID))
        .execute();
    }

    //update specific field in different tables
    if (
      userID != null &&
      therapistID == null &&
      businessID == null &&
      staffID == null
    ) {
      const updatedUserProfile: Partial<UserProfile> = {};
      if (reqBody.dob) {
        const parsedDate = new Date(reqBody.dob);
        if (isNaN(parsedDate.getTime())) {
          return jsonResponse({ error: "Invalid date format for dob" }, 400);
        }
        console.log("parsedDate", parsedDate);

        // Convert to a string in ISO format
        updatedUserProfile.dob = parsedDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
      }
      if (reqBody.address) updatedUserProfile.address = reqBody.address;
      if (reqBody.gender) updatedUserProfile.gender = reqBody.gender;
      console.log("updatedUserProfile:", updatedUserProfile);
      if (Object.keys(updatedUserProfile).length > 0) {
        await db
          .update(patients)
          .set(updatedUserProfile)
          .where(eq(patients.userID, userID))
          .execute();
      }

      return jsonResponse(
        {
          message: "User profile updated successfully",
          user: updatedUserProfile,
        },
        200
      );
    } else if (
      userID != null &&
      therapistID != null &&
      businessID == null &&
      staffID == null
    ) {
      const updatedUserProfile: Partial<UserProfile> = {};
      if (reqBody.specialization)
        updatedUserProfile.specialization = reqBody.specialization;
      if (reqBody.qualification)
        updatedUserProfile.qualification = reqBody.qualification;
      if (reqBody.experience)
        updatedUserProfile.experience = reqBody.experience;

      if (Object.keys(updatedUserProfile).length > 0) {
        await db
          .update(physiotherapists)
          .set(updatedUserProfile)
          .where(eq(physiotherapists.userID, userID))
          .execute();
      }

      return jsonResponse(
        {
          message: "User profile updated successfully",
          user: updatedUserProfile,
        },
        200
      );
    }
    return jsonResponse({ message: "User profile updated successfully" }, 200);
  } catch (error) {
    console.error("Error updating user profile", error);
    return jsonResponse({ error: "Error updating user profile" }, 500);
  }
}
