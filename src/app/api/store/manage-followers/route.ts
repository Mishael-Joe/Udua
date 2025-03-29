import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import User from "@/lib/models/user.model";
import Store from "@/lib/models/store.model";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { storeId, action } = requestBody as {
    storeId: string;
    action: "follow" | "unfollow";
  };
  try {
    await connectToDB();
    const userId = await getUserDataFromToken(request);
    // console.log("userId", userId);
    // console.log("action", action);
    // console.log("storeId", storeId);

    if (!userId) {
      return NextResponse.json(
        { error: "Please log in to follow this store/brand." },
        { status: 400 }
      );
    }

    if (!storeId || !action) {
      return NextResponse.json(
        { error: "store ID and action are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select("followingStores");
    const store = await Store.findById(storeId).select("followers");

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Handle Follow action
    if (action === "follow") {
      // Check if the user is already following the store
      if (user.followingStores.includes(storeId)) {
        return NextResponse.json(
          { message: "You are already following this store" },
          { status: 200 }
        );
      }

      // Add store to user's following list and user to store's followers
      user.followingStores.push(storeId);
      store.followers.push(userId);

      await user.save();
      await store.save();

      return NextResponse.json(
        { message: "Store followed successfully" },
        { status: 200 }
      );
    }

    // Handle Unfollow action
    if (action === "unfollow") {
      // Check if the user is not following the store
      if (!user.followingStores.includes(storeId)) {
        return NextResponse.json(
          { message: "You are not following this store" },
          { status: 200 }
        );
      }

      // Remove store from user's following list and user from store's followers
      user.followingStores = user.followingStores.filter(
        (id: string) => id.toString() !== storeId.toString()
      );
      store.followers = store.followers.filter(
        (id: string) => id.toString() !== userId.toString()
      );

      await user.save();
      await store.save();

      return NextResponse.json(
        { message: "Store unfollowed successfully" },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error processing request: ${error.message}` },
      { status: 500 }
    );
  }
}
