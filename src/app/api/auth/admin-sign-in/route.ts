import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

interface adminData {
  id: string;
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

    if (user.adminPassword !== undefined || user.adminPassword !== false) {
      // check it password is correct
      const validatePassword = await bcryptjs.compare(
        password,
        user.adminPassword
      );

      if (!validatePassword) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 401 }
        );
      }

      // create tokenData
      const adminTokenData: adminData = {
        id: user._id,
      };

      // Three Days in seconds
      // const threeDaysInSeconds = 3 * 24 * 60 * 60;

      // One Day in seconds
      const oneDayInSeconds = 24 * 60 * 60;

      // create token
      const token = await jwt.sign(
        adminTokenData,
        process.env.JWT_SECRET_KEY!,
        {
          expiresIn: oneDayInSeconds,
        }
      );

      const response = NextResponse.json(
        { message: "Login successful", success: true, adminTokenData },
        { status: 200 }
      );

      response.cookies.set("adminToken", token, {
        httpOnly: true,
        maxAge: oneDayInSeconds,
      });

      return response;
    } else {
      return NextResponse.json({ error: "Access Denied" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
