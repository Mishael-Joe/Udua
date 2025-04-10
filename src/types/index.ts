import { ReactNode } from "react";

export type User = {
  _id?: string;
  firstName: string;
  lastName: string;
  otherNames: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  cityOfResidence: string;
  stateOfResidence: string;
  postalCode: string;
  isVerified: boolean;
  userProducts: {}[];
  forgotpasswordToken: string;
  forgotpasswordTokenExpiry: Date;
  varifyToken: string;
  varifyTokenExpiry: Date;
  stores: {
    _id: string;
    storeId: string;
    name: string;
  }[];
};

export type Product = {
  _id?: string;
  productType: "physicalproducts" | "digitalproducts" | string;
  name: string;
  price?: number; // Optional, in case the product has sizes
  sizes?: {
    size: string; // E.g., "S", "M", "L" (Optional, in case the product doesn't have sizes)
    price: number; // Size-specific price (Optional, for size-based products)
    quantity: number; // Stock for that size
  }[];
  productQuantity: number;
  images: string[];
  description: string;
  specifications: string;
  category: string;
  subCategory: string;
  storeID: string;
  path: string;
  quantity?: number;
  colors?: string[];
  size?: string;
  isVerifiedProduct?: boolean;
  isVisible?: boolean;
};

export type DigitalProduct = {
  _id?: string;
  storeID: string;
  title: string;
  author: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  fileType: string;
  fileSize: number;
  s3Key: string;
  language: string;
  coverIMG: string[]; // the book's cover img
  productType: "physicalproducts" | "digitalproducts" | string;
  isbn?: string;
  publisher?: string;
  rating?: number;
  downloads?: number;
  isVisible?: boolean;
};

export type CombinedProduct = {
  _id: string;
  storeID: string;
  productType: "physicalproducts" | "digitalproducts" | string;
  name: string; // Only for Physical Product
  sizes?: {
    size: string; // E.g., "S", "M", "L" (Optional, in case the product doesn't have sizes)
    price: number; // Size-specific price (Optional, for size-based products)
    quantity: number; // Stock for that size
    _id?: string;
  }[]; // Only for Physical Product
  productQuantity: string; // Only for Physical Product
  images: string[]; // Only for Physical Product
  description: string;
  specifications: string;
  category: string;
  subCategory: string;
  path: string;
  quantity?: number; // Could be used for both
  colors?: string[]; // Only for Physical Product
  size?: {
    size: string; // E.g., "S", "M", "L" (Optional, in case the product doesn't have sizes)
    price: number; // Size-specific price (Optional, for size-based products)
    quantity: number; // Stock for that size
    _id?: string;
  }; // Only for Physical Product
  isVerifiedProduct?: boolean; // Only for Physical Product
  isVisible?: boolean;

  // Fields for Digital Product
  title: string; // Only for Digital Product
  author?: string; // Only for Digital Product
  fileType?: string; // Only for Digital Product
  fileSize?: number; // Only for Digital Product
  s3Key?: string; // Only for Digital Product
  language?: string; // Only for Digital Product
  coverIMG: string[]; // Only for Digital Product
  isbn?: string; // Only for Digital Product
  publisher?: string; // Only for Digital Product
  rating?: number; // Only for Digital Product
  downloads?: number; // Only for Digital Product
  price: number;
  type: string;
  subcategory: string;
};

export type Store = {
  _id: string;
  name: string;
  password: string;
  storeOwner: string;
  storeEmail: string;
  uniqueId: string;
  followers: string[];
  description: string;
  createdAt: Date;
  products: CombinedProduct[];
  availableBalance: number;
  pendingBalance: number;
  platformFee: number;
  transactionFees: number;
  totalEarnings: number;
  payoutAccounts: PayoutAccounts[];
  payoutHistory: PayoutHistory[];
};

export type PayoutAccounts = {
  payoutMethod: string[];
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  totalEarnings: string;
  lastPayoutDate: Date;
};

export type PayoutHistory = {
  payoutAccount: string;
  amount: number;
  payoutDate: Date;
  payoutMethodDetails: {
    bankDetails: {
      bankName: string;
      accountNumber: string;
    };
    mobileWallet: {
      walletProvider: String;
      walletId: String;
    };
  };
  status: "pending" | "completed" | "failed";
  platformFee: number;
  transactionFees: number;
  taxes: number;
};

export type RequestBodyTypes = {
  address: string;
  secondary_phone_number: string;
  city: string;
  state: string;
  postal_code: string;
  itemsInCart: CartItems[];
  deliveryMethod: string;
  userID: string;
};

export type ResultDataMetadataItemsInCart = {
  _id: string;
  quantity: number;
  city: string;
  state: string;
  postal_code: string;
  itemsInCart: CartItems[];
  deliveryMethod: string;
};

export type IOrderProduct = {
  product: {
    _id: string;
    productName: string;
  };
  quantity: number;
  price: number;
};

export type IOrder = {
  _id: string;
  user: string; // assuming it's a string; replace with the appropriate type if needed
  seller: string;
  products: IOrderProduct[];
  totalAmount: number;
  status: string;
};

export type ProductOrder = {
  physicalProducts?: Product | string; // ObjectId reference
  digitalProducts?: DigitalProduct | string; // ObjectId reference
  store: string;
  quantity: number;
  priceAtOrder: number;
  originalPrice?: number;
  selectedSize?: {
    size: string;
    price: number;
  };
  dealInfo?: DealInfo;
};

interface DealInfo {
  dealId: string;
  dealType:
    | "percentage"
    | "fixed"
    | "free_shipping"
    | "flash_sale"
    | "buy_x_get_y";
  value: number;
  name: string;
}

