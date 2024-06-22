"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const FirstTimeVisitor: React.FC = () => {
  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState<boolean>(false);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    const isFirstTimeVisitorCookie = localStorage.getItem("first_time_visitor");
    if (isFirstTimeVisitorCookie === null) {
      localStorage.setItem("first_time_visitor", "true");
      setIsFirstTimeVisitor(true);
    }

    if (isFirstTimeVisitor) {
      const hidePrompt = localStorage.getItem("hide_first_time_visitor");
      if (!hidePrompt) {
        const timer = setTimeout(() => {
          setShowSignUpPrompt(true);
        }, 5000);

        // Clear the timer if the component unmounts
        return () => clearTimeout(timer);
      }
    }
  }, [isFirstTimeVisitor]);

  const handleClose = () => {
    setShowSignUpPrompt(false);
    localStorage.setItem("hide_first_time_visitor", "true");
  };

  if (showSignUpPrompt) {
    return (
      <Dialog open={showSignUpPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{siteConfig.name}</DialogTitle>
            <DialogDescription>
              We have recently updated our terms and conditions. By continuing
              to use this site, you are agreeing to the new terms. Please review
              the updated{" "}
              <span className="font-bold text-blue-600 underline">
                <Link href="/terms-conditions" className="text-blue-600 underline italic">
                  Terms and Conditions
                </Link>
              </span>{" "}
              to ensure you understand the changes.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-row gap-4">
            <Checkbox
              id="terms"
              onClick={() => setIsChecked(!isChecked)}
              checked={isChecked}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose onClick={handleClose} asChild>
              <Button type="button" variant="default" disabled={!isChecked}>
                Continue
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default FirstTimeVisitor;
