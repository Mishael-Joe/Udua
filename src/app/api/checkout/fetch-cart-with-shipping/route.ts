import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Cart from "@/lib/models/cart.model";
import Store from "@/lib/models/store.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import { currencyOperations } from "@/lib/utils";

/**
 * POST: Fetch cart items grouped by store with available shipping methods
 * This endpoint:
 * 1. Retrieves the user's cart
 * 2. Groups items by store
 * 3. Fetches shipping methods for each store
 * 4. Calculates subtotals and totals
 */
export async function POST(request: NextRequest) {
  try {
    const userID = await getUserDataFromToken(request);
    if (!userID) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    await connectToDB();

    // Retrieve the cart with populated product details
    const cart = await Cart.findOne({ user: userID }).populate({
      path: "items.product",
      select:
        "_id name price images productType sizes title coverIMG category storeID",
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({
        success: true,
        totalQuantity: 0,
        totalPrice: 0,
        totalSavings: 0,
        groupedCart: [],
      });
    }

    let totalQuantity = 0;
    let totalPrice = 0;
    let totalOriginalPrice = 0;

    // Group cart items by storeID
    const storeProductGroups = {};

    for (const item of cart.items) {
      const storeID = item.storeID.toString();

      // Initialize group if not already present
      if (!storeProductGroups[storeID]) {
        storeProductGroups[storeID] = [];
      }

      // Add item to the store group
      storeProductGroups[storeID].push({
        ...item.toObject(),
        // Ensure we have the price fields
        priceAtAdd: item.priceAtAdd,
        originalPrice: item.originalPrice,
        dealInfo: item.dealInfo,
      });

      // Calculate totals
      totalPrice = currencyOperations.add(
        totalPrice,
        currencyOperations.multiply(item.priceAtAdd, item.quantity)
      );

      totalOriginalPrice = currencyOperations.add(
        totalOriginalPrice,
        currencyOperations.multiply(item.originalPrice, item.quantity)
      );

      totalQuantity += item.quantity;
    }

    // Fetch shipping methods for each store
    const storeShippingDetails = {};

    for (const storeID of Object.keys(storeProductGroups)) {
      const store = await Store.findById(storeID).select(
        "name shippingMethods"
      );
      if (store) {
        storeShippingDetails[storeID] = {
          name: store.name,
          shippingMethods: store.shippingMethods || [],
        };
      }
    }

    // Prepare the response with grouped products and shipping methods
    const groupedCart = Object.keys(storeProductGroups).map((storeID) => ({
      storeID,
      storeName:
        storeShippingDetails[storeID]?.name ||
        `Store ${storeID.substring(0, 5)}`,
      products: storeProductGroups[storeID],
      shippingMethods: storeShippingDetails[storeID]?.shippingMethods || [],
    }));

    // Calculate total savings
    const totalSavings = currencyOperations.subtract(
      totalOriginalPrice,
      totalPrice
    );

    return NextResponse.json({
      success: true,
      totalQuantity,
      totalPrice,
      totalOriginalPrice,
      totalSavings,
      groupedCart,
    });
  } catch (error: any) {
    console.error("Error fetching cart with shipping:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
