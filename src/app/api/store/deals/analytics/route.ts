import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Deal from "@/lib/models/deal.model";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";

export async function POST(request: NextRequest) {
  await connectToDB();

  const storeID = await getStoreIDFromToken(request);

  try {
    const deals = await Deal.find({ storeID: storeID }).select("analytics");
    // console.log("deals", deals);
    if (deals.length === 0) {
      return NextResponse.json({
        success: true,
        data: [
          {
            title: "No deals found",
            redemptionCount: 0,
            revenueGenerated: 0,
          },
        ],
      });
    }
    return NextResponse.json({ success: true, data: deals });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
