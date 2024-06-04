import { ReactNode } from "react";

export type User = {
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
  isSeller: boolean;
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
  productSizes: string[];
  productQuantity: string;
  productImage: string[];
  productDescription: string;
  productSpecification: string;
  productCategory: string;
  accountId: string;
  path: string;
  quantity?: number;
  isVerifiedProduct?: boolean;
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

export type CartItems = Partial<Product>;

export type ProductFromLocalStorage = Partial<Product>;

// Define types for the context
export type ContextType = {
  onRemove: (product: CartItems) => void;
  quantity: number;
  addToCart: (product: ProductFromLocalStorage, quantity: number) => void;
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
};

// type ProductPrice = Exclude<Product, null>["productPrice"];
