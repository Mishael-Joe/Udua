import {
  CheckCheckIcon,
  FileEdit,
  Settings2Icon,
  ShieldCheckIcon,
  ShoppingCart,
  StoreIcon,
  Users,
  XIcon,
  Home,
  User2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
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

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Create Store",
    url: "/admin/create-store",
    icon: StoreIcon,
  },
  {
    title: "Verify Product",
    url: "/admin/verify-products",
    icon: CheckCheckIcon,
  },
  {
    title: "Unverify Product",
    url: "/admin/unverify-product",
    icon: XIcon,
  },
  // {
  //   title: "Order details",
  //   url: "/admin/order-details",
  //   icon: ShoppingCart,
  // },
  // {
  //   title: "Dispute & Resolution",
  //   url: "/admin/dispute-resolution",
  //   icon: FileEdit,
  // },
  {
    title: "Finance and Settlement",
    url: "/admin/settlement",
    icon: Settings2Icon,
  },
  {
    title: "Manage Admins",
    url: "/admin/manage-admins",
    icon: Users,
  },
  {
    title: "Update password",
    url: "/admin/password",
    icon: ShieldCheckIcon,
  },
];

export function AppSidebar({ userName }: { userName: string }) {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="mt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
      </SidebarContent>
      <SidebarFooter className="mb-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {userName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
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
