import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    connectToDB();
    const userID = await getUserDataFromToken(request);
    const user = await User.findById(userID).select(
      "firstName lastName otherNames email phoneNumber address cityOfResidence stateOfResidence postalCode isVarified"
    );

    return NextResponse.json(
      { message: `user found`, data: user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    throw new Error(`Error getting user data from token:`, error.message);
  }
}