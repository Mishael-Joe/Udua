import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  FileEdit,
  HelpCircleIcon,
  SettingsIcon,
  ShoppingCart,
  UserCheck2Icon,
} from "lucide-react";

function Aside() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [tab, setTab] = useState<string>(searchParams.get("tab") || "profile");

  const handleChange = (value: string) => {
    setTab(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("tab", value);
    } else {
      params.delete("tab");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="custom-scrollbar leftsidebar rounded-md">
      <h1 className="text-center pb-3.5 px-3 border-b font-semibold">
        My Account
      </h1>
      <div className="flex w-full flex-1 flex-col gap-3 px-3 relative">
        <ul className="flex flex-col gap-1">
          <li
            className={`show-dropdown-menu1 cursor-pointer ${
              tab === "profile"
                ? "bg-slate-600/30 text-slate-200"
                : "text-slate-200/50 hover:text-slate-200"
            } rounded py-2 px-3 mt-5`}
            onClick={() => handleChange("profile")}
          >
            <p className="flex items-center gap-2">
              <UserCheck2Icon className="" /> Profile
            </p>
          </li>

          <li
            onClick={() => handleChange("wishlist")}
            className={`show-dropdown-menu1 cursor-pointer ${
              tab === "wishlist"
                ? "bg-slate-600/30 text-slate-200"
                : "text-slate-200/50 hover:text-slate-200"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <FileEdit className="" /> Wishlist
            </p>
          </li>

          <li
            onClick={() => handleChange("order-history")}
            className={`show-dropdown-menu1 cursor-pointer ${
              tab === "order-history"
                ? "bg-slate-600/30 text-slate-200"
                : "text-slate-200/50 hover:text-slate-200"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <ShoppingCart className="" /> Order History
            </p>
          </li>

          <li
            onClick={() => handleChange("account-settings")}
            className={`show-dropdown-menu1 cursor-pointer ${
              tab === "account-settings"
                ? "bg-slate-600/30 text-slate-200"
                : "text-slate-200/50 hover:text-slate-200"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <SettingsIcon className="" /> Account Settings
            </p>
          </li>

          <li
            onClick={() => handleChange("supports")}
            className={`show-dropdown-menu1 cursor-pointer ${
              tab === "supports"
                ? "bg-slate-600/30 text-slate-200"
                : "text-slate-200/50 hover:text-slate-200"
            } rounded py-2 px-3`}
          >
            <p className="flex items-center gap-2">
              <HelpCircleIcon className="" /> Support and Help
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Aside;
