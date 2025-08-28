import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// ✅ CRITICAL: Load environment variables FIRST, before importing other modules
dotenv.config();

// 🔍 Debug environment variables immediately after loading
console.log("🔧 Environment Variables Check:");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing");
console.log("SMTP_USER:", process.env.SMTP_USER ? "✅ Loaded" : "❌ Missing");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ Loaded" : "❌ Missing");
console.log("SENDER_EMAIL:", process.env.SENDER_EMAIL ? "✅ Loaded" : "❌ Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");

// Now import other modules AFTER dotenv.config()
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import rooomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import authRouter from './routes/authRoutes.js';

// ✅ Import models for debug routes
import User from './models/User.js';
import { Booking } from './models/Booking.js';

// Initialize connections
connectCloudinary();
connectDB();

const app = express();

app.use(cors({
  origin: "https://hotel-booking-umber-phi.vercel.app", // your frontend dev URL
  credentials: true
}));

app.use(express.json());

// 🔎 Sample test route
app.get('/', (req, res) => {
  res.send("API is working");
});

// 🧪 SMTP Test Route - Add this to test SMTP configuration
app.get('/api/debug/smtp-test', async (req, res) => {
  try {
    console.log("🧪 Testing SMTP configuration...");
    
    // Import the transporter dynamically to avoid early import issues
    const { default: transporter } = await import('./configs/nodemailer.js');
    
    const testMailOptions = {
      from: {
        name: 'Hotel Booking System Test',
        address: process.env.SENDER_EMAIL
      },
      to: process.env.SENDER_EMAIL, // Send to yourself for testing
      subject: 'SMTP Test - ' + new Date().toISOString(),
      html: '<h1>SMTP Test</h1><p>If you receive this, your SMTP configuration is working!</p>',
      text: 'SMTP Test - If you receive this, your SMTP configuration is working!'
    };

    console.log("📧 Attempting to send test email...");
    const info = await transporter.sendMail(testMailOptions);
    
    console.log("✅ Test email sent successfully:", info);
    res.json({ 
      success: true, 
      message: "Test email sent successfully",
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    });
  } catch (error) {
    console.error("❌ SMTP test failed:", error);
    res.json({ 
      success: false, 
      message: "SMTP test failed", 
      error: error.message,
      code: error.code
    });
  }
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

// Your existing routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', rooomRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔍 Debug routes available:`);
  console.log(`   - GET http://localhost:${PORT}/api/debug/users`);
  console.log(`   - GET http://localhost:${PORT}/api/debug/smtp-test`);
  console.log(`   - POST http://localhost:${PORT}/api/debug/test-booking`);
});