import Stripe from "stripe";
import * as dotenv from "dotenv";
import * as path from "path";
import type { Payment } from "../../types";
import jsonResponse from "./auth-services";
import {
  appointments,
  patients,
  payments,
  physiotherapists,
  staffs,
  user_authentications,
} from "../schema";
import db from "../db";
import { eq } from "drizzle-orm";
import {
  sendNotification,
  sendNotificationToUser,
} from "./notification-services";
import { format } from "date-fns";
// Adjust path to point to root .env file
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export const createCheckoutSession = async (
  appointmentID: number,
  rate: number
) => {
  try {
    const unitAmount = Math.round(rate * 100);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "fpx"],
      submit_type: "book",
      line_items: [
        {
          price_data: {
            currency: "myr",
            product_data: {
              name: "Appointment Booking",
              description: "Book a session with our experienced therapist.",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URL}?session_id={CHECKOUT_SESSION_ID}`,
    });
    // const price = await fetchPriceDetails("price_1QNWvrGH6JXUmBKomzBv7qLq");
    // const { unit_amount_decimal } = price;
    // const formattedAmount = (Number(unit_amount_decimal) / 100).toFixed(2);
    // console.log("unit amount: ", formattedAmount);
    console.log("appointemntID in service: ", appointmentID);
    const paymentData = await createPaymentData({
      amount: (unitAmount / 100).toFixed(2),
      appointmentID: appointmentID,
      paymentStatus: "pending", // Initially marked as pending
      transactionReference: session.id,
    });
    console.log("Payment Data: ", paymentData);
    return session.url;
  } catch (error) {
    console.error("Error creating Stripe Checkout Session:", error);
    throw new Error("Unable to create Stripe Checkout Session");
  }
};

export async function fetchPriceDetails(priceID: string) {
  try {
    const price = await stripe.prices.retrieve(priceID);
    return price;
  } catch (error) {
    console.error("Failed to fetch price details:", error);
    throw error; // Handle errors appropriately in your application
  }
}
export async function createPaymentData(reqBody: Payment) {
  if (!reqBody.amount || !reqBody.paymentStatus) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }
  try {
    const paymentData = await db
      .insert(payments)
      .values({
        amount: reqBody.amount,
        appointmentID: reqBody.appointmentID,
        paymentStatus: "pending",
        transactionReference: reqBody.transactionReference,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .execute();

    // Check if the insert operation was successful
    if (paymentData.length === 0) {
      throw new Error("Insert operation failed");
    }
    return paymentData[0]; // Return the inserted payment record
  } catch (error) {
    console.error("Error creating payment data:", error);
    throw new Error("Unable to create payment data");
  }
}

export async function fulfillCheckoutRequest(sessionID: string) {
  if (!sessionID) {
    return jsonResponse({ error: "Missing session ID" }, 400);
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionID);

    try {
      if (session.payment_status === "paid") {
        const paymentData = await db
          .update(payments)
          .set({
            paymentDate: new Date().toISOString(),
            paymentMethod: session.payment_method_types[0],
            paymentStatus: session.payment_status,
          })
          .where(eq(payments.transactionReference, session.id))
          .returning()
          .execute();

        console.log("Payment Data {service}:", paymentData);

        if (paymentData.length > 0) {
          const { appointmentID } = paymentData[0]; // Access the first item
          console.log("appointmentID: ", appointmentID);
          const appointmentData = await db
            .update(appointments)
            .set({ status: "Ongoing" })
            .where(eq(appointments.appointmentID, appointmentID)) // Use the first item's appointmentID
            .returning()
            .execute();

          console.log("Appointment Data {Fullfillservice}:", appointmentData);

          const therapistID = appointmentData[0].therapistID;
          const staffID = appointmentData[0].staffID;
          const patientID = appointmentData[0].patientID;

          const therapistUserID = await db
            .select({ userID: physiotherapists.userID })
            .from(physiotherapists)
            .where(eq(physiotherapists.therapistID, therapistID))
            .execute();

          const staffUserID = await db
            .select({ userID: staffs.userID })
            .from(staffs)
            .where(eq(staffs.staffID, staffID))
            .execute();

          const patientUserID = await db
            .select({ userID: patients.userID })
            .from(patients)
            .where(eq(patients.patientID, patientID))
            .execute();

          const therapistName = await db
            .select({ name: user_authentications.name })
            .from(user_authentications)
            .where(eq(user_authentications.userID, therapistUserID[0].userID))
            .execute();
          const formattedDate = format(
            new Date(appointmentData[0].appointmentDate),
            "d MMM yyyy"
          );
          const notificationPayloadUser = {
            title: "Appointment Update",
            body: `You have appointment on ${formattedDate} at ${appointmentData[0].time}`,
          };
          const notificationPayloadTherapist = {
            title: `A new appointment has been booked`,
            body: `You have appointment on ${formattedDate} at ${appointmentData[0].time}`,
          };
          const notificationPayloadStaff = {
            title: `A new appointment has been booked`,
            body: `A new appointment with Physiotherapist ${therapistName} has been scheduled`,
          };

          // Send notifications
          if (therapistID) {
            await sendNotificationToUser(
              therapistUserID[0].userID,
              notificationPayloadTherapist
            );
          }
          if (staffID) {
            await sendNotificationToUser(
              staffUserID[0].userID,
              notificationPayloadStaff
            );
          }
          if (patientID) {
            await sendNotificationToUser(
              patientUserID[0].userID,
              notificationPayloadUser
            );
          }
        } else {
          return jsonResponse({ error: "No payment data updated" }, 500);
        }

        return jsonResponse({ message: "Payment has been paid" }, 200);
      } else {
        const paymentData = await db
          .update(payments)
          .set({
            paymentDate: new Date().toISOString(),
            paymentMethod: session.payment_method_types[0],
            paymentStatus: session.payment_status,
          })
          .where(eq(payments.transactionReference, session.id))
          .returning()
          .execute();

        console.log("Payment Data {service}:", paymentData);

        if (paymentData.length > 0) {
          const { appointmentID } = paymentData[0]; // Access the first item
          const appointmentData = await db
            .update(appointments)
            .set({ status: "Cancelled" })
            .where(eq(appointments.appointmentID, appointmentID)) // Use the first item's appointmentID
            .returning()
            .execute();
        } else {
          return jsonResponse({ error: "No payment data updated" }, 500);
        }
        return jsonResponse({ message: "Payment has been cancelled" }, 200);
      }
    } catch (error) {
      console.error("Error updating payment data:", error);
      return jsonResponse({ error: "Error updating payment data" }, 500);
    }
  } catch (error) {
    console.error("Error fetching checkout session:", error);
    throw new Error("Unable to fetch checkout session");
  }
}
