import Elysia from "elysia";
import { basePath, jwtAccessSetup } from "./setup";
import { createAppointment, getAppointmentByID } from "../services/services";
import jsonResponse, { verifyAuth } from "../services/auth-services";
import { AppointmentSchema, type Appointment } from "../../types";

export const bookingRoutes = new Elysia()
  .use(jwtAccessSetup)
  .group(`${basePath}/booking`, (group) => {
    group
      .post(
        "/create",
        async ({ body, cookie: { auth }, jwt }) => {
          console.log("Received body:", body);

          const authResult = await verifyAuth(jwt, auth?.value);
          console.log("Auth Result {bookAppointment} :", authResult);
          if ("error" in authResult) {
            return jsonResponse(authResult, 401);
          }

          try {
            // Step 2: Destructure and validate request body
            const { therapistID } = body as Appointment;

            console.log("Therapist ID {bookAppointment} :", therapistID);
            return await createAppointment(
              body as Appointment,
              therapistID,
              authResult.profile
            );
          } catch (error) {
            console.error("Error {bookAppointment} :", error);
            return { error: "Internal Server Error", status: 500 };
          }
        },
        { body: AppointmentSchema }
      )
      .get("/appointment", async ({ jwt, cookie: { auth } }) => {
        const authResult = await verifyAuth(jwt, auth?.value);
        console.log("Auth Result:", authResult);
        if ("error" in authResult) {
          console.log("Error in authResult:", authResult);
          return jsonResponse(authResult, 401);
        }
        try {
          const appointmentData = await getAppointmentByID(authResult.profile);
          return jsonResponse(appointmentData);
        } catch (error) {
          return jsonResponse(
            { error: "Failed to fetch appointment data" },
            500
          );
        }
      });

    return group;
  });
