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
  isVarified: boolean;
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
