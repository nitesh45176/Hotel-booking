import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,  // ✅ Changed from String to ObjectId
        required: true,  // ✅ Fixed typo: 'require' -> 'required'
        ref: "User"
    },
    
    room: {
        type: mongoose.Schema.Types.ObjectId,  // ✅ Changed from String to ObjectId
        required: true,  // ✅ Fixed typo
        ref: "Room"
    },
    
    hotel: {
        type: mongoose.Schema.Types.ObjectId,  // ✅ Changed from String to ObjectId
        required: true,  // ✅ Fixed typo
        ref: "Hotel"
    },
    
    checkInDate: {
        type: Date,
        required: true,  // ✅ Fixed typo
    },
    
    checkOutDate: {  // ✅ Fixed typo: 'checOutDate' -> 'checkOutDate'
        type: Date,
        required: true,  // ✅ Fixed typo
    },
    
    totalPrice: {
        type: Number,
        required: true,  // ✅ Changed from 'default: true' to 'required: true'
    },
    
    guests: {  // ✅ Make sure this matches the controller
        type: Number,
        required: true,  // ✅ Fixed typo
    },
    
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    
    paymentMethod: {
        type: String,
        required: true,  // ✅ Fixed typo
        default: "Pay At Hotel"
    },
    
    isPaid: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);