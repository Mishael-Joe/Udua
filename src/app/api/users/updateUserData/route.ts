import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { firstName, lastName, otherNames, phoneNumber, email } = requestBody;
  try {
    connectToDB();
    const accountId = await getUserDataFromToken(request);

    // Update User model
    const response = await User.findByIdAndUpdate(accountId, {
      firstName: firstName,
      lastName: lastName,
      otherNames: otherNames,
      phoneNumber: phoneNumber,
      email: email,
      isVerified: false,
    });

    return NextResponse.json(
      { message: `User created successfully`, response },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error updating user data: ${error}`);
  }
}
