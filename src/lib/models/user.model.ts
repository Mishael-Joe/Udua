import mongoose, { Schema, Document } from "mongoose";
/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */
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
  followingStores: mongoose.Schema.Types.ObjectId[];
  stores: {
    storeId: mongoose.Schema.Types.ObjectId;
  }[];
  forgotpasswordToken?: string;
  forgotpasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
}

const userSchema = new Schema<IUser>(
  {
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
    followingStores: [{ type: mongoose.Schema.Types.ObjectId, ref: "stores" }],
    stores: [
      { storeId: { type: mongoose.Schema.Types.ObjectId, ref: "stores" } },
    ],
    forgotpasswordToken: String,
    forgotpasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