interface AppliedDeal {
  dealId: string;
  dealType: string;
  value: number;
  name: string;
}

export type SubOrder = {
  _id: string;
  store: Store | string; // ObjectId reference
  products: ProductOrder[];
  totalAmount: number;
  shippingMethod?: {
    name: string;
    price: number;
    estimatedDeliveryDays?: number;
    description?: string;
  };
  trackingNumber?: string;
  deliveryDate?: Date;
  deliveryStatus:
    | "Order Placed"
    | "Processing"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Canceled"
    | "Returned"
    | "Failed Delivery"
    | "Refunded";
  originalSubtotal?: number;
  savings?: number;
  appliedDeals?: AppliedDeal[];
  payoutStatus: string;
};

export type Order = {
  _id: string;
  user: User | string; // ObjectId reference
  stores: string[]; // Array of store ObjectId references
  subOrders: SubOrder[]; // Array of sub-orders, each tied to a specific store
  totalSavings?: number;
  totalAmount: number;
  status: string;
  postalCode: string;
  shippingAddress?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
  discount?: number;
  taxAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  paymentReference?: string; // Reference for the payment
};

export interface Cart {
  product: {
    _id: string;
    productType: string;
    category: string;
    images?: string[];
    name: string;
    sizes: [];
    price: number;
    coverIMG?: string[];
    title: string;
  };
  storeID: string;
  _id: string;
  selectedSize: {
    price: number;
    size: string;
    quantity: number;
  } | null;
  productType: string;
  quantity: number;
}

export type CartItems = Cart;

export type ProductFromLocalStorage = Partial<CombinedProduct>;

// Define types for the context
export type ContextType = {
  onRemove: (
    product: CartItems,
    selectedSize: { size: string; price: number; quantity: number } | null
  ) => void;
  quantity: number;
  addToCart: (
    product: CombinedProduct,
    storeID: string,
    quantity: number,
    selectedSize: {
      size: string;
      price: number;
      quantity: number;
    } | null,
    selectedColor: string | null
  ) => void;
  cartItems: CartItems[];
  totalPrice: number;
  // shippingFee: number;
  totalQuantity: number;
  // deliveryMethod: string;
  // grandTotalPrice: number;
  fetchCartItems: () => void;
  // clearItemsInCart: () => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  // handleOptionChange: (option: string) => void;
  toggleCartItemQuantity: (
    cartItemID: string,
    value: "increase" | "decrease"
  ) => void;
  // setCartItemsFromStorage: (items: CartItems[]) => void;
};

export type StateContextProps = {
  children: ReactNode;
};

export type ForProductGrid = {
  products: CombinedProduct[];
};

export type ForProductInfo = {
  product: CombinedProduct;
};

export type ForProductGallery = {
  product: CombinedProduct;
  isLikedProduct: boolean;
};

// Define a single Bank type
export type Bank = {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null; // Gateway can be null
  pay_with_bank: boolean;
  supports_transfer: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string; // Date can be used if you want to handle date objects
  updatedAt: string; // Date can be used if you want to handle date objects
};

// Type Definitions
export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  bankCode: Number;
  bankId: Number;
}

export interface PayoutAccount {
  payoutMethod: string;
  bankDetails: BankDetails;
}

export interface Payout_Account {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  _id: string;
}

export interface Settlement {
  _id: string;
  storeID: string;
  mainOrderID: string;
  subOrderID: string;
  settlementAmount: number;
  payoutAccount: Payout_Account;
  payoutStatus: "Requested" | "Processing" | "Paid" | "Failed"; // assuming there could be other statuses
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
}

export interface Deal {
  _id: string;
  name: string;
  dealType:
    | "percentage"
    | "fixed"
    | "free_shipping"
    | "flash_sale"
    | "buy_x_get_y";
  value: number;
  startDate: Date | string;
  endDate: Date | string;
  products?: {
    _id: string;
    name?: string;
    title?: string;
    price: number;
    images?: string[];
    coverIMG?: string;
    productType: string;
    sizes?: {
      size: string;
      price: number;
      quantity: number;
    }[];
  }[];
  storeID: string;
  description: string;
  productIds: string[];
  categoryIds: string;
  isActive: boolean;
  minCartValue: number;
  maxDiscountValue: number;
  usageLimit: number;
  usageCount: number;
  autoApply: boolean;
  applyToSizes: string;
  code: string;

  // Buy X Get Y specific fields
  buyQuantity: number;
  getQuantity: number;
  getProductIds: string;

  // Flash sale specific fields
  flashSaleQuantity: number;
  flashSaleRemaining: number;

  analytics: {
    viewCount: number;
    clickCount: number;
    redemptionCount: number;
    totalDiscountAmount: number;
    revenueGenerated: number;
    uniqueUsersUsed: string[];
    averageOrderValue: number;
    firstRedemptionDate: Date;
    lastRedemptionDate: Date;
  };
}

/**
 * Shipping method interface
 */
export interface ShippingMethod {
  name: string;
  price: number;
  description?: string;
  estimatedDeliveryDays?: string;
}

/**
 * Cart product interface
 */
export interface CartProduct {
  _id: string;
  product: any;
  quantity: number;
  productType: "physicalproducts" | "digitalproducts";
  selectedSize?: {
    size: string;
    price: number;
    quantity: number;
  };
  priceAtAdd: number;
  originalPrice: number;
  dealInfo?: {
    dealId: string;
    dealType: string;
    value: number;
    name: string;
    endDate: Date;
  };
}

/**
 * Grouped cart interface
 */
export interface GroupedCart {
  storeID: string;
  storeName: string;
  products: CartProduct[];
  shippingMethods?: ShippingMethod[];
  selectedShippingMethod?: ShippingMethod;
}
