import bcrypt from "bcryptjs"; // For hashing and comparing passwords
import db from "../db";
import { user_authentications } from "../schema";
import type { UserRegistration, UserLogin } from "../../types";
import sign from "@elysiajs/jwt";
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
  if (!reqBody.username || !reqBody.password) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }
  const hashedPassword = await bcrypt.hash(reqBody.password, 10); // Hash the password with bcrypt
  try {
    const newUser = await db
      .insert(user_authentications)
      .values({
        username: reqBody.username,
        password: hashedPassword,
        role: reqBody.role || "user",
        associatedID: reqBody.associatedID ?? null,
      })
      .returning()
      .execute();

    return jsonResponse(newUser[0], 201);
  } catch (error) {
    console.error("Error registering user:", error);
    return jsonResponse({ message: "Error registering user", error }, 500);
  }
}

// User Login
export async function loginUser(reqBody: UserLogin) {
  if (!reqBody.username || !reqBody.password) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }
  const user = await db
    .select()
    .from(user_authentications)
    .where(eq(user_authentications.username, reqBody.username))
    .execute();

  if (user.length === 0) {
    return jsonResponse({ error: "Invalid credentials" }, 401);
  }

  const hashedPassword = user[0].password;

  // Correct way to compare passwords using bcrypt
  const passwordMatches = await bcrypt.compare(
    reqBody.password,
    hashedPassword
  );

  if (!passwordMatches) {
    return jsonResponse({ error: "Invalid credentials" }, 401);
  }

  // Create JWT token
  const payload = {
    userID: user[0].userID,
    role: user[0].role,
  };

  // Sign the JWT token
  const token = sign({
    header: { alg: "HS256", typ: "JWT" }, // Specify algorithm and token type
    payload,
    secret: "your_jwt_secret_key", // Your secret key
    expiresIn: "1h", // 1 hour expiration
  });

  return jsonResponse({ token });
}
