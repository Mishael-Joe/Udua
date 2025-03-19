import type { NextRequest } from "next/server";
import { AuditLog } from "../models/audit-log.model";
import { connectToDB } from "../mongoose";
import type { AdminTokenPayload } from "../rbac/jwt-utils";

export interface AuditLogData {
  action: string;
  myModule: string;
  resourceId?: string;
  resourceType?: string;
  details?: Record<string, any>;
}

/**
 * Logs an admin action to the audit trail
 */
export async function logAdminAction(
  adminData: AdminTokenPayload,
  logData: AuditLogData,
  request?: NextRequest
): Promise<void> {
  try {
    await connectToDB();

    const auditLog = new AuditLog({
      adminId: adminData.id,
      adminName: adminData.name || "Unknown",
      adminEmail: adminData.email || "Unknown",
      adminRoles: adminData.roles || [],
      action: logData.action,
      myModule: logData.myModule,
      resourceId: logData.resourceId,
      resourceType: logData.resourceType,
      details: logData.details,
      ipAddress:
        //   @ts-ignore
        request?.ip || request?.headers.get("x-forwarded-for") || "Unknown",
      userAgent: request?.headers.get("user-agent") || "Unknown",
    });

    await auditLog.save();
  } catch (error) {
    console.error("Error logging admin action:", error);
    // Don't throw the error - we don't want to interrupt the main flow
    // if audit logging fails
  }
}

/**
 * Creates a middleware that logs admin actions
 */
export function createAuditMiddleware(myModule: string) {
  return async function auditMiddleware(
    req: NextRequest,
    adminData: AdminTokenPayload,
    action: string,
    resourceId?: string,
    resourceType?: string,
    details?: Record<string, any>
  ) {
    await logAdminAction(
      adminData,
      {
        action,
        myModule,
        resourceId,
        resourceType,
        details,
      },
      req
    );
  };
}
