import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SellerAside from "../component/seller-aside";
import { Badge } from "@/components/ui/badge";

export default function page() {
  return (
    <div className="grid min-h-screen max-w-6xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <SellerAside />
        </div>
      </div>
      <div className="flex flex-col py-5">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Recent orders from your store.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Type
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-accent">
                      <TableCell>
                        <div className="font-medium">Liam Johnson</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          liam@example.com
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        Sale
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="secondary">
                          Fulfilled
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        2023-06-23
                      </TableCell>
                      <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Olivia Smith</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          olivia@example.com
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        Refund
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="outline">
                          Declined
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        2023-06-24
                      </TableCell>
                      <TableCell className="text-right">$150.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Noah Williams</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          noah@example.com
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        Subscription
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="secondary">
                          Fulfilled
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        2023-06-25
                      </TableCell>
                      <TableCell className="text-right">$350.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
