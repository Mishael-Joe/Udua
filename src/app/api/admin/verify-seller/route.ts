import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sellerID = searchParams.get("sellerID");
  // console.log("sellerID", sellerID);

  try {
    await connectToDB();

    const user = await User.findById(sellerID).select(
      "_id firstName lastName otherNames email phoneNumber address cityOfResidence stateOfResidence postalCode isVerified"
    );

    if (!user) {
      return NextResponse.json(
        { error: "seller ID required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: `Seller found`, data: user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
