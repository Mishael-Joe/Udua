import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "@/lib/models/order.model";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { orderID } = requestBody;

    await connectToDB();

    // Retrieve the store ID from the token
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    const products = await Product.findOne({}).select("_id");
    const digitalProducts = await EBook.findOne({}).select("_id");
    // Find the order by ID
    const orderDetail = await Order.findById(orderID)
      .populate({
        path: "subOrders.products.physicalProducts",
        match: { storeID: storeID.toString() },
        select: "_id name images price productType",
      })
      .populate({
        path: "subOrders.products.digitalProducts",
        match: { storeID: storeID.toString() },
        select: "_id title coverIMG price productType",
      })
      // Add population for deal information
      .populate({
        path: "subOrders.appliedDeals.dealId",
        model: "Deal",
        select: "name dealType value endDate",
      })
      .populate({
        path: "user",
        model: "User",
        select: "firstName lastName email phoneNumber",
      })
      .exec();

    if (!orderDetail) {
      return NextResponse.json(
        { error: "Order Details not found" },
        { status: 404 }
      );
    }

    // Filter the subOrders to only include those for this store
    const filteredOrderDetail = orderDetail.toObject();
    filteredOrderDetail.subOrders = filteredOrderDetail.subOrders.filter(
      (subOrder: any) => subOrder.store.toString() === storeID.toString()
    );

    // If no subOrders match this store, return an error
    if (filteredOrderDetail.subOrders.length === 0) {
      return NextResponse.json(
        { error: "No order details found for this store" },
        { status: 404 }
      );
    }

    // console.log(`filteredOrderDetail`, filteredOrderDetail);
    return NextResponse.json(
      { message: "Order Details found", orderDetail: filteredOrderDetail },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error fetching order details:`, error);
    return NextResponse.json(
      { error: `Error fetching order details: ${error.message}` },
      { status: 500 }
    );
  }
}

// import { type NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoose";
// import Order from "@/lib/models/order.model";
// import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
// import Product from "@/lib/models/product.model";
// import EBook from "@/lib/models/digital-product.model";

// export async function POST(request: NextRequest) {
//   try {
//     const requestBody = await request.json();
//     const { orderID } = requestBody;

//     await connectToDB();

//     // Retrieve the store ID from the token
//     const storeID = await getStoreIDFromToken(request);

//     if (!storeID) {
//       return NextResponse.json(
//         { error: "Store ID is required" },
//         { status: 400 }
//       );
//     }

//     const products = await Product.findOne({}).select("_id");
//     const digitalProducts = await EBook.findOne({}).select("_id");
//     // Find the order by ID
//     const orderDetail = await Order.findById(orderID)
//       .populate({
//         path: "subOrders.products.physicalProducts",
//         match: { storeID: storeID.toString() },
//         select: "_id name images price productType",
//       })
//       .populate({
//         path: "subOrders.products.digitalProducts",
//         match: { storeID: storeID.toString() },
//         select: "_id title coverIMG price productType",
//       })
//       .exec();

//     if (!orderDetail) {
//       return NextResponse.json(
//         { error: "Order Details not found" },
//         { status: 404 }
//       );
//     }

//     // Filter the subOrders to only include those for this store
//     const filteredOrderDetail = orderDetail.toObject();
//     filteredOrderDetail.subOrders = filteredOrderDetail.subOrders.filter(
//       (subOrder: any) => subOrder.store.toString() === storeID.toString()
//     );

//     // If no subOrders match this store, return an error
//     if (filteredOrderDetail.subOrders.length === 0) {
//       return NextResponse.json(
//         { error: "No order details found for this store" },
//         { status: 404 }
//       );
//     }

//     // console.log(`filteredOrderDetail`, filteredOrderDetail);
//     return NextResponse.json(
//       { message: "Order Details found", orderDetail: filteredOrderDetail },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error(`Error fetching order details:`, error);
//     return NextResponse.json(
//       { error: `Error fetching order details: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }
