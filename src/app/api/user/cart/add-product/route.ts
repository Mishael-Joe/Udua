// app/api/cart/add-product/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Cart from "@/lib/models/cart.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

/**
 * POST: Add an item to the cart.
 * Expected JSON body:
 * {
 *   userId: string,
 *   productID: string,
 *   productType: "Physical Product" | "Digital Product",
 *   quantity: number,
 *   selectedSize?: { size: string, price: number }  // Optional for size-based products
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productID, productType, quantity, selectedSize, storeID } = body;

    const userId = await getUserDataFromToken(request);

    if (!userId || !productID || !productType || !quantity || !storeID) {
      return NextResponse.json(
        {
          error:
            "userId, productID, productType quantity and storeID are required",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find the user's cart or create a new one if none exists.
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the item already exists in the cart. For physical products with sizes,
    // compare the selected size as well.
    let itemIndex = cart.items.findIndex((item: any) => {
      if (item.product.toString() !== productID) return false;
      if (item.productType !== productType) return false;
      if (productType === "physicalproducts" && selectedSize) {
        return (
          item.selectedSize && item.selectedSize.size === selectedSize.size
        );
      }
      return true;
    });

    if (itemIndex > -1) {
      // Update the quantity (and optionally the selectedSize) if item exists.
      cart.items[itemIndex].quantity += quantity;
      if (selectedSize) {
        cart.items[itemIndex].selectedSize = selectedSize;
      }
    } else {
      // Add a new item to the cart.
      cart.items.push({
        product: productID,
        storeID,
        productType,
        quantity,
        selectedSize: selectedSize || undefined,
      });
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json(
      { message: "Cart updated", cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
