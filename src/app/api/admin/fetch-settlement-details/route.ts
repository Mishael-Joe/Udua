import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Settlement from "@/lib/models/settlement.model";
import Store from "@/lib/models/store.model";
import Order from "@/lib/models/order.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { settlementID } = requestBody;
    await connectToDB();

    // Fetch the settlement along with the store and order details
    const store = Store.findOne().select("_id");
    const order = Order.findOne().select("_id");
    const settlement = await Settlement.findById(settlementID)
      .populate({
        path: "storeID",
        select: "name storeEmail", // Select store name and email
      })
      .populate({
        path: "mainOrderID",
        select: "subOrders stores totalAmount createdAt updatedAt", // Select order details, products, and total amount
      })
      .select("-updatedAt") // Exclude the updatedAt field
      .lean();

    // If the settlement doesn't exist, return a 404 response
    if (!settlement) {
      return NextResponse.json(
        { message: "Settlement not found" },
        { status: 404 }
      );
    }

    // console.log("settlement", settlement);

    // Return the fetched settlement details
    return NextResponse.json(
      { message: "Settlement found", settlement },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching settlement details:", error);
    return NextResponse.json(
      { error: `Error fetching details: ${error.message}` },
      { status: 500 }
    );
  }
}

// const settlement = {
//   _id: "67e053b6fbbeda7fc5f1061c",
//   storeID: {
//     _id: "66fbae5615b9fec5eac1b9bb",
//     name: "Mish Brand",
//     storeEmail: "mishaeljoe55@gmail.com",
//   },
//   mainOrderID: {
//     _id: "67e012b64d22558392479899",
//     stores: ["66fbae5615b9fec5eac1b9bb"],
//     subOrders: [
//       {
//         store: "66fbae5615b9fec5eac1b9bb",
//         products: [
//           {
//             physicalProducts: "670075f70d87b0b2b62ad1aa",
//             store: "66fbae5615b9fec5eac1b9bb",
//             quantity: 1,
//             price: 5500,
//             _id: "67e012b64d2255839247989b",
//           },
//           {
//             physicalProducts: "67859c2a0ae0ef727dae0573",
//             store: "66fbae5615b9fec5eac1b9bb",
//             quantity: 1,
//             price: 22000,
//             _id: "67e012b64d2255839247989c",
//           },
//           {
//             digitalProducts: "675e786172b144a2ec0fce92",
//             store: "66fbae5615b9fec5eac1b9bb",
//             quantity: 1,
//             price: 4500,
//             _id: "67e012b64d2255839247989d",
//           },
//         ],
//         totalAmount: 33200,
//         shippingMethod: {
//           name: "Standard Shipping",
//           price: 1200,
//           estimatedDeliveryDays: 5,
//           description: "Within 4-5 business days.",
//         },
//         deliveryStatus: "Delivered",
//         payoutStatus: "Requested",
//         _id: "67e012b64d2255839247989a",
//       },
//     ],
//     totalAmount: 33200,
//     createdAt: "2025-03-23T13:55:02.745Z",
//     updatedAt: "2025-03-23T18:32:22.220Z",
//   },
//   subOrderID: "67e012b64d2255839247989a",
//   settlementAmount: 28760,
//   payoutAccount: {
//     bankName: "OPay Digital Services Limited (OPay)",
//     accountNumber: "8148600290",
//     accountHolderName: "MISHAEL JOSEPH ETUKUDO",
//     _id: "67e053b6fbbeda7fc5f1061d",
//   },
//   payoutStatus: "Requested",
//   createdAt: "2025-03-23T18:32:22.449Z",
//   __v: 0,
// };
