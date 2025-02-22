"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/context/stateContext";
import { addCommasToNumber } from "@/lib/utils";
import { useMemo } from "react";

export function CartSummary() {
  const { cartItems, totalPrice, grandTotalPrice } = useStateContext();

  // Memoized calculated values
  const isEmpty = useMemo(() => cartItems.length === 0, [cartItems.length]);
  const subtotal = useMemo(() => Math.max(totalPrice, 0), [totalPrice]);

  return (
    <section
      aria-labelledby="order-summary"
      className="mt-16 rounded-lg border-2 border-udua-orange-primary/30 bg-gray-50 p-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <div className="rounded-md border p-4 shadow-2xl">
        <h2 id="order-summary" className="text-lg font-medium">
          Order Summary
        </h2>

        <dl className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm">Subtotal</dt>
            <dd className="text-sm font-medium">
              &#8358; {addCommasToNumber(subtotal)}
            </dd>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
            <dt className="text-base font-medium">Order Total</dt>
            <dd className="text-base font-medium">
              &#8358; {addCommasToNumber(grandTotalPrice)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        {isEmpty ? (
          <Button
            className="w-full bg-udua-orange-primary/85 hover:bg-udua-orange-primary"
            disabled
          >
            Checkout
          </Button>
        ) : (
          <Link href="/checkout" className="block w-full">
            <Button className="w-full bg-udua-orange-primary/85 hover:bg-udua-orange-primary">
              Checkout
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}

// "use client";

// import { Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { useStateContext } from "@/context/stateContext";
// import Link from "next/link";
// import { Switch } from "./ui/switch";
// import { getDeliveryWindow } from "@/utils/shared/shared";
// import DoorDelivery from "@/utils/DoorDelivery/doorDelivery";
// import FreeDelivery from "@/utils/FreeDelivery/freeDelivery";
// import { addCommasToNumber } from "@/lib/utils";

// export function CartSummary() {
//   const {
//     cartItems,
//     totalPrice,
//     grandTotalPrice,
//     shippingFee,
//     deliveryMethod,
//     handleOptionChange,
//   } = useStateContext();

//   const disabledIsLoading = cartItems.length === 0 ? true : false;
//   const isLoading = disabledIsLoading;
//   const Subtotal = totalPrice >= 1 ? totalPrice : 0;

//   return (
//     <section
//       aria-labelledby="summary-heading"
//       className="mt-16 rounded-lg border-2 border-ray-200 border-udua-orange-primary/30 bg-gray-50 px-4 py-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
//     >
//       {/* {cartItems.length >= 1 && (
//         <div className=" border p-4 rounded-md shadow-lg mb-5">
//           <h2 id="summary-heading" className="text-lg font-medium">
//             Shipping/Delivery Method
//           </h2>

//           <div className="mt-6 space-y-4 flex flex-row items-center justify-between rounded-lg border p-4">
//             <div className="space-y-0.5">
//               <p className="text-lg flex items-center gap-2">
//                 Free Shipping <FreeDelivery/>
//               </p>

//               <p className="text-sm text-gray-400">
//                 Currently, we only support Free Delivery only within UNICAL Campus.
//               </p>
//             </div>

//             <Switch
//               checked={deliveryMethod === 'Free Shipping'}
//               onCheckedChange={() => handleOptionChange('Free Shipping')}
//             />

//           </div>

//           <div className="mt-6 space-y-4 flex flex-row items-center justify-between rounded-lg border p-4">
//             <div className="space-y-0.5">
//               <p className="text-lg flex items-center gap-2">
//                 Door Delivery <DoorDelivery />
//               </p>

//               <p className="text-sm text-gray-400">
//                 Delivery Fees ₦ 700. <br/>
//                 {getDeliveryWindow()}
//               </p>
//             </div>

//             <Switch
//               checked={deliveryMethod === 'Door Delivery'}
//               onCheckedChange={() => handleOptionChange('Door Delivery')}
//             />

//           </div>
//         </div>
//       )} */}

//       <div className="border p-4 rounded-md shadow-2xl">
//         <h2 id="summary-heading" className="text-lg font-medium">
//           Order summary
//         </h2>

//         <dl className="mt-6 space-y-4">
//           <div className="flex items-center justify-between">
//             <dt className="text-sm">Subtotal</dt>
//             <dd className="text-sm font-medium">
//               &#8358; {addCommasToNumber(Subtotal)}
//             </dd>
//           </div>
//           {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
//             <dt className="flex items-center text-sm">
//               <span>Shipping estimate</span>
//             </dt>
//             <dd className="text-sm font-medium">
//               {shippingFee !== 0 && <span>&#8358;</span>}{" "}
//               {shippingFee === 0 ? `Free Shipping` : `${Number(shippingFee)}`}
//             </dd>
//           </div> */}
//           <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
//             <dt className="text-base font-medium">Order total</dt>
//             <dd className="text-base font-medium">
//               &#8358; {addCommasToNumber(grandTotalPrice)}
//             </dd>
//           </div>
//         </dl>
//       </div>

//       <div className="mt-6">
//         <Button
//           className="w-full bg-udua-orange-primary/85 hover:bg-udua-orange-primary"
//           disabled={disabledIsLoading}
//         >
//           <Link className="flex w-full" href={`/checkout`}>
//             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             {isLoading ? "Loading..." : "Checkout"}
//           </Link>
//         </Button>
//       </div>
//     </section>
//   );
// }
