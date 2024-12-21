import bcrypt from "bcryptjs"; // For hashing and comparing passwords
import { eq } from "drizzle-orm";
import type { UserProfile } from "../../types";
import db from "../db";
import { user_authentications } from "../schema";
import jsonResponse from "./auth-services";

export async function getUserProfile(profile: { id: number }) {
  //pass the userID from decoded token in Endpoint
  const userID = profile.id;
  console.log("userID: " + userID);
  if (!userID) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      403
    );
  }
  try {
    const userProfile = await db
      .select({
        name: user_authentications.name,
        avatar: user_authentications.avatar,
        email: user_authentications.email,
      })
      .from(user_authentications)
      .where(eq(user_authentications.userID, userID))
      .execute();

    return userProfile[0];
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    return jsonResponse({ error: "Failed to fetch user profile" }, 500);
  }
}
export async function userProfileUpdate(
  reqBody: Partial<UserProfile>,
  profile: { id: number }
) {
  //pass the userID from decoded token in Endpoint
  const userID = profile.id;
  if (!userID) {
    return jsonResponse(
      { error: "Only authorized users can access this" },
      403
    );
  }

  // Update the user profile
  try {
    const updateUserProfile: Partial<UserProfile> = {};
    if (reqBody.name) updateUserProfile.name = reqBody.name;
    if (reqBody.avatar) updateUserProfile.avatar = reqBody.avatar;
    if (reqBody.password) {
      //check if password and confirm password match
      if (reqBody.password !== reqBody.confirmPassword) {
        return jsonResponse({ error: "Passwords do not match" }, 400); // Fixed typo
      } else {
        const hashedPassword = await bcrypt.hash(reqBody.password, 10);
        updateUserProfile.password = hashedPassword;
      }
    }
    if (reqBody.contactDetails)
      updateUserProfile.contactDetails = reqBody.contactDetails;

    if (Object.keys(updateUserProfile).length > 0) {
      await db
        .update(user_authentications)
        .set(updateUserProfile)
        .where(eq(user_authentications.userID, userID))
        .execute();
    }
  } catch (error) {
    console.error("Error updating user profile", error);
    return jsonResponse({ error: "Error updating user profile" }, 500);
  }
}
