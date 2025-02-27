// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Cart from "@/lib/models/cart.model";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

/**
 * POST: Fetch the user's cart and calculate the total quantity and price.
 * Expected query parameter: userId
 */
export async function POST(request: NextRequest) {
  try {
    const userID = await getUserDataFromToken(request);
    if (!userID) {
      return NextResponse.json(
        { message: `user not logged in` },
        { status: 307 }
      );
    }

    await connectToDB();

    // Retrieve the cart and populate the product details for each item.
    const cart = await Cart.findOne({ user: userID }).populate({
      path: "items.product",
      select: "_id name price images productType sizes title coverIMG category", // Replace with the fields you want to include
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { totalQuantity: 0, totalPrice: 0, items: [] },
        { status: 200 }
      );
    }

    let totalQuantity = 0;
    let totalPrice = 0;

    // Loop through each cart item to compute totals.
    for (const item of cart.items) {
      let product;
      let itemPrice = 0;

      if (item.productType === "physicalproducts") {
        product = await Product.findById(item.product._id);
        // For size-based products, use the price stored in selectedSize if available.
        if (item.selectedSize && item.selectedSize.price) {
          itemPrice = item.selectedSize.price;
        } else {
          itemPrice = product.price;
        }
      } else if (item.productType === "digitalproducts") {
        product = await EBook.findById(item.product._id);
        itemPrice = product.price;
      }

      totalPrice += itemPrice * item.quantity;
      totalQuantity += item.quantity;
    }

    // console.log("cart.items", cart.items);

    return NextResponse.json(
      { totalQuantity, totalPrice, items: cart.items },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT: Update an existing cart item.
 * Expected JSON body:
 * {
 *   cartItemID: string,
 *   value: "increase" | "decrease",
 * }
 */
export async function PUT(request: NextRequest) {
  try {
    const { cartItemID, value } = await request.json();
    const userID = await getUserDataFromToken(request);

    if (!cartItemID || !value) {
      return NextResponse.json(
        { error: "cartItemID and value are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const cart = await Cart.findOne({ user: userID });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Use Mongoose's subdocument helper to find the cart item by its _id.
    const item = cart.items.id(cartItemID);
    if (!item) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (value === "decrease") {
      // If quantity is 1, remove the item from the subdocument array.
      if (item.quantity === 1) {
        item.remove();
      } else {
        item.quantity -= 1;
      }
    } else if (value === "increase") {
      item.quantity += 1;
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json(
      { message: "Cart updated", cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Remove an item from the cart.
 * Expected query parameters:
 * - userId: string
 * - productID: string
 * - productType: "Physical Product" | "Digital Product"
 * - size: string (optional, for size-based products)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productID = searchParams.get("productID");
    const productType = searchParams.get("productType");
    const size = searchParams.get("size"); // Optional for size-based products

    const userId = await getUserDataFromToken(request);

    if (!userId || !productID || !productType) {
      return NextResponse.json(
        { error: "userId, productID, and productType are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    let itemIndex = cart.items.findIndex((item: any) => {
      if (item.product.toString() !== productID) return false;
      // if (item.productType !== productType) return false;
      // if (productType === "physicalproducts" && size) {
      //   return item.selectedSize && item.selectedSize.size === size;
      // }
      return true;
    });

    // console.log("itemIndex", cart.items[itemIndex]);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Remove the item and update the cart timestamp.
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json(
      { message: "Item removed", cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error removing cart item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
