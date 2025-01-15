"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t bg-udua-deep-gray-primary text-slate-100">
      <div className="mx-auto max-w-7xl overflow-hidden px-3 py-12 sm:py-14 lg:px-8 flex flex-col gap-6 items-center">
        <nav
          className="columns-2 sm:flex sm:justify-center sm:space-x-12 text-center"
          aria-label="Footer"
        >
          {siteConfig.footer.map((item) => (
            <div key={item.name} className="pb-6">
              <Link
                href={item.href}
                className="text-sm leading-6 dark:hover:bg-transparent dark:hover:text-udua-orange-primary hover:bg-transparent hover:text-udua-orange-primary delay-75 transition-all ease-in-out"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>

        <section>
          <p className=" font-semibold">PAYMENT METHODS</p>

          <div className="pt-3 flex gap-3 justify-center">
            {siteConfig.paymentmethods.map((method) => (
              <Image
                src={method.img}
                height={50}
                width={50}
                alt={method.img}
                key={method.img}
              />
            ))}
          </div>
        </section>

        <Link
          href="https://mishael-joe.vercel.app"
          className=" block text-center text-xs leading-5"
        >
          &copy; {new Date().getFullYear()} {siteConfig.name} LLC. All rights
          reserved.
        </Link>
      </div>
    </footer>
  );
}
