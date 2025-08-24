// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Don’t return password in queries by default
    },
    image: {
      type: String, // Profile picture (optional if not required)
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "hotelOwner"],
      default: "user",
    },
    recentSearchedCities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// 🔑 Hash password before saving
userSchema.pre("save", async function (next){
    if (!this.isModified("password")) 
        return next()
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.comparePassword = async function(candidatePassoword){
    return await bcrypt.compare(candidatePassoword, this.password)
}

const User = mongoose.model("User", userSchema);
export default User;
