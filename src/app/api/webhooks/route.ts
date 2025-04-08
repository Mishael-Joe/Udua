import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyPaystackTransaction } from "@/lib/services/payment.service";
import orderQueueProducer from "@/lib/queue/order-queue-producer";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const headers = request.headers;
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(requestBody))
    .digest("hex");
  const signature = headers.get("x-paystack-signature");

  if (hash !== signature) {
    return NextResponse.json(
      { message: "This request isn't from Paystack" },
      { status: 401 }
    );
  }

  try {
    // Extract transaction reference
    const transactionReference = requestBody.data.reference;

    // Verify the transaction (this should be quick)
    const transactionData = await verifyPaystackTransaction(
      transactionReference
    );

    if (!transactionData) {
      return NextResponse.json(
        { message: "Failed to verify transaction" },
        { status: 400 }
      );
    }

    const { status, eventStatus, metadata, customer } = transactionData;

    // If payment is successful, queue the order processing
    if (eventStatus === true && status === "success") {
      // Create order data
      const orderData = {
        cartItems: metadata.itemsInCart,
        userID: metadata.userID,
        userEmail: customer.email,
        shippingAddress: `${metadata.state}, ${metadata.city}, ${metadata.address}`,
        shippingMethod: metadata.deliveryMethod,
        status,
        paymentType: transactionData.channel,
        postalCode: metadata.postal_code,
        amount: transactionData.amount,
        transactionReference,
        timestamp: new Date().toISOString(),
      };

      // Initialize the queue producer if not already initialized
      await orderQueueProducer.initialize();

      // Send the order to the queue
      const messageId = await orderQueueProducer.sendOrder(orderData);

      // Immediately acknowledge the webhook
      return NextResponse.json(
        {
          message: "Webhook received and order queued for processing",
          orderId: messageId,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Payment was not successful" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import { verifyPaystackTransaction } from "@/lib/services/payment.service";

// export async function POST(request: Request) {
//   const requestBody = await request.json();
//   const headers = request.headers;
//   const secret = process.env.PAYSTACK_SECRET_KEY!;

//   // Verify webhook signature
//   const hash = crypto
//     .createHmac("sha512", secret)
//     .update(JSON.stringify(requestBody))
//     .digest("hex");
//   const signature = headers.get("x-paystack-signature");

//   if (hash !== signature) {
//     return NextResponse.json(
//       { message: "This request isn't from Paystack" },
//       { status: 401 }
//     );
//   }

//   try {
//     // Extract transaction reference
//     const transactionReference = requestBody.data.reference;

//     // Verify the transaction (this should be quick)
//     const transactionData = await verifyPaystackTransaction(
//       transactionReference
//     );

//     if (!transactionData) {
//       return NextResponse.json(
//         { message: "Failed to verify transaction" },
//         { status: 400 }
//       );
//     }

//     const { status, eventStatus, metadata, customer } = transactionData;

//     // If payment is successful, queue the order processing
//     if (eventStatus === true && status === "success") {
//       // Create order data
//       const orderData = {
//         cartItems: metadata.itemsInCart,
//         userID: metadata.userID,
//         userEmail: customer.email,
//         shippingAddress: `${metadata.state}, ${metadata.city}, ${metadata.address}`,
//         shippingMethod: metadata.deliveryMethod,
//         status,
//         paymentType: transactionData.channel,
//         postalCode: metadata.postal_code,
//         amount: transactionData.amount,
//         transactionReference,
//         timestamp: new Date().toISOString(),
//       };

//       // Immediately acknowledge the webhook
//       return NextResponse.json(
//         { message: "Webhook received and order queued for processing" },
//         { status: 200 }
//       );
//     } else {
//       return NextResponse.json(
//         { message: "Payment was not successful" },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     return NextResponse.json(
//       { error: "Error processing webhook" },
//       { status: 500 }
//     );
//   }
// }

let itemsInCart = [
  {
    storeID: "66fbae5615b9fec5eac1b9bb",
    storeName: "Mish Brand",
    products: [
      {
        product: {
          _id: "670075f70d87b0b2b62ad1aa",
          storeID: "66fbae5615b9fec5eac1b9bb",
          productType: "physicalproducts",
          images: [
            "https://res.cloudinary.com/dhngvbjtz/image/upload/v1728083446/qfewevb0j8yfakrjxgsv.jpg",
          ],
          name: "Roberto Cavalli Oil Perfume",
          price: "550000",
          category: ["Body_Care_Products"],
        },
        storeID: "66fbae5615b9fec5eac1b9bb",
        quantity: "1",
        productType: "physicalproducts",
        priceAtAdd: "467500",
        originalPrice: "550000",
        dealInfo: {
          dealId: "67eff726953998e12bc20870",
          dealType: "flash_sale",
          value: "15",
          name: "Summer Sale",
          endDate: "2025-04-10T23:00:00.000Z",
          _id: "67f19619ed29df4814cc4f2b",
        },
        _id: "67f19619ed29df4814cc4f2a",
      },
      {
        selectedSize: {
          size: "43",
          price: "2200000",
          quantity: "4",
        },
        product: {
          _id: "67859c2a0ae0ef727dae0573",
          storeID: "66fbae5615b9fec5eac1b9bb",
          productType: "physicalproducts",
          images: [
            "https://res.cloudinary.com/dhngvbjtz/image/upload/v1736809498/posa5etppfozu5snpndo.jpg",
          ],
          name: "Barker Emerson Oxford Shoes",
          sizes: [
            {
              size: "43",
              price: "2200000",
              quantity: "4",
              _id: "67859c2a0ae0ef727dae0574",
            },
            {
              size: "44",
              price: "2450000",
              quantity: "9",
              _id: "67859c2a0ae0ef727dae0575",
            },
            {
              size: "45",
              price: "2600000",
              quantity: "5",
              _id: "67859c2a0ae0ef727dae0576",
            },
          ],
          category: ["Fashion"],
        },
        storeID: "66fbae5615b9fec5eac1b9bb",
        quantity: "1",
        productType: "physicalproducts",
        priceAtAdd: "1870000",
        originalPrice: "2200000",
        dealInfo: {
          dealId: "67eff726953998e12bc20870",
          dealType: "flash_sale",
          value: "15",
          name: "Summer Sale",
          endDate: "2025-04-10T23:00:00.000Z",
          _id: "67f1969aed29df4814cc50dc",
        },
        _id: "67f1969aed29df4814cc50db",
      },
      {
        product: {
          _id: "675e786172b144a2ec0fce92",
          storeID: "66fbae5615b9fec5eac1b9bb",
          title:
            "Atomic Habits: Tiny Changes, Remarkable Results by James Clear",
          category: "Non-Fiction",
          price: "450000",
          coverIMG: [
            "https://res.cloudinary.com/dhngvbjtz/image/upload/v1734244448/gjzx5wxant0aii1hqvhi.png",
          ],
          productType: "digitalproducts",
        },
        storeID: "66fbae5615b9fec5eac1b9bb",
        quantity: "1",
        productType: "digitalproducts",
        priceAtAdd: "450000",
        originalPrice: "450000",
        _id: "67f33392a5c0a7c7bb5dc5a9",
      },
    ],
    shippingMethods: [
      {
        name: "Standard Shipping",
        price: "120000",
        estimatedDeliveryDays: "5",
        isActive: "true",
        description: "Within 4-5 business days.",
      },
      {
        name: "Express",
        price: "250000",
        estimatedDeliveryDays: "3",
        isActive: "true",
        description: "Within 3-4 business days.",
      },
    ],
    selectedShippingMethod: {
      name: "Standard Shipping",
      price: "120000",
      estimatedDeliveryDays: "5",
      isActive: "true",
      description: "Within 4-5 business days.",
    },
  },
];
