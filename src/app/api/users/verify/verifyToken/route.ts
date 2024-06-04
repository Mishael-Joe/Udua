import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { token } = requestBody;
  // console.log(`requestBody`, requestBody);

  try {
    connectToDB();
    const userID = await getUserDataFromToken(request);
    console.log(`userID`, userID);

    if (userID !== null) {
      const user = await User.findById(userID);
      const savedToken = user.verifyToken;
      const tokenExpiry = new Date(user.verifyTokenExpiry).getTime();
      const date = Date.now();

      console.log(`savedToken`, savedToken);
      console.log(`token`, token);
      console.log(`date`, date);
      console.log(`tokenExpiry`, tokenExpiry);

      if (
        savedToken.toString() === token.toString() &&
        Date.now() < tokenExpiry
      ) {
        user.isVerified = true;
        user.verifyToken = "";
        user.verifyTokenExpiry = "";
        await user.save();
        return NextResponse.json({ message: `Successful` }, { status: 200 });
      } else {
        return NextResponse.json({ message: `Invalid Token` }, { status: 401 });
      }
    } else {
      return NextResponse.json(
        { message: `An Error Occurred` },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
