import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "@/lib/models/order.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const userId = await getUserDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find all orders for this user
    const userOrders = await Order.find({ user: userId.toString() })
      .populate({
        path: "subOrders.products.physicalProducts",
        select: "_id name images price productType",
      })
      .populate({
        path: "subOrders.products.digitalProducts",
        select: "_id title coverIMG price productType",
      })
      .select("totalAmount status createdAt stores subOrders")
      .sort({ createdAt: -1 }) // Sort by most recent first
      .exec();

    // Process orders to include a summary of delivery statuses
    const processedOrders = userOrders.map((order) => {
      const orderObj = order.toObject();

      // Create a summary of delivery statuses across all subOrders
      const deliveryStatusSummary = orderObj.subOrders.reduce(
        (summary: Record<string, number>, subOrder: any) => {
          const status = subOrder.deliveryStatus;
          summary[status] = (summary[status] || 0) + 1;
          return summary;
        },
        {}
      );

      // Determine the overall delivery status
      let overallDeliveryStatus = "Processing";

      // If all subOrders have the same status, use that
      const statuses = Object.keys(deliveryStatusSummary);
      if (statuses.length === 1) {
        overallDeliveryStatus = statuses[0];
      }
      // Otherwise, use a priority system
      else {
        if (deliveryStatusSummary["Canceled"] === orderObj.subOrders.length) {
          overallDeliveryStatus = "Canceled";
        } else if (
          deliveryStatusSummary["Delivered"] === orderObj.subOrders.length
        ) {
          overallDeliveryStatus = "Delivered";
        } else if (deliveryStatusSummary["Out for Delivery"]) {
          overallDeliveryStatus = "Out for Delivery";
        } else if (deliveryStatusSummary["Shipped"]) {
          overallDeliveryStatus = "Shipped";
        }
      }

      // Add the summary to the order object
      orderObj.deliveryStatusSummary = deliveryStatusSummary;
      orderObj.overallDeliveryStatus = overallDeliveryStatus;

      return orderObj;
    });

    return NextResponse.json(
      { message: "Orders found", orders: processedOrders },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: `Error fetching orders: ${error.message}` },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoose";
// import Order from "@/lib/models/order.model";
// import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
// import Product from "@/lib/models/product.model";
// import EBook from "@/lib/models/digital-product.model";

// export async function POST(request: NextRequest) {
//   try {
//     await connectToDB();
//     const userId = await getUserDataFromToken(request);

//     if (!userId) {
//       return NextResponse.json(
//         { error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     const products = await Product.findOne({}).select("_id");
//     const digitalProducts = await EBook.findOne({}).select("_id");
//     const userOrders = await Order.find({ user: userId.toString() })
//       .populate({
//         path: "products.physicalProducts",
//         select: "_id name images price productType",
//       })
//       .populate({
//         path: "products.digitalProducts",
//         select: "_id title coverIMG price productType",
//       })
//       .select("totalAmount status createdAt deliveryStatus");

//     console.log("userOrders", userOrders);

//     return NextResponse.json(
//       { message: "Orders found", orders: userOrders },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: `Error fetching orders: ${error}` },
//       { status: 500 }
//     );
//   }
// }
