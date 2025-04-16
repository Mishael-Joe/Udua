import { connectToDB } from "@/lib/mongoose";
import { type NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { Admin } from "@/lib/models/admin.model";
import { ROLES, type Role } from "@/lib/rbac/permissions";
import { verifyAdminToken, getAdminPermissions } from "@/lib/rbac/jwt-utils";
import { logAdminAction } from "@/lib/audit/audit-logger";

export async function POST(request: NextRequest) {
  try {
    // Verify that the requester is a super admin
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
        { error: "You don't have permission to create admin users" },
        { status: 403 }
      );
    }

    const requestBody = await request.json();
    const { name, email, password, roles } = requestBody;

    // Validate input
    if (
      !name ||
      !email ||
      !password ||
      !roles ||
      !Array.isArray(roles) ||
      roles.length === 0
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate roles
    const validRoles = Object.values(ROLES);
    const invalidRoles = roles.filter(
      (role) => !validRoles.includes(role as Role)
    );
    if (invalidRoles.length > 0) {
      return NextResponse.json(
        { error: `Invalid roles: ${invalidRoles.join(", ")}` },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if admin with this email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      roles,
      isActive: true,
    });

    await newAdmin.save();

    // Log this action
    await logAdminAction(
      tokenData,
      {
        action: "CREATE_ADMIN",
        myModule: "ADMIN_MANAGEMENT",
        resourceId: newAdmin._id.toString(),
        resourceType: "Admin",
        details: { newAdmin },
      },
      request
    );

    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          roles: newAdmin.roles,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
