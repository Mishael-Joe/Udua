import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Fragment } from "react";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import ResponsiveLeftSidebar from "./responsive-left-sidebar";

function Sheets() {
  return (
    <Fragment>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <ResponsiveLeftSidebar />
          </nav>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default Sheets;
