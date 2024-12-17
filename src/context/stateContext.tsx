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

  const addToCart = (
    product: ProductFromLocalStorage,
    quantity: number,
    selectedSize: string | null,
    selectedColor: string | null
  ) => {
    const existingProductIndex = cartItems.findIndex(
      (item) => item._id!.toString() === product._id!.toString()
    );
    {
      /*This ensures that you are comparing the string representations of the _id properties, which is necessary because ObjectId instances need to be converted to strings to be compared correctly.*/
    }

    if (product.productType === "Physical Product") {
      setTotalPriceFromStorage(totalPrice + product.productPrice! * quantity);
      setTotalQuantityFromStorage(totalQuantity + quantity);

      // if the product is in the cart, then run this function
      if (existingProductIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingProductIndex].quantity! += quantity;
        if (selectedSize) {
          updatedCartItems[existingProductIndex].size! = selectedSize;
        }
        if (selectedColor) {
          updatedCartItems[existingProductIndex].colors! = [selectedColor];
        }
        setCartItems(updatedCartItems);
        setCartItemsFromStorage(updatedCartItems);
      } else {
        const {
          productDescription,
          productSizes,
          productSpecification,
          ...newProduct
        } = product; // I am removing productDescription, productSizes, productSpecification so as not to send this unnecessary info to paystack DB

        newProduct.quantity = quantity;
        setCartItems([...cartItems, { ...newProduct }]);
        setCartItemsFromStorage([...cartItemsFromStorage, { ...newProduct }]);
      }

      setTotalPrice(
        (prevTotalPrice) => prevTotalPrice + product.productPrice! * quantity
      );
      setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + quantity);
    }

    if (product.productType === "Digital Product") {
      setTotalPriceFromStorage(totalPrice + product.price! * quantity);
      setTotalQuantityFromStorage(totalQuantity + quantity);

      // if the product is in the cart, then run this function
      if (existingProductIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingProductIndex].quantity! += quantity;

        setCartItems(updatedCartItems);
        setCartItemsFromStorage(updatedCartItems);
      } else {
        const { description, fileType, fileSize, ...newProduct } = product; // I am removing fileType, description, fileSize so as not to send this unnecessary info to paystack DB

        newProduct.quantity = quantity;
        setCartItems([...cartItems, { ...newProduct }]);
        setCartItemsFromStorage([...cartItemsFromStorage, { ...newProduct }]);
      }

      setTotalPrice(
        (prevTotalPrice) => prevTotalPrice + product.price! * quantity
      );
      setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + quantity);
    }
  };

  const onRemove = (product: CartItems) => {
    const foundProduct = cartItems.find((item) => item._id === product._id);
    if (!foundProduct) return;
  
    const updatedCartItems = cartItems.filter(
      (item) => item._id !== product._id
    );
  
    // Determine the price based on the product type
    const productPrice = foundProduct.productType === "Physical Product"
      ? foundProduct.productPrice!
      : foundProduct.price!;
  
    // Update the state
    setCartItems(updatedCartItems);
    setTotalPrice(totalPrice - productPrice * foundProduct.quantity!);
    setTotalQuantity(totalQuantity - foundProduct.quantity!);
    setTotalQuantityFromStorage(totalQuantity - foundProduct.quantity!);
    setTotalPriceFromStorage(totalPrice - productPrice * foundProduct.quantity!);
    setCartItemsFromStorage(updatedCartItems);
  };  

  const toggleCartItemQuantity = (
    itemId: string,
    value: "increase" | "decrease"
  ) => {
    const foundProductIndex = cartItems.findIndex((item) => item._id === itemId);
    if (foundProductIndex === -1) return;
    
    const foundProduct = cartItems[foundProductIndex];
    const updatedCartItems = [...cartItems];
    
    // Determine the price based on product type
    const productPrice = foundProduct.productType === "Physical Product" 
      ? foundProduct.productPrice! 
      : foundProduct.price!;
    
    // Determine the quantity adjustment
    const quantityChange = value === "increase" ? 1 : -1;
  
    // Prevent decreasing if quantity is 1
    if (value === "decrease" && foundProduct.quantity === 1) return;
  
    // Update product quantity
    updatedCartItems[foundProductIndex] = {
      ...foundProduct,
      quantity: foundProduct.quantity! + quantityChange,
    };
  
    // Update the state
    setCartItems(updatedCartItems);
    setTotalPrice((prevTotalPrice) => prevTotalPrice + quantityChange * productPrice);
    setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + quantityChange);
    setTotalQuantityFromStorage(totalQuantity + quantityChange);
    setTotalPriceFromStorage(totalPrice + quantityChange * productPrice);
    setCartItemsFromStorage(updatedCartItems);
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
