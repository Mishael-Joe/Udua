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
  isAdmin: boolean;
  userProducts: {}[];
  forgotpasswordToken: string;
  forgotpasswordTokenExpiry: Date;
  varifyToken: string;
  varifyTokenExpiry: Date;
};

export type Product = {
  _id?: string;
  productName: string;
  productPrice: number;
  productSizes?: string[];
  productQuantity: string;
  productImage: string[];
  productDescription: string;
  productSpecification: string;
  productCategory: string;
  productSubCategory: string;
  storeID: string;
  path: string;
  quantity?: number;
  colors?: string[];
  size?: string;
  isVerifiedProduct?: boolean;
  isVisible?: boolean;
};

export type Store = {
  name: string;
  password: string;
  storeOwner: string;
  storeEmail: string;
  uniqueId: string;
  description: string;
  createdAt: Date;
  products: Product[];
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
  itemsInCart: Product[];
  deliveryMethod: string;
  userID: string;
};

export type ResultDataMetadataItemsInCart = {
  _id: string;
  quantity: number;
  city: string;
  state: string;
  postal_code: string;
  itemsInCart: Product[];
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
  product: Product;
  quantity: number;
  price: number;
};

export type Order = {
  _id: string;
  user: string;
  stores: string[];
  products: ProductOrder[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: Date;

};

export type CartItems = Partial<Product>;

export type ProductFromLocalStorage = Partial<Product>;

// Define types for the context
export type ContextType = {
  onRemove: (product: CartItems) => void;
  quantity: number;
  addToCart: (
    product: ProductFromLocalStorage,
    quantity: number,
    selectedSize: string | null,
    selectedColor: string | null
  ) => void;
  cartItems: CartItems[];
  totalPrice: number;
  shippingFee: number;
  totalQuantity: number;
  deliveryMethod: string;
  grandTotalPrice: number;
  clearItemsInCart: () => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  handleOptionChange: (option: string) => void;
  toggleCartItemQuantity: (
    itemId: string,
    value: "increase" | "decrease"
  ) => void;
};

export type StateContextProps = {
  children: ReactNode;
};

export type ForProductGrid = {
  products: Product[];
};

export type ForProductInfo = {
  product: Product;
};

export type ForProductGallery = {
  product: Product;
  isLikedProduct: boolean;
};

// type ProductPrice = Exclude<Product, null>["productPrice"];


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
  orderID: string;
  settlementAmount: number;
  payoutAccount: Payout_Account;
  payoutStatus: "requested" | "completed" | "failed"; // assuming there could be other statuses
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
}
