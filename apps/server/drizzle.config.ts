import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load the .env file from the root directory
dotenv.config({ path: "../../.env" }); // Adjusted path for server directory

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debugging to check if it's loaded

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // This will check the value here
  },
});
