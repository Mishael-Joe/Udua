import { connectToDB } from "@/lib/mongoose";
import Store from "@/lib/models/store.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

interface storeData {
  id: string;
}

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  // console.log("requestBody", requestBody);
  const { uniqueID, password } = requestBody;

  try {
    connectToDB();
    // Check if the user exist
    const store = await Store.findOne({ uniqueID });
    if (!store) {
      return NextResponse.json(
        { error: "Make sure you provide the right store ID" },
        { status: 401 }
      );
    }

    // check it password is correct
    const validatePassword = await bcryptjs.compare(password, store.password);

    if (!validatePassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // create tokenData
    const stoteTokenData: storeData = {
      id: store._id,
      // userFirstName: user.firstName,
    };

    // One Day in seconds
    const oneDayInSeconds = 24 * 60 * 60;

    // create token
    const storeToken = await jwt.sign(stoteTokenData, process.env.JWT_SECRET_KEY!, {
      expiresIn: oneDayInSeconds,
    });

    const response = NextResponse.json(
      { message: "Login successful", success: true, stoteTokenData },
      { status: 200 }
    );

    response.cookies.set("storeToken", storeToken, {
      httpOnly: true,
      maxAge: oneDayInSeconds,
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
