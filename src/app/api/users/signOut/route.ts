import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

interface userData {
  id: string;
  userName: string;
}

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "LogOut successful", success: true },
      { status: 200 }
    );

    response.cookies.set("token", "", { httpOnly: true, expires: new Date() });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
