"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import {
  ProductFromLocalStorage,
  ContextType,
  StateContextProps,
  CartItems,
} from "@/types";

export const Context = createContext<ContextType | null>(null);

export const StateContext: React.FC<StateContextProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ProductFromLocalStorage[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const [shippingFee, setShippingFee] = useState<number>(0);
  const [grandTotalPrice, setGrandTotalPrice] = useState<number>(0);
  const [deliveryMethod, setDeliveryMethod] = useState<string>("Door Delivery");

  const [cartItemsFromStorage, setCartItemsFromStorage] = useLocalStorage<
    ProductFromLocalStorage[]
  >("cartItems", []);
  const [totalPriceFromStorage, setTotalPriceFromStorage] =
    useLocalStorage<number>("totalPrice", 0);
  const [totalQuantityFromStorage, setTotalQuantityFromStorage] =
    useLocalStorage<number>("totalQuantity", 0);
  const [quantityFromStorage, setQuantityFromStorage] = useLocalStorage<number>(
    "quantity",
    1
  );
  const [shippingFeeFromStorage, setShippingFeeFromStorage] =
    useLocalStorage<number>("shippingFee", 0);
  const [grandTotalPriceFromStorage, setGrandTotalPriceFromStorage] =
    useLocalStorage<number>("grandTotalPrice", 0);

  useEffect(() => {
    setCartItems(cartItemsFromStorage);
    setTotalPrice(totalPriceFromStorage);
    setTotalQuantity(totalQuantityFromStorage);
    setQuantity(quantityFromStorage);
    setShippingFee(shippingFeeFromStorage);
    setGrandTotalPrice(grandTotalPriceFromStorage);
  }, [
    cartItemsFromStorage,
    totalPriceFromStorage,
    totalQuantityFromStorage,
    grandTotalPriceFromStorage,
    deliveryMethod,
    shippingFeeFromStorage,
  ]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setShippingFeeFromStorage(0);
    } else {
      if (deliveryMethod === "Free Shipping") {
        setShippingFeeFromStorage(0);
      } else if (deliveryMethod === "Door Delivery") {
        setShippingFeeFromStorage(700);
      }
    }
    if (cartItems.length === 0) {
      setGrandTotalPriceFromStorage(0);
    } else {
      setGrandTotalPriceFromStorage(shippingFeeFromStorage + totalPrice);
    }
  }, [cartItems, totalPrice, deliveryMethod, shippingFeeFromStorage]);

  const clearItemsInCart = () => {
    setCartItemsFromStorage([]);
    setTotalPriceFromStorage(0);
    setTotalQuantityFromStorage(0);
    setShippingFeeFromStorage(0);
    setGrandTotalPriceFromStorage(0);
  };

  const addToCart = (product: ProductFromLocalStorage, quantity: number) => {
    const existingProductIndex = cartItems.findIndex(
      (item) => item._id!.toString() === product._id!.toString()
    );
    {
      /*This ensures that you are comparing the string representations of the _id properties, which is necessary because ObjectId instances need to be converted to strings to be compared correctly.*/
    }

    setTotalPriceFromStorage(totalPrice + product.productPrice! * quantity);
    setTotalQuantityFromStorage(totalQuantity + quantity);

    // if the product is not in the cart, then run this function
    if (existingProductIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingProductIndex].quantity! += quantity;
      setCartItems(updatedCartItems);
      setCartItemsFromStorage(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
      setCartItemsFromStorage([...cartItemsFromStorage, { ...product }]);
    }

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.productPrice! * quantity
    );
    setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + quantity);
  };

  const onRemove = (product: CartItems) => {
    const foundProduct = cartItems.find((item) => item._id === product._id);
    if (!foundProduct) return;

    const updatedCartItems = cartItems.filter(
      (item) => item._id !== product._id
    );

    setCartItems(updatedCartItems);
    setTotalPrice(
      totalPrice - foundProduct.productPrice! * foundProduct.quantity!
    );
    setTotalQuantity(totalQuantity - foundProduct.quantity!);
    setTotalQuantityFromStorage(totalQuantity - foundProduct.quantity!);
    setTotalPriceFromStorage(
      totalPrice - foundProduct.productPrice! * foundProduct.quantity!
    );
    setCartItemsFromStorage(updatedCartItems);
  };

  const toggleCartItemQuantity = (
    itemId: string,
    value: "increase" | "decrease"
  ) => {
    const foundProductIndex = cartItems.findIndex(
      (item) => item._id === itemId
    );
    if (foundProductIndex === -1) return;
    const foundProduct = cartItems[foundProductIndex];
    const updatedCartItems = [...cartItems];

    if (value === "increase") {
      updatedCartItems[foundProductIndex] = {
        ...foundProduct,
        quantity: foundProduct.quantity! + 1,
      };
      setCartItems(updatedCartItems);
      setTotalPrice(
        (prevTotalPrice) => prevTotalPrice + foundProduct.productPrice!
      );
      setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + 1);
      setTotalQuantityFromStorage(totalQuantity + 1);
      setTotalPriceFromStorage(totalPrice + foundProduct.productPrice!);
      setCartItemsFromStorage(updatedCartItems);
    }

    if (value === "decrease") {
      if (updatedCartItems[foundProductIndex].quantity === 1) return;
      updatedCartItems[foundProductIndex] = {
        ...foundProduct,
        quantity: foundProduct.quantity! - 1,
      };
      setCartItems(updatedCartItems);
      setTotalPrice(
        (prevTotalPrice) => prevTotalPrice - foundProduct.productPrice!
      );
      setTotalQuantity((prevTotalQuantity) => prevTotalQuantity - 1);
      setTotalQuantityFromStorage(totalQuantity - 1);
      setTotalPriceFromStorage(totalPrice - foundProduct.productPrice!);
      setCartItemsFromStorage(updatedCartItems);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity === 1 ? 1 : prevQuantity - 1));
  };

  const handleOptionChange = (option: string) => {
    setDeliveryMethod(option);
  };

  return (
    <Context.Provider
      value={{
        onRemove,
        quantity,
        addToCart,
        cartItems,
        totalPrice,
        shippingFee,
        totalQuantity,
        deliveryMethod,
        grandTotalPrice,
        clearItemsInCart,
        incrementQuantity,
        decrementQuantity,
        handleOptionChange,
        toggleCartItemQuantity,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useStateContext must be used within a StateContext Provider"
    );
  }
  return context;
};
