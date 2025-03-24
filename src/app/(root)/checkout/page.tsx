"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import StoreCartGroup from "./components/store-cart-group";
import OrderSummary from "./components/order-summary";
import { CombinedProduct, User } from "@/types";
import axios from "axios";
const { v4: uuidv4 } = require("uuid");
import { useToast } from "@/components/ui/use-toast";

// Interface for each product in the cart
interface CartProduct {
  price: number; // Price of the product (can be size-based)
  product: CombinedProduct;
  quantity: number; // Quantity of the product
  productType: "physicalproducts" | "digitalproducts"; // Type of product
  selectedSize?: {
    size: string;
    price: number;
    quantity: number;
  };
  storeID: string; // The ID of the store that owns the product
  _id: string; // Product ID
}

// Interface for each shipping method
export interface ShippingMethod {
  name: string; // Name of the shipping method
  price: number; // Price of the shipping method
  description: string; // Estimated delivery time (e.g., "2-3 days")
  estimatedDeliveryDays: string; // Estimated delivery time (e.g., "2-3 days")
}

// Interface for the grouped cart by store
export interface GroupedCart {
  storeID: string; // The ID of the store
  products: CartProduct[]; // Array of products belonging to the store
  shippingMethods?: ShippingMethod[]; // Array of available shipping methods for the store
  selectedShippingMethod?: ShippingMethod;
}

// Interface for the overall response
interface CartResponse {
  totalQuantity: number; // Total quantity of items in the cart
  totalPrice: number; // Total price of the items in the cart
  groupedCart: GroupedCart[]; // Array of store-grouped cart items
}

type user = {
  data: User;
};

