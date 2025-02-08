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
import { shoeSizes } from "@/constant/constant";
import { useState } from "react";

export function FootWearSizeGuide() {
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
                <DialogTitle>Men's Footwear Size Conversion Chart</DialogTitle>
              </DialogHeader>
              <ShoeSizeGuide />
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
              Men's Footwear Size Conversion Chart
            </DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-auto">
            <ShoeSizeGuide />
          </div>
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

export function ShoeSizeGuide() {
  return (
    <div className="space-y-6">
      <Table>
        <TableCaption>Men's Footwear Size Conversion Chart</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>EUR</TableHead>
            <TableHead>US Type</TableHead>
            <TableHead>US</TableHead>
            <TableHead>UK</TableHead>
            <TableHead>China</TableHead>
            <TableHead>Foot Length (cm)</TableHead>
            <TableHead>Foot Length Range (cm)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shoeSizes.map((size) => (
            <TableRow key={size.eur}>
              <TableCell>{size.eur}</TableCell>
              <TableCell>{size.usType}</TableCell>
              <TableCell>{size.us}</TableCell>
              <TableCell>{size.uk}</TableCell>
              <TableCell>{size.china}</TableCell>
              <TableCell>{size.footLength}</TableCell>
              <TableCell>{size.footLengthRange}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="px-4 py-5">
        <h2 className="pb-5">HOW TO MEASURE</h2>
        <p>
          To measure your feet stand on a level floor with the back of your
          heels against a straight edge or wall
        </p>

        <h3 className="py-3">1. FOOT LENGTH</h3>
        <p>
          Measure your foot length by placing a ruler flat on the floor straight
          alongside the inside of your foot from your heel to your toes. Place
          an object with a flat edge straight across your toes with the edge
          touching the tip of your longest toe. Take the measurement (in
          millimeters) from the ruler where the flat edge crosses.
        </p>

        <h3 className="py-3">2. SELECTING A SHOE SIZE</h3>
        <p>
          If your foot measurement is halfway between sizes, select the larger
          size. You may find one foot is longer than the other - this is quite
          normal. Please use the larger size when making your shoe size
          selection.
        </p>
      </div>
    </div>
  );
}
