import Stripe from "stripe";
import { Booking } from "../models/Booking.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // ✅ CASE 1: Checkout Session (recommended)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        status: "confirmed",
        paymentMethod: "Stripe",
      });

      console.log("✅ Booking paid via checkout.session.completed");
    }

    // ✅ CASE 2: Payment Intent (Stripe is sending this)
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;

      // Retrieve session to get metadata
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: intent.id,
      });

      const bookingId = sessions.data[0]?.metadata?.bookingId;

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          status: "confirmed",
          paymentMethod: "Stripe",
        });

        console.log("✅ Booking paid via payment_intent.succeeded");
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook processing failed:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};

