"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/context/stateContext";
import { formatNaira } from "@/lib/utils";
import { useMemo } from "react";

export function CartSummary() {
  const { cartItems, totalPrice } = useStateContext();

  // Memoized calculated values
  const isEmpty = useMemo(() => cartItems.length === 0, [cartItems.length]);
  const subtotal = useMemo(() => Math.max(totalPrice, 0), [totalPrice]);

  return (
    <section
      aria-labelledby="order-summary"
      className="mt-16 rounded-lg border-2 border-udua-orange-primary/30 bg-gray-50 p-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 lg:sticky lg:top-20"
    >
      <div className="rounded-md border p-4 shadow-2xl">
        <h2 id="order-summary" className="text-lg font-medium">
          Order Summary
        </h2>

        <dl className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm">Subtotal</dt>
            <dd className="text-sm font-medium">{formatNaira(subtotal)}</dd>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
            <dt className="text-base font-medium">Order Total</dt>
            <dd className="text-base font-medium">Calculated at checkout</dd>
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

{
  /* This feature is under construction and it is comming soon. #-DEALS */
}

// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { useStateContext } from "@/context/stateContext";
// import { formatNaira } from "@/lib/utils";
// import { useMemo } from "react";
// import { Badge } from "@/components/ui/badge";

// export function CartSummary() {
//   const { cartItems, totalPrice, totalOriginalPrice, totalSavings } =
//     useStateContext();

//   // Memoized calculated values
//   const isEmpty = useMemo(() => cartItems.length === 0, [cartItems.length]);
//   const subtotal = useMemo(() => Math.max(totalPrice, 0), [totalPrice]);
//   const hasSavings = useMemo(() => totalSavings > 0, [totalSavings]);

//   return (
//     <section
//       aria-labelledby="order-summary"
//       className="mt-16 rounded-lg border-2 border-udua-orange-primary/30 bg-gray-50 p-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 lg:sticky lg:top-20"
//     >
//       <div className="rounded-md border p-4 shadow-2xl">
//         <h2 id="order-summary" className="text-lg font-medium">
//           Order Summary
//         </h2>

//         <dl className="mt-6 space-y-4">
//           <div className="flex items-center justify-between">
//             <dt className="text-sm">Subtotal</dt>
//             <dd className="text-sm font-medium">{formatNaira(subtotal)}</dd>
//           </div>

//           {/* Display savings from deals if applicable */}
//           {hasSavings && (
//             <div className="flex items-center justify-between text-udua-orange-primary">
//               <dt className="text-sm flex items-center">
//                 <Badge variant="outline" className="mr-2">
//                   Deal Savings
//                 </Badge>
//               </dt>
//               <dd className="text-sm font-medium">
//                 -{formatNaira(totalSavings)}
//               </dd>
//             </div>
//           )}

//           <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
//             <dt className="text-base font-medium">Order Total</dt>
//             <dd className="text-base font-medium">Calculated at checkout</dd>
//           </div>
//         </dl>
//       </div>

//       <div className="mt-6">
//         {isEmpty ? (
//           <Button
//             className="w-full bg-udua-orange-primary/85 hover:bg-udua-orange-primary"
//             disabled
//           >
//             Checkout
//           </Button>
//         ) : (
//           <Link href="/checkout" className="block w-full">
//             <Button className="w-full bg-udua-orange-primary/85 hover:bg-udua-orange-primary">
//               Checkout
//             </Button>
//           </Link>
//         )}
//       </div>
//     </section>
//   );
// }
