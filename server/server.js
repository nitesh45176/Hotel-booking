import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import rooomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import authRouter from './routes/authRoutes.js';


// ✅ Import models for debug routes
import User from './models/User.js';
import { Booking } from './models/Booking.js';

dotenv.config();
connectCloudinary();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",   // your frontend dev URL
  credentials: true
}));

app.use(express.json());

// 🔎 Sample test route
app.get('/', (req, res) => {
  res.send("API is working");
});

// ✅ ========== DEBUG ROUTES (Optional - Keep for dev only) ==========

// 🔍 Debug route to check all users (PUBLIC - no auth needed)
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.find().limit(10);
    const userCount = await User.countDocuments();
    
    console.log("📊 Users in database:", userCount);
    users.forEach(user => {
      console.log(`👤 User: ${user.email} | Role: ${user.role}`);
    });
    
    res.json({ 
      success: true, 
      users: users.map(u => ({
        id: u._id,
        email: u.email,
        username: u.username,
        role: u.role
      })), 
      count: userCount 
    });
  } catch (error) {
    console.error("❌ Debug users error:", error);
    res.json({ success: false, error: error.message });
  }
});

// 🔍 Test booking creation (PUBLIC for testing)
app.post('/api/debug/test-booking', async (req, res) => {
  try {
    console.log("🧪 Testing booking creation...");
    console.log("📋 Request body:", req.body);
    
    // Get a test user
    const testUser = await User.findOne();
    if (!testUser) {
      return res.json({ success: false, message: "No users found in database" });
    }
    
    const testBooking = {
      user: testUser._id,
      room: "507f1f77bcf86cd799439011", // Dummy ObjectId
      hotel: "507f1f77bcf86cd799439012", // Dummy ObjectId
      checkInDate: new Date(),
      checkOutDate: new Date(Date.now() + 86400000), // Tomorrow
      totalPrice: 100,
      guests: 2
    };
    
    console.log("🧪 Attempting to create booking:", testBooking);
    const booking = await Booking.create(testBooking);
    res.json({ success: true, booking, message: "Test booking created successfully" });
  } catch (error) {
    console.error("❌ Test booking error:", error);
    res.json({ success: false, error: error.message, stack: error.stack });
  }
});

// ✅ ========== END DEBUG ROUTES ==========
app.use('/api/auth', authRouter)

// Your existing routes
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', rooomRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`🔍 Debug routes available:`);
  console.log(`   - GET http://localhost:${PORT}/api/debug/users`);
  console.log(`   - POST http://localhost:${PORT}/api/debug/test-booking`);
});
