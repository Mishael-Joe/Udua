import { type NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, getAdminPermissions } from "@/lib/rbac/jwt-utils";
import { Admin } from "@/lib/models/admin.model";
import { connectToDB } from "@/lib/mongoose";

export async function GET(request: NextRequest) {
  try {
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

    // Connect to database to get the latest admin data
    await connectToDB();

    // Get admin from database to ensure they're still active
    const admin = await Admin.findById(tokenData.id).select("-password");

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: "Admin account not found or inactive" },
        { status: 403 }
      );
    }

    // Get permissions based on roles
    const permissions = getAdminPermissions(tokenData.roles);

    return NextResponse.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        roles: admin.roles,
      },
      permissions,
    });
  } catch (error) {
    console.error("Error verifying admin auth:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
