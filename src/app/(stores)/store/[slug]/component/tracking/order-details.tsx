// order-details.tsx
import { addCommasToNumber } from "@/lib/utils";
import { SubOrder } from "@/types";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface OrderDetailsProps {
  subOrders: SubOrder[];
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ subOrders }) => {
  /**
   * Resolves product image source
   * @param product - Product object
   * @returns Valid image URL or placeholder
   */
  const getImageSrc = (product: any) => {
    if (product.physicalProducts?.images?.[0]) {
      return product.physicalProducts.images[0];
    }
    if (product.digitalProducts?.coverIMG?.[0]) {
      return product.digitalProducts.coverIMG[0];
    }
    return "/placeholder.svg";
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
        <div className="space-y-8">
          {subOrders.map((subOrder) => (
            <div key={subOrder._id} className="space-y-4">
              <h3 className="font-medium text-gray-700">
                Store: {subOrder.store}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* {subOrder.products.map((product) => (
                  <div key={product._id} className="border rounded-lg p-4">
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={getImageSrc(product)}
                        alt={
                          product.physicalProducts?.name ||
                          product.digitalProducts?.title ||
                          "Product"
                        }
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="mt-4 space-y-1">
                      <h3 className="font-medium truncate">
                        {product.physicalProducts?.name ||
                          product.digitalProducts?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {product.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        Price: &#8358; {addCommasToNumber(product.price)}
                      </p>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;

// import { addCommasToNumber } from "@/lib/utils";
// import { Order } from "@/types";
// import Image from "next/image";

// interface OrderDetailsProps {
//   products: Order["products"];
// }

// const OrderDetails: React.FC<OrderDetailsProps> = ({ products }) => {
//   return (
//     <div className="mt-4">
//       <h2 className="text-xl font-semibold mb-2">
//         Product{products.length > 1 && "s"} Purchased
//       </h2>
//       <div className="grid grid-cols-1 gap-4">
//         <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3.5 w-full justify-between">
//           {products.map((product) => {
//             // Handle physical products
//             if (product.physicalProducts) {
//               return (
//                 <div
//                   className="gri sm:grid-cols-2 gap-4 text-sm w-full relative"
//                   key={product.physicalProducts.name}
//                 >
//                   {/* Product image */}
//                   <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                     {product.physicalProducts !== null &&
//                       product.physicalProducts.images !== null && (
//                         <Image
//                           src={
//                             product.physicalProducts.images[0] ||
//                             "/placeholder.svg"
//                           }
//                           alt={product.physicalProducts.name}
//                           width={300}
//                           height={150}
//                           className="h-full w-full object-cover object-center"
//                           quality={90}
//                         />
//                       )}
//                   </div>

//                   {/* Product details */}
//                   <div className="">
//                     <h3 className="mt-4 font-medium truncate">
//                       {product.physicalProducts &&
//                         ` ${product.physicalProducts.name}`}
//                     </h3>
//                     <p className="mt-2 font-medium">
//                       Quantity Bought: {product.quantity && product.quantity}
//                     </p>
//                     {product.price && (
//                       <p className="mt-2 font-medium">
//                         At Price: &#8358; {addCommasToNumber(product.price)}{" "}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             }

//             // Handle digital products
//             if (product.digitalProducts) {
//               return (
//                 <div
//                   className="gri sm:grid-cols-2 gap-4 text-sm w-full relative"
//                   key={product.digitalProducts.title}
//                 >
//                   {/* Product image */}
//                   <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
//                     {product.physicalProducts !== null &&
//                       product.digitalProducts.coverIMG !== null && (
//                         <Image
//                           src={
//                             product.digitalProducts.coverIMG[0] ||
//                             "/placeholder.svg"
//                           }
//                           alt={product.digitalProducts.title}
//                           width={300}
//                           height={150}
//                           className="h-full w-full object-cover object-center"
//                           quality={90}
//                         />
//                       )}
//                   </div>

//                   {/* Product details */}
//                   <div className="">
//                     <h3 className="mt-4 font-medium truncate">
//                       {product.digitalProducts &&
//                         ` ${product.digitalProducts.title}`}
//                     </h3>
//                     <p className="mt-2 font-medium">
//                       Quantity Bought: {product.quantity && product.quantity}
//                     </p>
//                     {product.price && (
//                       <p className="mt-2 font-medium">
//                         At Price: &#8358; {addCommasToNumber(product.price)}{" "}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             }
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;
