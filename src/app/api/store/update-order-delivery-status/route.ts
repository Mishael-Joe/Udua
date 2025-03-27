import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "@/lib/models/order.model";
import type { SubOrder } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { mainOrderID, subOrderID, updatedDeliveryStatus } = requestBody as {
      mainOrderID: string;
      subOrderID: string;
      updatedDeliveryStatus: SubOrder["deliveryStatus"];
    };

    await connectToDB();

    // Find the order and update the specific subOrder's deliveryStatus
    // Using the $set operator to update a specific element in the subOrders array
    const result = await Order.updateOne(
      {
        _id: mainOrderID,
        "subOrders._id": subOrderID,
      },
      {
        $set: {
          "subOrders.$.deliveryStatus": updatedDeliveryStatus,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Order or SubOrder not found" },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No changes made to the order" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Order Delivery Status Updated Successfully",
        result: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error Failed to update order Delivery Status:`, error);
    return NextResponse.json(
      {
        error: `Error Failed to update order Delivery Status: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
