import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Order from "@/lib/models/order.model";
import Product from "@/lib/models/product.model";
import EBook from "@/lib/models/digital-product.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { orderID } = requestBody;

    await connectToDB();

    const products = await Product.findOne({}).select("_id");
    const digitalProducts = await EBook.findOne({}).select("_id");

    // Find the order and populate products within each subOrder
    const orderDetail = await Order.findById(orderID)
      .populate({
        path: "subOrders.products.physicalProducts",
        select: "_id name images price productType storeID",
      })
      .populate({
        path: "subOrders.products.digitalProducts",
        select: "_id title coverIMG price productType storeID",
      })
      // .populate({
      //   path: "subOrders.store",
      //   select: "name storeEmail",
      // })
      .exec();

    if (!orderDetail) {
      return NextResponse.json(
        { error: "Order Details not found" },
        { status: 404 }
      );
    }

    // console.log(`orderDetail`, orderDetail);

    return NextResponse.json(
      { message: "Order Details found", orderDetail: orderDetail },
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

// import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoose";
// import Order from "@/lib/models/order.model";
// import Product from "@/lib/models/product.model";
// import EBook from "@/lib/models/digital-product.model";

// export async function POST(request: NextRequest) {
//   try {
//     const requestBody = await request.json();
//     const { orderID } = requestBody;
//     // console.log(`requestBody`, requestBody);

//     await connectToDB();

//     const products = await Product.findOne({}).select("_id");
//     const digitalProducts = await EBook.findOne({}).select("_id");
//     const orderDetail = await Order.findById(orderID)
//       .populate({
//         path: "products.physicalProducts",
//         select: "_id name images price productType",
//       })
//       .populate({
//         path: "products.digitalProducts",
//         select: "_id title coverIMG price productType",
//       })
//       .exec();

//     if (!orderDetail) {
//       return NextResponse.json(
//         { error: "Order Details not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Order Details found", orderDetail: orderDetail },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error(`Error fetching product:`, error);
//     return NextResponse.json(
//       { error: `Error fetching product: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }
