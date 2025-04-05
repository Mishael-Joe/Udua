import { connectToDB } from "@/lib/mongoose";
import Deal from "@/lib/models/deal.model";
import { type NextRequest, NextResponse } from "next/server";

/**
 * GET /api/products/[id]/deals
 * Fetches active deals for a specific product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params;

    const productId = id;
    const now = new Date();

    // Find active deals that include this product
    const deals = await Deal.find({
      productIds: { $in: [productId] },
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ value: -1 }); // Sort by highest value first

    if (!deals || deals.length === 0) {
      return NextResponse.json({ success: true, hasDeals: false });
    }

    // If multiple deals apply, prioritize based on deal type and value
    let bestDeal = deals[0];

    // For percentage deals, higher percentage is better
    // For fixed deals, higher amount is better
    // For flash sales, prioritize them over regular deals
    if (deals.length > 1) {
      // First prioritize flash sales
      const flashSales = deals.filter((deal) => deal.dealType === "flash_sale");
      if (flashSales.length > 0) {
        // Sort flash sales by highest value
        flashSales.sort((a, b) => b.value - a.value);
        bestDeal = flashSales[0];
      } else {
        // If no flash sales, find the deal with the highest discount
        deals.sort((a, b) => {
          // For percentage deals, higher percentage is better
          if (a.dealType === "percentage" && b.dealType === "percentage") {
            return b.value - a.value;
          }
          // For fixed deals, higher amount is better
          if (a.dealType === "fixed" && b.dealType === "fixed") {
            return b.value - a.value;
          }
          // Prioritize percentage deals over fixed for high-value items
          if (a.dealType === "percentage" && b.dealType === "fixed") {
            return 1; // Percentage first
          }
          if (a.dealType === "fixed" && b.dealType === "percentage") {
            return -1; // Percentage first
          }
          // Sort by end date (sooner ending first) if same type and value
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        });
        bestDeal = deals[0];
      }
    }

    return NextResponse.json({
      success: true,
      hasDeals: true,
      deal: bestDeal,
    });
  } catch (error: any) {
    console.error("Error fetching product deals:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
