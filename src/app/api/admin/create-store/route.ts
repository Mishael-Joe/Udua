import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Store from "@/lib/models/store.model";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { store } = requestBody;
  // console.log("store", store);

  try {
    await connectToDB();

    const user = await User.findById(store.storeOwner);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(store.defaultPassword, salt);

    const newStore = new Store({
      name: store.name,
      password: hashedPassword,
      storeOwner: store.storeOwner,
      storeEmail: store.storeEmail,
      uniqueId: store.uniqueId,
    });

    const res = await newStore.save();

    user.store = res._id;
    await user.save();

    return NextResponse.json({ message: `successful`, res }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
