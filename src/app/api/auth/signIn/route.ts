import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { storeUserNameInTheCookies } from "@/lib/actions/user.actions";
import { storeUserIdInTheCookies } from "@/lib/actions/user.actions";

interface userData {
  id: string;
  userFirstName: string;
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
        { error: "Make sure you provide the right Email" },
        { status: 401 }
      );
    }

    // check it password is correct
    const validatePassword = await bcryptjs.compare(password, user.password);

    if (!validatePassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // create tokenData
    const tokenData: userData = {
      id: user._id,
      userFirstName: user.firstName,
    };

    // One week in seconds
    const oneWeekInSeconds = 7 * 24 * 60 * 60;

    // create token
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
      expiresIn: oneWeekInSeconds,
    });

    const response = NextResponse.json(
      { message: "Login successful", success: true, tokenData },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: oneWeekInSeconds,
    });

    await storeUserNameInTheCookies(user.firstName); // for creating of cookies
    await storeUserIdInTheCookies(user._id); // for creating of cookies

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
