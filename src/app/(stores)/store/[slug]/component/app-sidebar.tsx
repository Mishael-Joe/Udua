"use client";

import {
  Home,
  User2,
  ChevronUp,
  FileBoxIcon,
  Package,
  WalletIcon,
  ShieldAlertIcon,
  Truck,
  PlusCircle,
  Banknote,
  NotebookText,
  Store,
  Handshake,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type SidebarProps = {
  storeName: string;
  params: { slug: string };
};

const menuItems = (slug: string) => [
  { title: "Home", url: `/store/${slug}/my-store`, icon: Home },
  { title: "Orders", url: `/store/${slug}/dash-board`, icon: FileBoxIcon },
  { title: "Payout", url: `/store/${slug}/payout`, icon: WalletIcon },
  // { title: "Deals", url: `/store/${slug}/deals`, icon: Handshake },
];

const inventoryItems = (slug: string) => [
  { title: "Inventory", url: `/store/${slug}/inventory`, icon: Package },
  {
    title: "Add New Product",
    url: `/store/${slug}/upload-product`,
    icon: PlusCircle,
  },
];

const configItems = (slug: string) => [
  {
    title: "Manage Payout",
    url: `/store/${slug}/add-payout-account`,
    icon: Banknote,
  },
  {
    title: "Payout Policy",
    url: `/store/${slug}/payout-policy`,
    icon: NotebookText,
  },
  {
    title: "Manage Shipping Methods",
    url: `/store/${slug}/shipping-methods`,
    icon: Truck,
  },
  {
    title: "Update Password",
    url: `/store/${slug}/store-password-reset`,
    icon: ShieldAlertIcon,
  },
];

function SidebarMenuGroup({
  label,
  items,
  className,
}: {
  label: string;
  items: any[];
  className?: string;
}) {
  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar({ storeName, params }: SidebarProps) {
  const router = useRouter();
  const signOut = async () => {
    try {
      const response = await axios.get("/api/auth/store-sign-out");
      if (response.status === 200) {
        router.push(`/login`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const menu = useMemo(() => menuItems(params.slug), [params.slug]);
  const inventory = useMemo(() => inventoryItems(params.slug), [params.slug]);
  const config = useMemo(() => configItems(params.slug), [params.slug]);

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="">
      <SidebarContent>
        <SidebarMenuGroup
          label="My Dashboard"
          items={menu}
          className="md:pt-16 z-20"
        />
        <SidebarMenuGroup
          label="Inventory"
          items={inventory}
          className="-mt-5"
        />
        <SidebarMenuGroup
          label="Store Config"
          items={config}
          className="-mt-1.5 py-0 px-2"
        />
      </SidebarContent>
      <SidebarFooter className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Store /> {storeName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-(--radix-popper-anchor-width)"
              >
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
