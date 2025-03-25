import { Admin } from "@/lib/models/admin.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { logAdminAction } from "@/lib/audit/audit-logger";
import { getAdminPermissions, verifyAdminToken } from "@/lib/rbac/jwt-utils";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { email, oldPassword, newPassword } = requestBody;

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

    // Validate request body
    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" }, // Generic message for security
        { status: 401 }
      );
    }

    // Verify old password
    const isPasswordValid = await bcryptjs.compare(oldPassword, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" }, // Generic message for security
        { status: 401 }
      );
    }

    // Check if new password is different
    const isSamePassword = await bcryptjs.compare(newPassword, admin.password);
    if (isSamePassword) {
      return NextResponse.json(
        { message: "New password must be different from old password" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          message:
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    // Log this action
    await logAdminAction(
      tokenData,
      {
        action: "ADMIN_PASSWORD_UPDATE",
        myModule: "AUTHENTICATION",
        details: { email: admin.email, permissions },
      },
      request
    );

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" }, // Generic error message
      { status: 500 }
    );
  }
}
