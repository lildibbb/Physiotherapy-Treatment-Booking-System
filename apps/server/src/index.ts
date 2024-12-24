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
import { staticPlugin } from "@elysiajs/static";
// PostgreSQL Client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
const host = "0.0.0.0";
const port = "5431";
console.log("VITE_API_BASE_URL:", process.env.VITE_API_BASE_URL); // Add this line
await client.connect();

// Set up the Elysia server
const app = new Elysia()
  .use(
    cors({
      credentials: true,
      origin: process.env.VITE_API_BASE_URL,
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
  .use(bookingRoutes)
  .use(
    staticPlugin({
      prefix: "/uploads/avatars", // URL prefix for accessing files
      assets: "src/uploads/avatars", // Directory where files are stored
    })
  );
app.listen(
  {
    hostname: host,
    port,
  },
  () => console.log(`Server running at http://${host}:${port}`)
);
