import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/helpers/mail";

export async function POST(request: NextRequest) {
  try {
    connectToDB();
    const userID = await getUserDataFromToken(request);

    const user = await User.findById(userID);
    const userEmail = user.email;

    if (userID !== null) {
      const response = await sendMail({
        email: userEmail,
        emailType: "emailVerification",
        userId: userID,
      });

      return NextResponse.json({ message: response }, { status: 200 });
    }

    return NextResponse.json({ message: `An error occurred` }, { status: 401 });
  } catch (error: any) {
    console.error(error);
    // throw new Error(`Error sending email`, error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
