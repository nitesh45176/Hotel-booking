import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Atlas connected");
    console.log("📦 Database:", conn.connection.name);
  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
    throw error; // ⬅️ VERY IMPORTANT
  }
};

export default connectDB;
