// server/index.ts
import { Elysia } from "elysia";
import { Client } from "pg";
import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { authRoutes } from "./routes/auth.routes";
import { businessRoutes } from "./routes/business.routes";
import { staffRoutes } from "./routes/staff.routes";
import { therapistRoutes } from "./routes/therapist.routes";
import { paymentRoutes } from "./routes/payment.routes";
import { bookingRoutes } from "./routes/booking.routes";

// PostgreSQL Client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

// Set up the Elysia server
const app = new Elysia()
  .use(
    cors({
      credentials: true,
      origin: process.env.VITE_BASE_URL,
    })
  ) // Enable CORS for cross-origin requests// Enable JWT for authentication
  .use(
    swagger({
      documentation: {
        info: {
          title: "Appointment Booking and Physiotherapy Treatment System",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    })
  )
  .use(authRoutes)
  .use(businessRoutes)
  .use(staffRoutes)
  .use(therapistRoutes)
  .use(paymentRoutes)
  .use(bookingRoutes);
app.listen(5431, () => console.log("Server running on port 5431"));
