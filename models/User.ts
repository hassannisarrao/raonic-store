import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    
    // Loyalty & VIP System Data
    totalSpent: { type: Number, default: 0 },
    tier: { type: String, default: "Member" }, // Tiers: Member, Executive, Black
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;