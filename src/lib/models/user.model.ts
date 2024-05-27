import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: "string", required: true },
  lastName: { type: "string", required: true },
  otherNames: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
  phoneNumber: { type: "string", required: true, unique: true },
  address: { type: "string", required: true },
  cityOfResidence: { type: "string", required: true },
  stateOfResidence: { type: "string", required: true },
  postalCode: { type: "string", required: true },
  isVarified: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: false },
  userProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: `Product` }],
  forgotpasswordToken: String,
  forgotpasswordTokenExpiry: Date,
  varifyToken: String,
  varifyTokenExpiry: Date,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
