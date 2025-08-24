import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Get token from Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated - no token provided" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user by decoded id
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // 🔑 Attach simplified user object to request
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    console.log("✅ Authenticated user:", req.user.email, "ID:", req.user.userId);
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return res.status(401).json({ success: false, message: "Authentication failed", error: error.message });
  }
};
