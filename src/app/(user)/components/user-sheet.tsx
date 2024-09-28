import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Aside1 from "./aside-1";

function UserSheets() {
  return (
    <Fragment>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Aside1 />
          </nav>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default UserSheets;
