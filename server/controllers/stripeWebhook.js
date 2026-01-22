import Stripe from "stripe";
import { Booking } from "../models/Booking.js";
import Room from "../models/Room.js"; // ✅ Added

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
   console.log("🔥 STRIPE WEBHOOK HIT");
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

      if (!bookingId) {
        console.error("❌ No bookingId in session metadata");
        return res.status(400).json({ error: "Missing bookingId" });
      }

      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          isPaid: true,
          status: "confirmed",
          paymentMethod: "Stripe",
        },
        { new: true } // ✅ Returns updated document
      );

      if (!updatedBooking) {
        console.error("❌ Booking not found:", bookingId);
        return res.status(404).json({ error: "Booking not found" });
      }

      console.log("✅ Booking paid via checkout.session.completed:", updatedBooking);
    }

    // ✅ CASE 2: Payment Intent (fallback)
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;

      const sessions = await stripe.checkout.sessions.list({
        payment_intent: intent.id,
        limit: 1,
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

export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const roomData = await Room.findById(booking.room).populate("hotel");

    if (!roomData) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: roomData.hotel.name,
              description: `Room booking from ${booking.checkInDate.toLocaleDateString()} to ${booking.checkOutDate.toLocaleDateString()}`,
            },
            unit_amount: Math.round(booking.totalPrice * 100), // ✅ Ensure integer
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/my-bookings?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/my-bookings?payment=cancel`,
      metadata: {
        bookingId: bookingId.toString(), // ✅ Ensure string
      },
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Stripe payment failed",
      error: error.message,
    });
  }
};