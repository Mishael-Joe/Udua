"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

let security = [
  {
    title: "Available Payout",
    desc: "Total available balance for payout",
    content: "0",
  },
  {
    title: "Funds withheld",
    desc: "Funds held for processing or disputes",
    content: "0",
  },
  {
    title: "Total Earnings",
    desc: "Your all time earnings on Udua",
    content: "0",
  },
];

export default function Payout({ params }: { params: { slug: string } }) {
  // console.log('params', params.slug)
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="w-full">
        <h1 className="text-2xl font-semibold pb-3">Balance Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {security.map((item, i) => (
            <>
              <Card key={i}>
                <CardHeader>
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>{item.title}</CardTitle>
                    <p>&#8358;</p>
                  </div>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    &#8358; {item.content}
                  </div>
                </CardContent>
              </Card>
            </>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Fulfilied Orders</CardTitle>
            <CardDescription>Sales available for payout</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            <Table>
              <TableCaption>A list of your available payout.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Amount Payable</TableHead>
                  <TableHead>More</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {orders!.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id}</TableCell>
                      <TableCell>
                        {order.products !== null &&
                          order.products.map((productOrder) => (
                            <div
                              key={
                                productOrder.product !== null
                                  ? productOrder.product._id
                                  : 1
                              }
                            >
                              {productOrder.product !== null
                                ? productOrder.product.productName
                                : "You've deleted this product."}
                            </div>
                          ))}
                      </TableCell>
                      <TableCell>
                        {order.products !== null &&
                          order.products.map((productOrder) => (
                            <div
                              key={
                                productOrder.product !== null
                                  ? productOrder.product._id
                                  : 1
                              }
                            >
                              {productOrder.quantity}
                            </div>
                          ))}
                      </TableCell>
                      <TableCell>
                        {order.products !== null &&
                          order.products.map((productOrder) => (
                            <div
                              key={
                                productOrder.product !== null
                                  ? productOrder.product._id
                                  : 1
                              }
                            >
                              &#8358;{addCommasToNumber(productOrder.price)}
                            </div>
                          ))}
                      </TableCell>
                      <TableCell className="text-right">
                        &#8358;{addCommasToNumber(order.totalAmount)}
                      </TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))} */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
