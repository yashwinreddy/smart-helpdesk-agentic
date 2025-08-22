import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["admin", "agent", "user"], default: "user" },
  },
  { timestamps: true }
);

// Compare plaintext password with hashed password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password_hash); // updated to match schema
};

const User = mongoose.model("User", userSchema);
export default User;
