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
      "_id firstName lastName otherNames email phoneNumber address cityOfResidence stateOfResidence postalCode isVerified isSeller"
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

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { sellerID, type } = requestBody;
  // console.log("sellerID", sellerID);

  if (type === "verifyUser") {
    try {
      await connectToDB();

      const user = await User.findById(sellerID);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }

      user.isSeller = true;
      await user.save();

      return NextResponse.json(
        { message: `successful`, data: user },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: `Error: ${error.message}` },
        { status: 500 }
      );
    }
  }

  if (type === "UnVerifyUser") {
    try {
      await connectToDB();

      const user = await User.findById(sellerID);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }

      user.isSeller = false;
      await user.save();

      return NextResponse.json(
        { message: `successful`, data: user },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: `Error: ${error.message}` },
        { status: 500 }
      );
    }
  }
}
