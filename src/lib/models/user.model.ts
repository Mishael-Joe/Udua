import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  otherNames: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  cityOfResidence: string;
  stateOfResidence: string;
  postalCode: string;
  isVerified: boolean;
  isSeller: boolean;
  userProducts: mongoose.Schema.Types.ObjectId[];
  forgotpasswordToken?: string;
  forgotpasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  otherNames: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  cityOfResidence: { type: String, required: true },
  stateOfResidence: { type: String, required: true },
  postalCode: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: false },
  userProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  forgotpasswordToken: String,
  forgotpasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
