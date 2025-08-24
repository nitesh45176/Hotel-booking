import transporter from "../configs/nodemailer.js";
import { Booking } from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Function to check availability of room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    console.log("🔍 Checking availability for:", { room, checkInDate, checkOutDate });
    
    const requestCheckIn = new Date(checkInDate);
    const requestCheckOut = new Date(checkOutDate);
    
    const conflictingBookings = await Booking.find({
      room,
      $or: [
        {
          checkInDate: { $lte: requestCheckIn },
          checkOutDate: { $gt: requestCheckIn }
        },
        {
          checkInDate: { $lt: requestCheckOut },
          checkOutDate: { $gte: requestCheckOut }
        },
        {
          checkInDate: { $gte: requestCheckIn },
          checkOutDate: { $lte: requestCheckOut }
        }
      ]
    });
    
    console.log("🔍 Found conflicting bookings:", conflictingBookings.length);
    return conflictingBookings.length === 0;
  } catch (error) {
    console.error("❌ Error checking availability:", error.message);
    return false;
  }
};

// API to check availability of room
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Function to send booking confirmation email
const sendBookingConfirmationEmail = async (booking, userEmail, username, roomData) => {
  try {
    console.log("📧 Attempting to send email to:", userEmail);
    
    const mailOptions = {
      from: {
        name: 'Hotel Booking System',
        address: process.env.SENDER_EMAIL
      },
      to: userEmail,
      subject: 'Hotel Booking Confirmation - Booking ID: ' + booking._id,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .booking-details { background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmation</h1>
            </div>
            
            <div class="content">
              <p>Dear ${username},</p>
              <p>Thank you for your booking! Your reservation has been confirmed.</p>
              
              <div class="booking-details">
                <h3>Booking Details:</h3>
                <p><strong>Booking ID:</strong> ${booking._id}</p>
                <p><strong>Hotel:</strong> ${roomData.hotel.name}</p>
                <p><strong>Address:</strong> ${roomData.hotel.address}</p>
                <p><strong>Room Type:</strong> ${roomData.name}</p>
                <p><strong>Check-in Date:</strong> ${new Date(booking.checkInDate).toDateString()}</p>
                <p><strong>Check-out Date:</strong> ${new Date(booking.checkOutDate).toDateString()}</p>
                <p><strong>Number of Guests:</strong> ${booking.guests}</p>
                <p><strong>Total Amount:</strong> ${process.env.CURRENCY || '$'}${booking.totalPrice}</p>
              </div>
              
              <p>We look forward to welcoming you! If you have any questions or need to make changes to your booking, please contact us.</p>
            </div>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Also include plain text version
      text: `
        Booking Confirmation
        
        Dear ${username},
        
        Thank you for your booking! Your reservation has been confirmed.
        
        Booking Details:
        - Booking ID: ${booking._id}
        - Hotel: ${roomData.hotel.name}
        - Address: ${roomData.hotel.address}
        - Room Type: ${roomData.name}
        - Check-in Date: ${new Date(booking.checkInDate).toDateString()}
        - Check-out Date: ${new Date(booking.checkOutDate).toDateString()}
        - Number of Guests: ${booking.guests}
        - Total Amount: ${process.env.CURRENCY || '$'}${booking.totalPrice}
        
        We look forward to welcoming you!
      `
    };

    console.log("📧 Mail options prepared:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response
    });
    
    return { success: true, info };
  } catch (error) {
    console.error("❌ Email sending failed:", {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    return { success: false, error: error.message };
  }
};

// API to create a new booking
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user.userId;

    console.log("🔍 Creating booking with data:", { user, room, checkInDate, checkOutDate, guests });

    // Validate input data
    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.json({ success: false, message: "Missing required booking information" });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkIn >= checkOut) {
      return res.json({ success: false, message: "Check-out date must be after check-in date" });
    }

    // Get room data first
    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    // Check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available for the selected dates" });
    }

    // Calculate total price
    let totalPrice = roomData.pricePerNight;
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    totalPrice *= nights;

    // Create booking
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: Number(guests),
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      totalPrice
    });

    console.log("✅ Booking created successfully:", booking._id);

    // Send confirmation email
    const emailResult = await sendBookingConfirmationEmail(
      booking,
      req.user.email,
      req.user.username,
      roomData
    );

    if (emailResult.success) {
      console.log("📧 Confirmation email sent successfully");
    } else {
      console.warn("⚠️ Failed to send confirmation email:", emailResult.error);
    }

    // Always return success if booking was created
    res.json({ 
      success: true, 
      message: "Booking created successfully", 
      booking: {
        _id: booking._id,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        totalPrice: booking.totalPrice,
        guests: booking.guests
      },
      emailSent: emailResult.success
    });
    
  } catch (error) {
    console.error("❌ Booking creation error:", error);
    
    if (error.code === 11000) {
      res.json({ success: false, message: "A booking already exists for these dates" });
    } else {
      res.json({ success: false, message: "Failed to create booking: " + error.message });
    }
  }
};

// API to get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user.userId;
    const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("❌ Get user bookings error:", error);
    res.json({ success: false, message: "Failed to fetch booking" });
  }
};

// API to get booking details for hotel owner
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No hotel found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
  } catch (error) {
    console.error("❌ Get hotel bookings error:", error);
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

// Test email function (optional - for debugging)
export const testEmail = async (req, res) => {
  try {
    const testMailOptions = {
      from: {
        name: 'Hotel Booking System',
        address: process.env.SENDER_EMAIL
      },
      to: req.user.email,
      subject: 'Test Email from Hotel Booking System',
      html: '<h1>Test Email</h1><p>If you receive this, your email configuration is working!</p>',
      text: 'Test Email - If you receive this, your email configuration is working!'
    };

    const info = await transporter.sendMail(testMailOptions);
    console.log("✅ Test email sent:", info);
    
    res.json({ 
      success: true, 
      message: "Test email sent successfully",
      info: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected
      }
    });
  } catch (error) {
    console.error("❌ Test email failed:", error);
    res.json({ 
      success: false, 
      message: "Test email failed", 
      error: error.message 
    });
  }
};