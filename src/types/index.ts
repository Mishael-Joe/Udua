import { ReactNode } from "react";

export type Product = {
  _id?: string;
  productName: string;
  productPrice: string | number;
  productSizes: string;
  productQuantity: string;
  productImage: string[];
  productDescription: string;
  productSpecification: string;
  productCategory: string;
  accountId: string;
  path: string;
};

type CartItems = Pick<Product, "_id" | "productName" | "productPrice">;

// Define types for the context
export type ContextType = {
  onRemove: (product: Product) => void;
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

export type ProductFromLocalStorage = CartItems & {
  productPrice: number;
  quantity: number;
  // [key: string]: any;
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
