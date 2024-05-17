import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
  phoneNumber: { type: "string", required: true, unique: true },
  address: { type: "string", required: true },
  isVarified: { type: Boolean, default: false },
  forgotpasswordToken: String,
  forgotpasswordTokenExpiry: Date,
  varifyToken: String,
  varifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("User", userSchema);

export default User;
