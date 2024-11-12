// server/db.ts
import * as dotenv from "dotenv";

import { drizzle } from "drizzle-orm/node-postgres"; // Import for Node.js and Postgres
import { Pool } from "pg";

// Load environment variables from the .env file in the root directory
dotenv.config({ path: "../.env" }); // Adjust the path based on the relative location

console.log("DATABASE_URL:", process.env.DATABASE_URL);
// export const dbUrl = process.env["DATABASE_URL"];
// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // This should be set in your .env file
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Initialize Drizzle ORM with the PostgreSQL pool
const db = drizzle(pool); // Use the pool directly in drizzle

export default db;
