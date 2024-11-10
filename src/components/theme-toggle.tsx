"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
    >
      <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
