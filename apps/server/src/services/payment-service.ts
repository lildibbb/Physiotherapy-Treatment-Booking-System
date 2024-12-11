import Stripe from "stripe";
import * as dotenv from "dotenv";
import * as path from "path";
import type { Payment } from "../../types";
import jsonResponse from "./auth-services";
import { appointments, payments } from "../schema";
import db from "../db";
import { eq } from "drizzle-orm";

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

export const createCheckoutSession = async (appointmentID: number) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "fpx"],
      submit_type: "book",
      line_items: [
        {
          price: "price_1QNWvrGH6JXUmBKomzBv7qLq", // Use the predefined Stripe Price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "http://localhost:3000/checkout/cancel?session_id={CHECKOUT_SESSION_ID}",
    });
    const price = await fetchPriceDetails("price_1QNWvrGH6JXUmBKomzBv7qLq");
    const { unit_amount_decimal } = price;
    const formattedAmount = (Number(unit_amount_decimal) / 100).toFixed(2);
    console.log("unit amount: ", formattedAmount);
    console.log("appointemntID in service: ", appointmentID);
    const paymentData = await createPaymentData({
      amount: formattedAmount,
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
          const appointmentData = await db
            .update(appointments)
            .set({ status: "Ongoing" })
            .where(eq(appointments.appointmentID, appointmentID)) // Use the first item's appointmentID
            .returning()
            .execute();
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
