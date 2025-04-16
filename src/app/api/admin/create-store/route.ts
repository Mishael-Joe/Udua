import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Store from "@/lib/models/store.model";
import bcryptjs from "bcryptjs";
import { logAdminAction } from "@/lib/audit/audit-logger";
import { verifyAdminToken } from "@/lib/rbac/jwt-utils";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { store } = requestBody;

  try {
    await connectToDB();

    // Verify that the requester is authorized
    const adminToken = request.cookies.get("adminToken")?.value;
    if (!adminToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const tokenData = await verifyAdminToken(adminToken);
    if (!tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const user = await User.findById(store.storeOwner);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const existingStore = await Store.findOne({ storeEmail: store.storeEmail });
    // console.log("existingStore", existingStore);
    if (existingStore) {
      return NextResponse.json(
        { error: "This Email has been used already." },
        { status: 401 }
      );
    }

    // Hash the store's password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(store.defaultPassword, salt);

    const newStore = new Store({
      name: store.name,
      password: hashedPassword,
      storeOwner: store.storeOwner,
      storeEmail: store.storeEmail,
      uniqueId: store.uniqueId,
    });

    // Save new store to database
    const res = await newStore.save();

    // Update the user's stores array
    await User.findByIdAndUpdate(store.storeOwner, {
      $push: { stores: { storeId: res._id } },
    });

    // Log this action
    await logAdminAction(
      tokenData,
      {
        action: "CREATE_STORE",
        myModule: "STORE_CREATION",
        resourceId: res._id.toString(),
        resourceType: "stores",
        details: { res },
      },
      request
    );

    return NextResponse.json(
      { message: "Store creation successful", res },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
