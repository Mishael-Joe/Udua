import { connectToDB } from "@/lib/mongoose";
import Deal from "@/lib/models/deal.model";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";
import { type NextRequest, NextResponse } from "next/server";

/**
 * GET /api/deals/[id]
 * Fetches a specific deal by ID with its associated products
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();

    const { id } = await params;

    // Find the deal
    const deal = await Deal.findById(id);

    if (!deal) {
      return NextResponse.json(
        { success: false, error: "Deal not found" },
        { status: 404 }
      );
    }

    // Get product IDs from the deal
    const productIds = deal.productIds || [];

    // Fetch products - include sizes field
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "_id name price images productType sizes"
    );

    // Fetch digital products
    const digitalProducts = await EBook.find({
      _id: { $in: productIds },
    }).select("_id title price coverIMG productType");

    // Combine products and digital products
    const allProducts = [...products, ...digitalProducts];

    // Create deal object with products
    const dealObj = deal.toObject();
    dealObj.products = allProducts;

    return NextResponse.json({ success: true, deal: dealObj });
  } catch (error: any) {
    console.error("Error fetching deal by ID:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
