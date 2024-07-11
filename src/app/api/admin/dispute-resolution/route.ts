import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/product.model";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { email } = requestBody;
  // console.log("email", email);

  try {
    await connectToDB();

    
    return NextResponse.json({ error: "Reset email sent" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
