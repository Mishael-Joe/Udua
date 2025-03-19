import mongoose, { Schema, Document } from "mongoose";
import type { Role } from "../rbac/permissions";

interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  roles: Role[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    roles: {
      type: [String],
      required: true,
      enum: [
        "super_admin",
        "product_admin",
        "order_admin",
        "store_admin",
        "customer_support_admin",
        "finance_admin",
      ],
      default: [],
    },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Admin =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
