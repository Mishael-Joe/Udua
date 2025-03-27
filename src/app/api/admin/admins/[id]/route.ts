import { connectToDB } from "@/lib/mongoose";
import { type NextRequest, NextResponse } from "next/server";
import { Admin } from "@/lib/models/admin.model";
import { verifyAdminToken, getAdminPermissions } from "@/lib/rbac/jwt-utils";
import { logAdminAction } from "@/lib/audit/audit-logger";

// PUT: Update an admin
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
        { error: "You don't have permission to update admin users" },
        { status: 403 }
      );
    }

    const { name, email, roles, isActive, password } = await request.json();

    await connectToDB();

    // Find the admin to update
    const admin = await Admin.findById(id);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Prevent deactivating the last super_admin
    if (admin.roles.includes("super_admin") && !isActive) {
      const superAdminCount = await Admin.countDocuments({
        roles: "super_admin",
        isActive: true,
        _id: { $ne: id },
      });

      if (superAdminCount === 0) {
        return NextResponse.json(
          { error: "Cannot deactivate the last super admin" },
          { status: 400 }
        );
      }
    }

    // Track changes for audit log
    const changes: Record<string, { before: any; after: any }> = {};

    // Update admin fields
    if (name && name !== admin.name) {
      changes.name = { before: admin.name, after: name };
      admin.name = name;
    }

    if (email && email !== admin.email) {
      changes.email = { before: admin.email, after: email };
      admin.email = email;
    }

    if (roles) {
      const rolesChanged =
        JSON.stringify(roles) !== JSON.stringify(admin.roles);
      if (rolesChanged) {
        changes.roles = { before: admin.roles, after: roles };
        admin.roles = roles;
      }
    }

    if (typeof isActive === "boolean" && isActive !== admin.isActive) {
      changes.isActive = { before: admin.isActive, after: isActive };
      admin.isActive = isActive;
    }

    // Update password if provided
    if (password) {
      changes.password = { before: "********", after: "********" };
      const bcryptjs = await import("bcryptjs");
      const salt = await bcryptjs.genSalt(10);
      admin.password = await bcryptjs.hash(password, salt);
    }

    await admin.save();

    // Log this action
    await logAdminAction(
      tokenData,
      {
        action: "UPDATE_ADMIN",
        myModule: "ADMIN_MANAGEMENT",
        resourceId: id,
        resourceType: "Admin",
        details: { changes },
      },
      request
    );

    return NextResponse.json({
      message: "Admin updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        roles: admin.roles,
        isActive: admin.isActive,
      },
    });
  } catch (error: any) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        { error: "You don't have permission to delete admin users" },
        { status: 403 }
      );
    }

    await connectToDB();

    // Find the admin to delete
    const admin = await Admin.findById(id);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Prevent deleting the last super_admin
    if (admin.roles.includes("super_admin")) {
      const superAdminCount = await Admin.countDocuments({
        roles: "super_admin",
        _id: { $ne: id },
      });

      if (superAdminCount === 0) {
        return NextResponse.json(
          { error: "Cannot delete the last super admin" },
          { status: 400 }
        );
      }
    }

    // Store admin data for audit log
    const adminData = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      roles: admin.roles,
    };

    // Delete the admin
    await Admin.findByIdAndDelete(id);

    // Log this action
    await logAdminAction(
      tokenData,
      {
        action: "DELETE_ADMIN",
        myModule: "ADMIN_MANAGEMENT",
        resourceId: id,
        resourceType: "Admin",
        details: { deletedAdmin: adminData },
      },
      request
    );

    return NextResponse.json({
      message: "Admin deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// import { connectToDB } from "@/lib/mongoose";
// import { type NextRequest, NextResponse } from "next/server";
// import { Admin } from "@/lib/models/admin.model";
// import { verifyAdminToken, getAdminPermissions } from "@/lib/rbac/jwt-utils";

// // PUT: Update an admin
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Verify that the requester is authorized
//     const adminToken = request.cookies.get("adminToken")?.value;
//     if (!adminToken) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const tokenData = await verifyAdminToken(adminToken);
//     if (!tokenData) {
//       return NextResponse.json(
//         { error: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }

//     // Check if the requester has MANAGE_ADMINS permission
//     const permissions = getAdminPermissions(tokenData.roles);
//     if (!permissions.includes("manage_admins")) {
//       return NextResponse.json(
//         { error: "You don't have permission to update admin users" },
//         { status: 403 }
//       );
//     }

//     const { id } = params;
//     const { name, email, roles, isActive, password } = await request.json();

//     await connectToDB();

//     // Find the admin to update
//     const admin = await Admin.findById(id);
//     if (!admin) {
//       return NextResponse.json({ error: "Admin not found" }, { status: 404 });
//     }

//     // Prevent deactivating the last super_admin
//     if (admin.roles.includes("super_admin") && !isActive) {
//       const superAdminCount = await Admin.countDocuments({
//         roles: "super_admin",
//         isActive: true,
//         _id: { $ne: id },
//       });

//       if (superAdminCount === 0) {
//         return NextResponse.json(
//           { error: "Cannot deactivate the last super admin" },
//           { status: 400 }
//         );
//       }
//     }

//     // Update admin fields
//     if (name) admin.name = name;
//     if (email) admin.email = email;
//     if (roles) admin.roles = roles;
//     if (typeof isActive === "boolean") admin.isActive = isActive;

//     // Update password if provided
//     if (password) {
//       const bcryptjs = await import("bcryptjs");
//       const salt = await bcryptjs.genSalt(10);
//       admin.password = await bcryptjs.hash(password, salt);
//     }

//     await admin.save();

//     return NextResponse.json({
//       message: "Admin updated successfully",
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         roles: admin.roles,
//         isActive: admin.isActive,
//       },
//     });
//   } catch (error: any) {
//     console.error("Error updating admin:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE: Delete an admin
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Verify that the requester is authorized
//     const adminToken = request.cookies.get("adminToken")?.value;
//     if (!adminToken) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const tokenData = await verifyAdminToken(adminToken);
//     if (!tokenData) {
//       return NextResponse.json(
//         { error: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }

//     // Check if the requester has MANAGE_ADMINS permission
//     const permissions = getAdminPermissions(tokenData.roles);
//     if (!permissions.includes("manage_admins")) {
//       return NextResponse.json(
//         { error: "You don't have permission to delete admin users" },
//         { status: 403 }
//       );
//     }

//     const { id } = params;

//     await connectToDB();

//     // Find the admin to delete
//     const admin = await Admin.findById(id);
//     if (!admin) {
//       return NextResponse.json({ error: "Admin not found" }, { status: 404 });
//     }

//     // Prevent deleting the last super_admin
//     if (admin.roles.includes("super_admin")) {
//       const superAdminCount = await Admin.countDocuments({
//         roles: "super_admin",
//         _id: { $ne: id },
//       });

//       if (superAdminCount === 0) {
//         return NextResponse.json(
//           { error: "Cannot delete the last super admin" },
//           { status: 400 }
//         );
//       }
//     }

//     // Delete the admin
//     await Admin.findByIdAndDelete(id);

//     return NextResponse.json({
//       message: "Admin deleted successfully",
//     });
//   } catch (error: any) {
//     console.error("Error deleting admin:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
