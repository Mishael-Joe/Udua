import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

interface userData {
  id: string;
  userName: string;
}

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  // console.log("requestBody", requestBody);
  const { email, password } = requestBody;

  try {
    connectToDB();
    // Check if the user exist
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Make sure you provide the write Email" },
        { status: 500 }
      );
    }

    // check it password is correct
    const validatePassword = await bcryptjs.compare(password, user.password);

    if (!validatePassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 500 });
    }

    // create tokenData
    const tokenData: userData = {
      id: user._id,
      userName: user.name,
    };

    // One week in seconds
    const oneWeekInSeconds = 7 * 24 * 60 * 60;

    // create token
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
      expiresIn: oneWeekInSeconds,
    });

    const response = NextResponse.json(
      { message: "Login successful", success: true },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: oneWeekInSeconds,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
