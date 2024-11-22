import Stripe from "stripe";
import * as dotenv from "dotenv";
import * as path from "path";

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

export const createCheckoutSession = async () => {
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
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    return session.url;
  } catch (error) {
    console.error("Error creating Stripe Checkout Session:", error);
    throw new Error("Unable to create Stripe Checkout Session");
  }
};
