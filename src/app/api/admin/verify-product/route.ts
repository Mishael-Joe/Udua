import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/product.model";
import { getAdminPermissions, verifyAdminToken } from "@/lib/rbac/jwt-utils";
import { logAdminAction } from "@/lib/audit/audit-logger";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productID = searchParams.get("productID");

  try {
    await connectToDB();

    const product = await Product.findById(productID);

    if (!product) {
      return NextResponse.json(
        { error: "product ID required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: `Product found`, data: product },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { productID } = requestBody as {
    productID: string;
  };
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

    // Check if the requester has VERIFY_PRODUCT permission
    const permissions = getAdminPermissions(tokenData.roles);
    if (!permissions.includes("verify_product")) {
      return NextResponse.json(
        { error: "You don't have permission to create admin users" },
        { status: 403 }
      );
    }
    await connectToDB();

    const product = await Product.findById(productID);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 401 });
    }

    product.isVerifiedProduct = true;
    await product.save();

    // Log this action
    await logAdminAction(
      tokenData,
      {
        action: "VERIFY_PRODUCT",
        myModule: "PRODUCT_VERIFICATION",
        resourceId: productID.toString(),
        resourceType: "physicalproducts",
        details: { product },
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
