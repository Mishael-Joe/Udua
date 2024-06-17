import {
  removeUserIdFromTheCookies,
  removeUserNameFromTheCookies,
} from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "LogOut successful", success: true },
      { status: 200 }
    );

    response.cookies.set("token", "", { httpOnly: true, expires: new Date() });

    await removeUserNameFromTheCookies("name"); // for deleting of cookies
    await removeUserIdFromTheCookies("userID"); // for deleting of cookies

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
