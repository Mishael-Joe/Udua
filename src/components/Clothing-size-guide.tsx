import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@react-hook/media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
import { sizes } from "@/constant/constant";
import { useState } from "react";

export function ClothingSizeGuide() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <p className=" text-xs hover:underline">Size Guide</p>
        </DialogTrigger>
        <ScrollArea>
          <DialogContent className="sm:max-w-6xl h-full">
            <div className="overflow-auto">
              <DialogHeader>
                <DialogTitle>Size Guide for Clothing</DialogTitle>
              </DialogHeader>
              <SizeTable />
            </div>
          </DialogContent>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <p className=" text-xs hover:underline">Size Guide</p>
      </DrawerTrigger>

      <ScrollArea>
        <DrawerContent className="h-[90%]">
          <DialogHeader>
            <DialogTitle className="py-6 px-3">
              Size Guide for Clothing
            </DialogTitle>
          </DialogHeader>
          <SizeTable />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Drawer>
  );
}

export function SizeTable() {
  return (
    <Table>
      <TableCaption>Size Guide for Clothing</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Size</TableHead>
          <TableHead>US</TableHead>
          <TableHead>UK</TableHead>
          <TableHead>EUR</TableHead>
          <TableHead>China (Height/cm)</TableHead>
          <TableHead>Chest (cm)</TableHead>
          <TableHead>Waist (cm)</TableHead>
          <TableHead>Hips (cm)</TableHead>
          <TableHead>Leg Length (cm)</TableHead>
          <TableHead>Neck (cm)</TableHead>
          <TableHead>Sleeve Length (cm)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sizes.map((size) => (
          <TableRow key={size.size}>
            <TableCell className="font-medium">{size.size}</TableCell>
            <TableCell>{size.us}</TableCell>
            <TableCell>{size.uk}</TableCell>
            <TableCell>{size.eur}</TableCell>
            <TableCell>{size.china}</TableCell>
            <TableCell>{size.chest}</TableCell>
            <TableCell>{size.waist}</TableCell>
            <TableCell>{size.hips}</TableCell>
            <TableCell>{size.legLength}</TableCell>
            <TableCell>{size.neck}</TableCell>
            <TableCell>{size.sleeveLength}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
