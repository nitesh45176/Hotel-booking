import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://hotel-booking-beta-ochre.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();           // ⬅️ WAIT HERE
    connectCloudinary();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
