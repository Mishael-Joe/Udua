"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        <ul>
          <li>mishael</li>
          <li>mishael</li>
          <li>mishael</li>
          <li>mishael</li>
          <li>mishael</li>
          <li>mishael</li>
          <li>mishael</li>
          <li>mishael</li>
          <li>mishael</li>
          <li>mishael</li>
        </ul>
      </div>
    </section>
  );
}

export default LeftSidebar;
