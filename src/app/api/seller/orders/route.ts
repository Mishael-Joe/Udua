import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/product.model";

import Order from "@/lib/models/order.model";
import { connectToDB } from "@/lib/mongoose";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const sellerId = await getUserDataFromToken(request);

    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({}).select("_id productName").exec();

    const orders = await Order.find({ sellers: { $in: [sellerId.toString()] } })
      .populate({
        path: "products.product",
        match: { accountId: sellerId.toString() },
      })
      .exec();

    return NextResponse.json(
      { message: "Orders found", orders },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching orders: ${error.message}` },
      { status: 500 }
    );
  }
}

// "use strict";

// import { NextRequest, NextResponse } from "next/server";
// import Order from "@/lib/models/order.model";
// import { connectToDB } from "@/lib/mongoose";
// import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";

// export async function POST(request: NextRequest) {

//   try {
//     connectToDB();
//     const sellerId = await getUserDataFromToken(request);
//     if (!sellerId) {
//       return NextResponse.json(
//         { error: "Seller ID is required" },
//         { status: 400 }
//       );
//     }

//     const orders = await Order.find({ seller: sellerId.toString() })
//       .populate("products.product") // Populate the product details
//       .exec();

//     return NextResponse.json(
//       { error: "orders found", orders },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     // return NextResponse.json(
//     //     { error: "Error fetching orders:", error },
//     //     { status: 400 }
//     //   );

//     throw Error(`"Error fetching orders:" ${error.message}`);
//   }
// }
