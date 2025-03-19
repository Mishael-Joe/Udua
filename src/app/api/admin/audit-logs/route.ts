import { connectToDB } from "@/lib/mongoose";
import { type NextRequest, NextResponse } from "next/server";
import { AuditLog } from "@/lib/models/audit-log.model";
import { verifyAdminToken, getAdminPermissions } from "@/lib/rbac/jwt-utils";
import { logAdminAction } from "@/lib/audit/audit-logger";

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const adminId = searchParams.get("adminId");
    const action = searchParams.get("action");
    const myModule = searchParams.get("myModule");
    const resourceId = searchParams.get("resourceId");
    const resourceType = searchParams.get("resourceType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    // console.log("adminId", adminId);

    // Build query
    const query: any = {};
    if (adminId) query.adminId = adminId;
    if (action) query.action = action;
    if (myModule) query.myModule = myModule;
    if (resourceId) query.resourceId = resourceId;
    if (resourceType) query.resourceType = resourceType;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalLogs = await AuditLog.countDocuments(query);
    const totalPages = Math.ceil(totalLogs / limit);

    // Fetch audit logs with pagination
    const auditLogs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Log this action
    // we have too many logs in the data base
    // await logAdminAction(tokenData, {
    //   action: "VIEW_AUDIT_LOGS",
    //   myModule: "AUDIT",
    //   details: {
    //     filters: {
    //       adminId,
    //       action,
    //       myModule,
    //       resourceId,
    //       resourceType,
    //       startDate,
    //       endDate,
    //     },
    //   },
    // });

    return NextResponse.json({
      auditLogs,
      pagination: {
        page,
        limit,
        totalLogs,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
