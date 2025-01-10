import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { token, newPassword } = requestBody;

  try {
    connectToDB();

    const user = await User.findOne({ forgotpasswordToken: token });

    if (!user) {
      return NextResponse.json(
        { message: `Invalid or expired token` },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);
    const savedToken = user.forgotpasswordToken;
    const tokenExpiry = new Date(user.forgotpasswordTokenExpiry).getTime();

    if (
      savedToken.toString() === token.toString() &&
      Date.now() < tokenExpiry
    ) {
      user.adminPassword = hashedPassword;
      user.forgotpasswordToken = null;
      user.forgotpasswordTokenExpiry = null;
      await user.save();

      const response = NextResponse.json(
        { message: "Password reset successful", success: true },
        { status: 200 }
      );

      response.cookies.delete("adminToken");

      return response;
    } else {
      return NextResponse.json({ message: `Invalid Token` }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
