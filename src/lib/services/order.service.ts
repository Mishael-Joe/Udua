import mongoose from "mongoose";
import Product from "@/lib/models/product.model";
import Store from "@/lib/models/store.model";
import Order from "@/lib/models/order.model";
import EBook from "@/lib/models/digital-product.model";
import type {
  CartItems,
  DigitalProduct,
  Product as Products,
  Store as Stores,
} from "@/types";
import { calculateCommission } from "@/constant/constant";
import { sendEmail } from "./email.service";
import Cart from "../models/cart.model";

type APIProduct = Omit<Products, "productQuantity"> & {
  productQuantity: number;
  save: any;
};

type APIStore = Stores & {
  save: any;
};

type OrderData = {
  cartItems: CartItems[];
  userID: string;
  userEmail: string;
  shippingAddress: string;
  shippingMethod: string;
  status: string;
  paymentType: string;
  postalCode: string;
  amount: number;
  transactionReference: string;
};

type OrderProducts = {
  physicalProducts?: Products["_id"];
  digitalProducts?: DigitalProduct["_id"];
  store: string;
  quantity: number;
  price: number;
};

type InsufficientProducts = {
  product: APIProduct;
  quantity: number;
  selectedSize?: {
    price: number;
    size: string;
    quantity: number;
  };
};

type Notifications = {
  productName: string;
  storeEmail: string;
  quantity: number;
};

/**
 * Processes an order by updating inventory, creating order records, and sending notifications
 * @param orderData The order data to process
 */
