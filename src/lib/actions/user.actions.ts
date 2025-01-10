"use server";

import Order from "@/lib/models/order.model";
import { connectToDB } from "@/lib/mongoose";
import { cookies } from "next/headers";

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

export async function storeUserNameInTheCookies(name: string) {
  cookies().set({
    name: "userName",
    value: name,
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function storeUserIdInTheCookies(userID: string) {
  cookies().set({
    name: "userID",
    value: userID,
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function removeUserNameFromTheCookies(data: string) {
  cookies().delete(data);
}

export async function removeUserIdFromTheCookies(data: string) {
  cookies().delete(data);
}
