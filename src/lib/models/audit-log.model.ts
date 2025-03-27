import mongoose, { Schema, type Document } from "mongoose";
import type { Role } from "../rbac/permissions";
/*
 *  All monetary values are stored in kobo so as to avoid Floating-Point Errors in JavaScript.
 */
export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  adminEmail: string;
  adminRoles: Role[];
  action: string;
  myModule: string; // changed from module due to it being a reserve key word
  resourceId?: string;
  resourceType?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminRoles: { type: [String], required: true },
    action: { type: String, required: true },
    myModule: { type: String, required: true },
    resourceId: { type: String },
    resourceType: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Create indexes for better query performance
AuditLogSchema.index({ adminId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ module: 1 });
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ resourceId: 1, resourceType: 1 });

export const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
