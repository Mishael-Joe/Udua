import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Store from "@/lib/models/store.model";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { token, newPassword, ref } = requestBody as {
    token: string;
    newPassword: string;
    ref: "user" | "store" | null;
  };

  try {
    connectToDB();

    if (ref === "user") {
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
        user.password = hashedPassword;
        user.forgotpasswordToken = null;
        user.forgotpasswordTokenExpiry = null;
        await user.save();
        return NextResponse.json(
          { message: `Password reset successful` },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ message: `Invalid Token` }, { status: 401 });
      }
    }

    if (ref === "store") {
      const store = await Store.findOne({ forgotpasswordToken: token });

      if (!store) {
        return NextResponse.json(
          { message: `Invalid or expired token` },
          { status: 400 }
        );
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(newPassword, salt);
      const savedToken = store.forgotpasswordToken;
      const tokenExpiry = new Date(store.forgotpasswordTokenExpiry).getTime();

      if (
        savedToken.toString() === token.toString() &&
        Date.now() < tokenExpiry
      ) {
        store.password = hashedPassword;
        store.forgotpasswordToken = null;
        store.forgotpasswordTokenExpiry = null;
        await store.save();
        return NextResponse.json(
          { message: `Password reset successful` },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ message: `Invalid Token` }, { status: 401 });
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
