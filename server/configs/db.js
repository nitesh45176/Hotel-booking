import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Atlas connected successfully");
    console.log("📦 Connected to DB:", conn.connection.name);
    console.log("🖥️ Connected to Cluster:", conn.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};

export default connectDB;
