"use server";

import axios from "axios";
import Order from "@/lib/models/order.model";
import { connectToDB } from "@/lib/mongoose";

export const fetchOrders = async (sellerID: string) => {
  try {
    connectToDB();
    // const response = await axios.post("/api/seller/orders", sellerID);
    const orders = await Order.find({ seller: sellerID.toString() })
      .populate("products.product") // Populate the product details
      .exec();

    return orders;
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    throw new Error("Error fetching orders:", error);
  }
};