export default function CheckoutPage() {
  const { toast } = useToast();
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();
  const [cartItemsWithShippingMethod, setCartItemsWithShippingMethod] =
    useState<GroupedCart[] | null>(null);
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [loading1, setLoading1] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // selectedShippingMethods is a record where the key is storeID and the value is the ShippingMethod
  const [selectedShippingMethods, setSelectedShippingMethods] = useState<
    Record<string, ShippingMethod>
  >({});
  const [totalShippingCost, setTotalShippingCost] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(
          "/api/user/cart/fetch-cart-items-with-shipping-methods",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }

        const data: CartResponse = await response.json();
        setCartItemsWithShippingMethod(data.groupedCart);
        console.log("Cart data:", data);

        // Add mock shipping methods for testing if none exist
        // if (data.groupedCart && data.groupedCart.length > 0) {
        //   // Check if we need to add mock shipping methods
        //   const needsMockShipping = data.groupedCart.every(
        //     (group: GroupedCart) =>
        //       !group.shippingMethods || group.shippingMethods.length === 0
        //   );

        //   if (needsMockShipping) {
        //     // Add mock shipping methods to the first store group
        //     data.groupedCart[0].shippingMethods = [
        //       {
        //         _id: "shipping1",
        //         name: "Standard Shipping",
        //         price: 1000,
        //         estimatedDeliveryDays: 5,
        //         description: "Delivery within 3-7 business days",
        //       },
        //       {
        //         _id: "shipping2",
        //         name: "Express Shipping",
        //         price: 2500,
        //         estimatedDeliveryDays: 2,
        //         description: "Delivery within 1-3 business days",
        //       },
        //     ];
        //   }
        // }

        setCartData(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        setLoading1(true);
        const response = await axios.post<user>(`/api/user/userData`);
        // console.log("userdata", response);
        setUserData(response.data.data);
      } catch (error: any) {
        console.log(error);
        throw new Error(`Failed to fetch user data`, error.Message);
      } finally {
        setLoading1(false);
      }
    };

    fetchUserData();
    fetchCartData();
  }, []);

  useEffect(() => {
    // Calculate total shipping cost whenever selected shipping methods change
    let totalShipping = 0;
    Object.values(selectedShippingMethods).forEach((method: ShippingMethod) => {
      totalShipping += method.price || 0;
    });
    setTotalShippingCost(totalShipping);
  }, [selectedShippingMethods]);

  const handleShippingMethodChange = (
    storeId: string,
    method: ShippingMethod
  ) => {
    // console.log("Selecting shipping method:", method, "for store:", storeId);
    // console.log("selectedShippingMethods111:", selectedShippingMethods);
    setSelectedShippingMethods((prev) => ({
      ...prev,
      [storeId]: method,
    }));
    // console.log("selectedShippingMethods3333", selectedShippingMethods);
  };

  const handlePlaceOrder = async () => {
    // Check if shipping methods are selected for all stores with shipping methods available
    const storesWithShippingMethods = cartData?.groupedCart.filter(
      (group: GroupedCart) =>
        group.shippingMethods && group.shippingMethods.length > 0
    );

    if (
      storesWithShippingMethods!.length > 0 &&
      Object.keys(selectedShippingMethods).length <
        storesWithShippingMethods!.length
    ) {
      setError("Please select shipping methods for all stores");
      return;
    }

    // // Iterate through cart items and assign selected shipping methods
    // if (cartItemsWithShippingMethod) {
    //   const updatedCartItems = cartItemsWithShippingMethod.map((item) => {
    //     // Find the selected shipping method for this store by storeID
    //     const selectedMethod = selectedShippingMethods[item.storeID];

    //     // console.log("selectedMethod", selectedMethod);

    //     // Destructure the item to exclude shippingMethods
    //     const { shippingMethods, ...restOfItem } = item;

    //     // Attach the selected shipping method to the item if it exists
    //     return {
    //       ...restOfItem,
    //       selectedShippingMethod: selectedMethod || null, // Fallback to null if no method is selected
    //     };
    //   });

    //   // Optionally, update the cartItemsWithShippingMethod state
    //   setCartItemsWithShippingMethod(updatedCartItems);
    // }
    console.log("cartItemsWithShippingMethod", cartItemsWithShippingMethod);

    if (!userData) return;
    const config = {
      cartItemsWithShippingMethod: cartItemsWithShippingMethod,
      selectedShippingMethods: selectedShippingMethods,
      amount: cartData!.totalPrice + totalShippingCost,
      customer: {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        uniqueRef: "Udua" + uuidv4(),
        phone_number: userData.phoneNumber,
      },
      meta: {
        city: userData.cityOfResidence,
        state: userData.stateOfResidence,
        address: userData.address,
        itemsInCart: cartItemsWithShippingMethod,
        // itemsInCart: [...cartItems],
        // deliveryMethod: deliveryMethod,
        postal_code: userData.postalCode || "",
        userID: userData._id,
      },
    };

    try {
      const response = await fetch("/api/paystack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (response.status === 200) {
        // console.log("updatedCartItems", data);
        window.location.href = data.data.authorization_url; // Redirect to the payment link
      } else {
        toast({
          variant: "default",
          title: "Error",
          description: data.error,
        });
        console.error("data", data);
      }
    } catch (error) {
      toast({
        variant: "default",
        title: "Error",
        description:
          "An error occurred while processing your payment. Please try again later. If this error still persists, please contact our support team.",
      });
      console.error("An error occurred while processing your payment:", error);
    }
    // Here you would implement the order placement logic
    console.log(
      "Placing order with shipping methods:",
      selectedShippingMethods
    );
    // router.push("/order-confirmation");
  };

  if (loading || loading1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-destructive">Error: {error}</p>
        <Button className="mt-4" onClick={() => router.push("/cart")}>
          Return to Cart
        </Button>
      </div>
    );
  }

  if (!cartData || cartData.totalQuantity === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some items to your cart before checking out.
        </p>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartData.groupedCart.map((group: GroupedCart) => (
            <StoreCartGroup
              key={group.storeID}
              storeGroup={group}
              onShippingMethodChange={(method) =>
                handleShippingMethodChange(group.storeID, method)
              }
              selectedShippingMethod={selectedShippingMethods[group.storeID]}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            subtotal={cartData.totalPrice}
            shippingCost={totalShippingCost}
            totalItems={cartData.totalQuantity}
            onPlaceOrder={handlePlaceOrder}
            userData={userData!}
            isComplete={cartData.groupedCart.every(
              (group: GroupedCart) =>
                !group.shippingMethods ||
                group.shippingMethods.length === 0 ||
                selectedShippingMethods[group.storeID]
            )}
          />
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { CheckoutSummary } from "@/components/checkout-cart-summary";
// import { CheckoutCartItems } from "@/components/chect-out-cart-items";
// import { User } from "@/types";
// import axios from "axios";
// import { Loader } from "lucide-react";
// import { useEffect, useState } from "react";

// type user = {
//   data: User;
// };

// const CheckoutPage = () => {
//   const [userData, setUserData] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.post<user>(`/api/user/userData`);
//         // console.log("userdata", response);
//         setUserData(response.data.data);
//       } catch (error: any) {
//         console.log(error);
//         throw new Error(`Failed to fetch user data`, error.Message);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (userData === null) {
//     return (
//       <>
//         <div className="w-full min-h-screen flex items-center justify-center">
//           <p className="w-full h-full flex items-center justify-center">
//             <Loader className=" animate-spin" /> Loading...
//           </p>
//         </div>
//       </>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
//         <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
//           Ready To Pay
//         </h1>

//         <form className="my-5 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
//           <section aria-labelledby="cart-heading" className="lg:col-span-7">
//             <h2 id="cart-heading" className="sr-only">
//               Pleasa, Fill out your Information
//             </h2>

//             <div>
//               <h3 className="text-sm font-semibold mt-3">Shipping to</h3>

//               <div className="flex justify-between pb-4">
//                 <div>
//                   <p className="text-sm mt-2">
//                     {userData.firstName} {userData.lastName}
//                   </p>
//                   <p className="text-sm mt-2">{userData.phoneNumber}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm mt-1">{userData.address}</p>
//                   <p className="text-sm mt-1">
//                     {userData.cityOfResidence}, {userData.stateOfResidence}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Cart Items */}
//             <CheckoutCartItems />

//             {/* <p>Thank you for helping us serve you better!</p> */}
//           </section>
//           {/* Cart Summary */}
//           <CheckoutSummary userData={userData} />
//         </form>

//         <p className="mt-4 text-sm">
//           To ensure a smooth and timely delivery, please make sure your contact
//           information is up to date. If any details have changed, kindly update
//           them before proceeding with your payment. You need to verify your
//           account before making any purchase. You can do so under the account
//           settings in your profile page.
//         </p>
//       </main>
//     </div>
//   );
// };

// export default CheckoutPage;
