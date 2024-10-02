import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import bcryptjs from "bcryptjs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const adminID = searchParams.get("adminID");

  if (!adminID) {
    return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
  }

  try {
    await connectToDB();

    const user = await User.findById(adminID).select(
      "_id firstName lastName otherNames email phoneNumber address cityOfResidence stateOfResidence postalCode isVerified isSeller"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User found", data: user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { confirmAdminID, password, type } = requestBody;

  if (type === "makeUserAdmin") {
    try {
      await connectToDB();

      const user = await User.findById(confirmAdminID);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // hash the password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      user.isAdmin = true;
      user.adminPassword = hashedPassword;
      await user.save();

      return NextResponse.json(
        { message: "Admin privileges granted successfully", data: user },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: `Error: ${error.message}` },
        { status: 500 }
      );
    }
  }

  if (type === "suspendAdmin") {
    try {
      await connectToDB();

      const user = await User.findById(confirmAdminID);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      user.isAdmin = false;
      user.adminPassword = null; // or a predefined value indicating suspension
      await user.save();

      return NextResponse.json(
        { message: "Admin privileges suspended successfully", data: user },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: `Error: ${error.message}` },
        { status: 500 }
      );
    }
  }
}
