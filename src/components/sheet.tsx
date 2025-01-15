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
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ResponsiveLeftSidebar />
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default Sheets;
