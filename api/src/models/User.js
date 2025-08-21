import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "agent", "user"],  // strictly as PDF
      required: true,
      default: "user",
    },
    password_hash: { type: String, required: true }, // strictly as PDF
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
