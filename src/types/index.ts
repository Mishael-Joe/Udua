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
  productSubCategory: string;
  storeID: string;
  path: string;
  quantity?: number;
  colors?: string[];
  size?: string;
  isVerifiedProduct?: boolean;
};

export type Store = {
  name: string;
  password: string;
  storeOwner: string;
  storeEmail: string;
  uniqueId: string;
  description: string;
  products: string[];
}

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
  seller: string;
  products: ProductOrder[];
  totalAmount: number;
  status: string;
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
