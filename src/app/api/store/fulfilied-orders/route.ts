import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/product.model";
import Order from "@/lib/models/order.model";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import EBook from "@/lib/models/digital-product.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    const products = await Product.findOne({}).select("_id");
    const digitalProducts = await EBook.findOne({}).select("_id");

    // Find orders where the store is involved and products are delivered,
    // but subOrders payoutStatus is NOT "Requested"
    const orders = await Order.find({
      stores: { $in: [storeID.toString()] },
      "subOrders.deliveryStatus": { $in: ["Delivered"] }, // Look inside sub-orders for delivery status
      "subOrders.payoutStatus": { $ne: "Requested" }, // Exclude sub-orders with payoutStatus "Requested"
    })
      .populate({
        path: "subOrders.products.physicalProducts",
        select: "_id name images price productType",
        match: { store: storeID.toString() }, // Match store inside sub-orders
      })
      .populate({
        path: "subOrders.products.digitalProducts",
        select: "_id title coverIMG price productType",
        match: { store: storeID.toString() }, // Match store inside sub-orders
      })
      .select("-totalAmount -updatedAt") // Optional: Remove unnecessary fields
      .exec();

    // Filter the subOrders to only include those for this store
    const ordersWithFilteredSubOrders = orders.map((order) => {
      // Create a plain JavaScript object from the Mongoose document
      const orderObj = order.toObject();

      // Filter subOrders to only include those for this store
      orderObj.subOrders = orderObj.subOrders.filter(
        (subOrder: any) => subOrder.store.toString() === storeID.toString()
      );

      return orderObj;
    });

    // console.log("ordersWithFilteredSubOrders", ordersWithFilteredSubOrders);

    return NextResponse.json(
      { message: "Orders found", fulfilledOrders: ordersWithFilteredSubOrders },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching orders: ${error.message}` },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import Product from "@/lib/models/product.model";
// import Order from "@/lib/models/order.model";
// import { connectToDB } from "@/lib/mongoose";
// import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
// import EBook from "@/lib/models/digital-product.model";

// export async function POST(request: NextRequest) {
//   try {
//     await connectToDB();
//     const storeID = await getStoreIDFromToken(request);

//     if (!storeID) {
//       return NextResponse.json(
//         { error: "Store ID is required" },
//         { status: 400 }
//       );
//     }

//     const products = await Product.findOne({}).select("_id");
//     const digitalProducts = await EBook.findOne({}).select("_id");
//     //TODO: REVIEW THIS CODE DONW
//     const orders = await Order.find({
//       stores: { $in: [storeID.toString()] },
//       deliveryStatus: {
//         $in: ["Delivered"],
//       }, // Multiple statuses
//     })
//       .populate({
//         path: "products.physicalProducts",
//         select: "_id name images price productType",
//         match: { storeID: storeID.toString() },
//       })
//       .populate({
//         path: "products.digitalProducts",
//         select: "_id title coverIMG price productType",
//         match: { storeID: storeID.toString() },
//       })
//       .select("-totalAmount -updatedAt")
//       .exec();

//     // console.log(`orders`, orders)

//     return NextResponse.json(
//       { message: "Orders found", fulfiliedOrders: orders },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: `Error fetching orders: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }
