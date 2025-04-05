import { connectToDB } from "@/lib/mongoose";
import Deal from "@/lib/models/deal.model";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";
import { type NextRequest, NextResponse } from "next/server";

/**
 * GET /api/deals
 * Fetches active deals with their associated products
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const searchParams = request.nextUrl.searchParams;
    const limit = Number.parseInt(searchParams.get("limit") || "6", 10);

    const now = new Date();

    // Find active deals
    const deals = await Deal.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ endDate: 1 }) // Sort by end date (soonest ending first)
      .limit(limit);

    // Get all product IDs from the deals
    const productIds = deals.reduce((ids: string[], deal) => {
      if (deal.productIds && deal.productIds.length > 0) {
        return [...ids, ...deal.productIds];
      }
      return ids;
    }, []);

    // Fetch all products in a single query - include sizes field
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "_id name price images productType sizes"
    );

    // Fetch all digital products in a single query
    const digitalProducts = await EBook.find({
      _id: { $in: productIds },
    }).select("_id title price coverIMG productType");

    // Combine products and digital products
    const allProducts = [...products, ...digitalProducts];

    // Create a map for quick lookup
    const productMap = allProducts.reduce((map: any, product) => {
      map[product._id.toString()] = product;
      return map;
    }, {});

    // Attach products to each deal
    const dealsWithProducts = deals.map((deal) => {
      const dealObj = deal.toObject();

      // Attach products to the deal
      dealObj.products = (deal.productIds || [])
        .map((id: string) => productMap[id.toString()])
        .filter(Boolean); // Remove any undefined products

      return dealObj;
    });

    return NextResponse.json({ success: true, deals: dealsWithProducts });
  } catch (error: any) {
    console.error("Error fetching active deals:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
