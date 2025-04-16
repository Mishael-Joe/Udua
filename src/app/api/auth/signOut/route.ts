import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();

    // Remove cookies
    cookieStore.delete("token");
    cookieStore.delete("adminToken");
    cookieStore.delete("storeToken");
    cookieStore.delete("userID");
    cookieStore.delete("userName");

    return NextResponse.json(
      { message: "Logout successful", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
