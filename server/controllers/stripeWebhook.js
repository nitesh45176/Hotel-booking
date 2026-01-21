import Stripe from "stripe";
import { Booking } from "../models/Booking.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
     console.log("🔥 Stripe webhook HIT");
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Stripe event:", event.type);

  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        console.error("❌ No bookingId in metadata");
        return res.status(400).json({ received: true });
      }
      console.log("Metadata:", session.metadata);


      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        status: "confirmed",
        paymentMethod: "Stripe",
      });

      console.log("✅ Booking marked as paid:", bookingId);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Webhook handler failed:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};
