import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { currentPassword, newPassword } = requestBody;

  try {
    connectToDB();

    const userID = await getUserDataFromToken(request);
    const user = await User.findById(userID);

    if (!user) {
      return NextResponse.json({ message: `Error` }, { status: 401 });
    }

    // check it password is correct
    const validatePassword = await bcryptjs.compare(
      currentPassword,
      user.password
    );

    if (!validatePassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    return NextResponse.json(
      { message: `Password updated successful` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
