import { connectToDB } from "@/lib/mongoose";
import { type NextRequest, NextResponse } from "next/server";
import { AuditLog } from "@/lib/models/audit-log.model";
import { verifyAdminToken, getAdminPermissions } from "@/lib/rbac/jwt-utils";
import { logAdminAction } from "@/lib/audit/audit-logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify that the requester is authorized
    const adminToken = request.cookies.get("adminToken")?.value;
    if (!adminToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const tokenData = await verifyAdminToken(adminToken);
    if (!tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Check if the requester has MANAGE_ADMINS permission
    const permissions = getAdminPermissions(tokenData.roles);
    if (!permissions.includes("manage_admins")) {
      return NextResponse.json(
        { error: "You don't have permission to view audit logs" },
        { status: 403 }
      );
    }

    await connectToDB();

    const { id } = await params;

    // Fetch the specific audit log
    const auditLog = await AuditLog.findById(id).lean();

    if (!auditLog) {
      return NextResponse.json(
        { error: "Audit log not found" },
        { status: 404 }
      );
    }

    // Log this action
    // await logAdminAction(tokenData, {
    //   action: "VIEW_AUDIT_LOG_DETAIL",
    //   myModule: "AUDIT",
    //   resourceId: id,
    //   resourceType: "AuditLog",
    // });

    return NextResponse.json({ auditLog });
  } catch (error: any) {
    console.error("Error fetching audit log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
