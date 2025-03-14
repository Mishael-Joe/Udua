import type { CartItems } from "@/types";

type TransactionVerificationResult = {
  status: string;
  eventStatus: boolean;
  channel: string;
  amount: number;
  metadata: {
    itemsInCart: CartItems[];
    userID: string;
    state: string;
    city: string;
    address: string;
    deliveryMethod: string;
    postal_code: string;
  };
  customer: {
    email: string;
  };
};

/**
 * Verifies a Paystack transaction by its reference
 * @param transactionReference The transaction reference to verify
 * @returns The transaction data if verification is successful, null otherwise
 */
export async function verifyPaystackTransaction(
  transactionReference: string
): Promise<TransactionVerificationResult | null> {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${transactionReference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to verify transaction:", await response.text());
      return null;
    }

    const result = await response.json();

    if (result.status !== true) {
      console.error("Transaction verification failed:", result);
      return null;
    }

    return {
      status: result.data.status,
      eventStatus: result.status,
      channel: result.data.channel,
      amount: result.data.amount,
      metadata: result.data.metadata,
      customer: result.data.customer,
    };
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return null;
  }
}
