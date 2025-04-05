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
