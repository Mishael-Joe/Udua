"use client";

import React, { createContext, useContext, useState } from "react";
import {
  ContextType,
  StateContextProps,
  CartItems,
  Cart,
  CombinedProduct,
} from "@/types";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Context = createContext<ContextType | null>(null);

export const StateContext: React.FC<StateContextProps> = ({ children }) => {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const preventRedirect = pathname.endsWith("/");

  let cart = [
    {
      product: {
        _id: "670075f70d87b0b2b62ad1aa",
        productType: "physicalproducts",
        category: ["Body Care Products"],
        images: [
          "https://res.cloudinary.com/dhngvbjtz/image/upload/v1728083446/qfewevb0j8yfakrjxgsv.jpg",
        ],
        name: "Roberto Cavalli Oil Perfume",
        sizes: [],
        price: 22000,
      },
      productType: "physicalproducts",
      quantity: 1,
      _id: "67ac97368f4f5b934f2d60d7",
    },
    {
      product: {
        _id: "670075f70d87b0b2b62ad1aa",
        productType: "physicalproducts",
        category: ["Body Care Products"],
        images: [
          "https://res.cloudinary.com/dhngvbjtz/image/upload/v1728083446/qfewevb0j8yfakrjxgsv.jpg",
        ],
        name: "Roberto Cavalli Oil Perfume",
        sizes: [],
      },
      sizes: { size: "43", price: 22000, quantity: 4 },
      productType: "physicalproducts",
      quantity: 1,
      _id: "67ac97368f4f5b934f2d60d7",
    },
    {
      product: {
        category: "Non-Fiction",
        coverIMG: [
          "https://res.cloudinary.com/dhngvbjtz/image/upload/v1734244448/gjzx5wxant0aii1hqvhi.png",
        ],
        price: 4500,
        productType: "digitalproducts",
        title: "Atomic Habits: Tiny Changes, Remarkable Results by James Clear",
        _id: "675e786172b144a2ec0fce92",
      },
      productType: "digitalproducts",
      quantity: 1,
      _id: "67ac97368f4f5b934f2d60d7",
    },
  ];

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);

  const fetchCartItems = async () => {
    try {
      // const response = await axios.post("/api/user/cart");
      const { data } = await axios.post("/api/user/cart");

      // console.log("data:", data);
      setCartItems(data.items || []);
      setTotalPrice(data.totalPrice || 0);
      setTotalQuantity(data.totalQuantity || 0);
    } catch (error: any) {
      if (
        error.response.data.error ===
          "Error getting user data from token: jwt must be provided" &&
        !preventRedirect
      ) {
        router.push("/sign-in");
      }
      console.error("Error fetching Cart Items:", error);
    }
  };

  const addToCart = async (
    product: CombinedProduct,
    storeID: string,
    quantity: number,
    selectedSize: { size: string; price: number; quantity: number } | null,
    selectedColor: string | null
  ) => {
    // console.log("product", product);
    // console.log("storeID", storeID);
    // console.log("quantity", quantity);
    // console.log("selectedSize", selectedSize);
    // console.log("selectedColor", selectedColor);
    try {
      // Build the payload to send to the server.
      const payload = {
        productID: product._id, // Assumes your product has an _id property
        storeID,
        productType: product.productType, // e.g., "Physical Product" or "Digital Product"
        quantity,
        selectedSize, // For size-based products; can be null if not applicable
        selectedColor, // For color-based products; can be null if not applicable
      };

      // Send a POST request to the API route for adding/updating the cart using Axios.
      const response = await axios.post("/api/user/cart/add-product", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast({
          title: `Product added to cart`,
          description: `Quantity: ${quantity}`,
          action: (
            <Link href="/cart">
              <Button variant="link" className="gap-x-2 whitespace-nowrap">
                <span>Open cart</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          ),
        });

        // Fetch the updated cart items after adding/updating the cart.
        fetchCartItems();
      }

      // Axios returns the data in response.data
      // console.log("Cart updated:", response.data);
    } catch (error: any) {
      // If there's an error response from the server, log the response data.
      if (error.response) {
        console.error("Failed to add to cart:", error.response.data);
      } else {
        console.error("Error adding to cart:", error.message);
      }
    }
  };

  const onRemove = async (
    product: CartItems,
    selectedSize: { size: string; price: number; quantity: number } | null
  ) => {
    try {
      // Build the URL with query parameters.
      let url = `/api/user/cart?productID=${
        product.product._id
      }&productType=${encodeURIComponent(product.product.productType)}`;

      // If a selected size exists (for size-based products), include it in the query.
      if (selectedSize) {
        url += `&size=${encodeURIComponent(selectedSize.size)}`;
      }

      // Send the DELETE request using Axios.
      const response = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast({
          title: "Product removed from cart",
          description: `Quantity: ${product.quantity}`,
        });

        // After successful removal, update the cart items.
        fetchCartItems();
      }

      // console.log("Item removed from cart:", response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Failed to remove from cart:", error.response.data);
      } else {
        console.error("Error removing from cart:", error.message);
      }
    }
  };

  const toggleCartItemQuantity = async (
    cartItemID: string,
    value: "increase" | "decrease"
  ) => {
    // Build the payload for the PUT request.
    const payload = {
      cartItemID, // Ensure your product has an _id property.
      value,
    };

    try {
      // Send the PUT request to update the cart item.
      const response = await axios.put("/api/user/cart", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Fetch the updated cart items after updating the cart.
        fetchCartItems();
      }
    } catch (error: any) {
      if (error.response) {
        console.error(
          "Failed to update cart item quantity:",
          error.response.data
        );
      } else {
        console.error("Error updating cart item quantity:", error.message);
      }
    }
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity === 1 ? 1 : prevQuantity - 1));
  };

  return (
    <Context.Provider
      value={{
        onRemove,
        quantity,
        addToCart,
        cartItems,
        totalPrice,
        totalQuantity,
        fetchCartItems,
        incrementQuantity,
        decrementQuantity,
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
