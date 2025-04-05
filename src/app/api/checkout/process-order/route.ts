import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Cart from "@/lib/models/cart.model";
import Product from "@/lib/models/product.model";
import Deal from "@/lib/models/deal.model";
import Order from "@/lib/models/order.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import { v4 as uuidv4 } from "uuid";

/**
 * POST: Process an order after payment is successful
 * 1. Updates product inventory
 * 2. Updates flash sale remaining inventory
 * 3. Increments deal usage count
 * 4. Creates order record
 * 5. Clears the cart
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentReference, paymentMethod, shippingMethods } = body;

    const userID = await getUserDataFromToken(request);
    if (!userID) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    await connectToDB();

    // Get the cart with populated product details
    const cart = await Cart.findOne({ user: userID }).populate({
      path: "items.product",
      select: "_id name price images productType sizes title coverIMG storeID",
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Group items by store
    const storeGroups = {};
    let totalAmount = 0;

    for (const item of cart.items) {
      const storeID = item.storeID.toString();

      if (!storeGroups[storeID]) {
        storeGroups[storeID] = {
          storeID,
          items: [],
          subtotal: 0,
          shippingCost: 0,
        };
      }

      // Add item to store group
      storeGroups[storeID].items.push(item);

      // Add item price to store subtotal
      const itemTotal = item.priceAtAdd * item.quantity;
      storeGroups[storeID].subtotal += itemTotal;
      totalAmount += itemTotal;

      // Add shipping cost if provided
      if (shippingMethods && shippingMethods[storeID]) {
        storeGroups[storeID].shippingCost = shippingMethods[storeID].price;
        totalAmount += shippingMethods[storeID].price;
      }
    }

    // Create order record
    const orderNumber = `ORD-${Date.now()}-${uuidv4().substring(0, 8)}`;

    const order = new Order({
      user: userID,
      orderNumber,
      storeOrders: Object.values(storeGroups),
      totalAmount,
      paymentReference,
      paymentMethod,
      status: "processing",
    });

    await order.save();

    // Update inventory and deal usage
    for (const item of cart.items) {
      // Only update inventory for physical products
      if (item.productType === "physicalproducts") {
        const product = await Product.findById(item.product._id);

        if (item.selectedSize) {
          // Update size-specific inventory
          const sizeIndex = product.sizes.findIndex(
            (s) => s.size === item.selectedSize.size
          );

          if (sizeIndex !== -1) {
            product.sizes[sizeIndex].quantity -= item.quantity;
          }
        } else {
          // Update general inventory
          product.productQuantity -= item.quantity;
        }

        await product.save();
      }

      // Update deal usage if applicable
      if (item.dealInfo) {
        const deal = await Deal.findById(item.dealInfo.dealId);

        if (deal) {
          // Increment usage count
          deal.usageCount += 1;

          // Update flash sale remaining inventory
          if (
            deal.dealType === "flash_sale" &&
            deal.flashSaleRemaining !== undefined
          ) {
            deal.flashSaleRemaining -= item.quantity;
          }

          // Update analytics
          deal.analytics.redemptionCount += 1;
          deal.analytics.totalDiscountAmount +=
            (item.originalPrice - item.priceAtAdd) * item.quantity;

          if (!deal.analytics.uniqueUsersUsed.includes(userID)) {
            deal.analytics.uniqueUsersUsed.push(userID);
          }

          deal.analytics.lastRedemptionDate = new Date();
          if (!deal.analytics.firstRedemptionDate) {
            deal.analytics.firstRedemptionDate = new Date();
          }

          await deal.save();
        }
      }
    }

    // Clear the cart
    cart.items = [];
    await cart.save();

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order._id,
    });
  } catch (error: any) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
