import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/product.model";
import { logAdminAction } from "@/lib/audit/audit-logger";
import { getAdminPermissions, verifyAdminToken } from "@/lib/rbac/jwt-utils";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { productID, note } = requestBody as {
    productID: string;
    note: string;
  };

  try {
    await connectToDB();

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

    // Check if the requester has UNVERIFY_PRODUCT permission
    const permissions = getAdminPermissions(tokenData.roles);
    if (!permissions.includes("unverify_product")) {
      return NextResponse.json(
        { error: "You don't have permission to create admin users" },
        { status: 403 }
      );
    }

    const product = await Product.findById(productID);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 401 });
    }

    product.isVerifiedProduct = false;
    await product.save();

    // Log this action
    await logAdminAction(
      tokenData,
      {
        action: "UNVERIFY_PRODUCT",
        myModule: "PRODUCT_UNVERIFICATION",
        resourceId: productID.toString(),
        resourceType: "physicalproducts",
        details: { productID, note },
      },
      request
    );

    return NextResponse.json(
      { message: `successful`, data: product },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
