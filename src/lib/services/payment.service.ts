interface DealInfo {
  dealId: string;
  dealType: string;
  value: string;
  name: string;
  endDate: string;
  _id: string;
}

interface SizeOption {
  size: string;
  price: string;
  quantity: string;
  _id?: string;
}

interface PhysicalProduct {
  _id: string;
  storeID: string;
  productType: "physicalproducts";
  images: string[];
  name: string;
  price?: string;
  sizes?: SizeOption[];
  category: string[];
}

interface DigitalProduct {
  _id: string;
  storeID: string;
  productType: "digitalproducts";
  title: string;
  category: string;
  price: string;
  coverIMG: string[];
}

type Product = PhysicalProduct | DigitalProduct;

interface SelectedSize {
  size: string;
  price: string;
  quantity: string;
}

interface CartItem {
  product: Product;
  storeID: string;
  quantity: string;
  productType: "physicalproducts" | "digitalproducts";
  priceAtAdd: string;
  originalPrice: string;
  dealInfo?: DealInfo;
  selectedSize?: SelectedSize;
  _id: string;
}

interface ShippingMethod {
  name: string;
  price: string;
  estimatedDeliveryDays: string;
  isActive: string;
  description: string;
}

interface StoreCart {
  storeID: string;
  storeName: string;
  products: CartItem[];
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: ShippingMethod;
}

export type ItemsInCart = StoreCart[];

type TransactionVerificationResult = {
  status: string;
  eventStatus: boolean;
  channel: string;
  amount: number;
  metadata: {
    itemsInCart: ItemsInCart;
    userID: string;
    name: string;
    state: string;
    city: string;
    address: string;
    postal_code: string;
    phone_number: string;
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

    // console.log("Transaction verified successfully:", result);

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
