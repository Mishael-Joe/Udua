import { removeUserNameFromTheCookies } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "LogOut successful", success: true },
      { status: 200 }
    );

    response.cookies.set("adminToken", "", {
      httpOnly: true,
      expires: new Date(),
    });

    await removeUserNameFromTheCookies("adminToken"); // for deleting of cookies

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