export async function processOrder(orderData: OrderData): Promise<void> {
  const {
    cartItems,
    userID,
    userEmail,
    shippingAddress,
    shippingMethod,
    status,
    paymentType,
    postalCode,
    amount,
  } = orderData;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderProducts: OrderProducts[] = [];
    const notifications: Notifications[] = [];
    const insufficientProducts: InsufficientProducts[] = [];
    const stores: string[] = [];

    // Process each item in the cart
    for (const item of cartItems) {
      if (item.productType === "physicalproducts") {
        await processPhysicalProduct(
          item,
          session,
          orderProducts,
          notifications,
          insufficientProducts,
          stores
        );
      } else if (item.productType === "digitalproducts") {
        await processDigitalProduct(
          item,
          session,
          orderProducts,
          notifications,
          stores,
          userEmail
        );
      }
    }

    // Handle insufficient products
    await handleInsufficientProducts(insufficientProducts, session);

    // Create order if there are products
    if (orderProducts.length > 0) {
      const order = new Order({
        user: userID,
        stores: stores,
        products: orderProducts,
        totalAmount: amount,
        status: status,
        shippingAddress: shippingAddress,
        shippingMethod: shippingMethod,
        paymentMethod: paymentType,
        paymentStatus: status === "success" ? "paid" : "Decline",
        deliveryStatus: "Order Placed",
        postalCode: postalCode,
      });

      await order.save({ session });

      // Clear user's cart
      const cart = await Cart.findOne({ user: userID });
      if (cart) {
        cart.items = [];
        await cart.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Send notifications after transaction is committed
    for (const notification of notifications) {
      await sendEmail({
        to: notification.storeEmail,
        subject: "Product Sold Notification",
        text: `Your product ${notification.productName} has been sold. Quantity: ${notification.quantity}`,
      });
    }

    console.log("Order processed successfully");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error processing order:", error);
    throw error;
  }
}

/**
 * Processes a physical product order
 */
async function processPhysicalProduct(
  item: CartItems,
  session: mongoose.ClientSession,
  orderProducts: OrderProducts[],
  notifications: Notifications[],
  insufficientProducts: InsufficientProducts[],
  stores: string[]
): Promise<void> {
  const { quantity } = item;

  // Query the physical product by product._id
  const product: APIProduct = await Product.findById(item.product._id).session(
    session
  );

  if (!product) {
    throw new Error(`Product not found: ${item.product._id}`);
  }

  // Process product without sizes
  if (!item.selectedSize) {
    // if (product.productQuantity < quantity) {
    //   insufficientProducts.push({ product, quantity });
    //   return;
    // }

    // // Reduce product quantity
    // product.productQuantity -= quantity;
    // await product.save({ session });

    // Update store balance
    const totalProductPurchasedAmount = product.price! * quantity;
    await updateStoreBalance(
      product.storeID,
      totalProductPurchasedAmount,
      product.name,
      quantity,
      session,
      notifications,
      stores
    );

    orderProducts.push({
      physicalProducts: product._id!,
      store: product.storeID,
      quantity,
      price: product.price! * quantity,
    });
  }
  // Process product with sizes
  else {
    const selectedSize = item.selectedSize;
    const selectedProductSize = product.sizes?.find(
      (size) => size.size === selectedSize?.size
    );

    // if (!selectedProductSize || selectedProductSize.quantity < quantity) {
    //   insufficientProducts.push({ product, quantity, selectedSize });
    //   return;
    // }

    // // Reduce size-specific quantity
    // selectedProductSize.quantity -= quantity;
    // await product.save({ session });

    // Update store balance
    const totalProductPurchasedAmount = selectedProductSize!.price * quantity;
    await updateStoreBalance(
      product.storeID,
      totalProductPurchasedAmount,
      product.name,
      quantity,
      session,
      notifications,
      stores
    );

    orderProducts.push({
      physicalProducts: product._id!,
      store: product.storeID,
      quantity,
      price: selectedProductSize!.price * quantity,
    });
  }
}

/**
 * Processes a digital product order
 */
async function processDigitalProduct(
  item: CartItems,
  session: mongoose.ClientSession,
  orderProducts: OrderProducts[],
  notifications: Notifications[],
  stores: string[],
  userEmail: string
): Promise<void> {
  const { quantity } = item;

  // Query the digital product
  const digitalProduct: DigitalProduct = await EBook.findById(
    item.product._id
  ).session(session);

  if (!digitalProduct) {
    throw new Error(`Digital Product not found: ${item.product._id}`);
  }

  // Generate and send download link
  const s3Key = digitalProduct.s3Key;
  if (!s3Key) {
    throw new Error(
      `S3 key not found for digital product: ${digitalProduct.title}`
    );
  }

  const downloadUrl = await generateDownloadUrl(s3Key);

  await sendEmail({
    to: userEmail,
    subject: "Your Digital Product Purchase",
    text: `Thank you for your purchase! You can download your digital product, ${digitalProduct.title}, using the link below. This link will expire in 1 hour:\n\n${downloadUrl}`,
  });

  // Update store balance
  const totalProductPurchasedAmount = digitalProduct.price * quantity;
  await updateStoreBalance(
    digitalProduct.storeID,
    totalProductPurchasedAmount,
    digitalProduct.title,
    quantity,
    session,
    notifications,
    stores
  );

  orderProducts.push({
    digitalProducts: item.product._id,
    store: digitalProduct.storeID,
    quantity,
    price: item.product.price,
  });
}

/**
 * Updates a store's pending balance and adds notification
 */
async function updateStoreBalance(
  storeID: string,
  totalAmount: number,
  productName: string,
  quantity: number,
  session: mongoose.ClientSession,
  notifications: Notifications[],
  stores: string[]
): Promise<void> {
  const pendingBalance = calculateCommission(totalAmount).settleAmount;
  const store: APIStore = await Store.findById(storeID).session(session);

  if (store) {
    notifications.push({
      storeEmail: store.storeEmail,
      productName,
      quantity,
    });

    store.pendingBalance += pendingBalance;
    await store.save({ session });

    if (!stores.includes(storeID)) {
      stores.push(storeID);
    }
  }
}

/**
 * Handles insufficient product stock
 */
async function handleInsufficientProducts(
  insufficientProducts: InsufficientProducts[],
  session: mongoose.ClientSession
): Promise<void> {
  for (const { product, quantity, selectedSize } of insufficientProducts) {
    const store: APIStore = await Store.findById(product.storeID).session(
      session
    );

    if (store) {
      const emailText = selectedSize
        ? `Your product ${product.name} (Size: ${selectedSize.size}) is low on stock. Ordered quantity: ${quantity}, Available quantity: ${selectedSize.quantity}. Please restock.`
        : `Your product ${product.name} is low on stock. Ordered quantity: ${quantity}, Available quantity: ${product.productQuantity}. Please restock.`;

      await sendEmail({
        to: store.storeEmail,
        subject: "Stock Alert Notification",
        text: emailText,
      });
    }
  }
}

/**
 * Generates a download URL for a digital product
 */
async function generateDownloadUrl(s3Key: string): Promise<string> {
  try {
    const response = await fetch(
      `${
        process.env.BASE_URL
      }/api/s3-bucket/generate-download-url?s3Key=${encodeURIComponent(s3Key)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to generate download URL for s3Key: ${s3Key}`);
    }

    const { downloadUrl } = await response.json();
    return downloadUrl;
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw error;
  }
}
