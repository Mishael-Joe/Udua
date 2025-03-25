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
  userName: string;
  params: { slug: string };
};

const menuItems = (slug: string) => [
  { title: "Home", url: `/store/${slug}/my-store`, icon: Home },
  { title: "Orders", url: `/store/${slug}/dash-board`, icon: FileBoxIcon },
  { title: "Payout", url: `/store/${slug}/payout`, icon: WalletIcon },
  //   { title: "Security", url: `/store/${slug}/security`, icon: ShieldAlertIcon },
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
    url: `/store/${slug}/dash-board`,
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

export function AppSidebar({ userName, params }: SidebarProps) {
  const router = useRouter();
  const signOut = async () => {
    try {
      const response = await axios.get("/api/auth/admin-sign-out");
      if (response.status === 200) {
        router.push(`/admin/dashboard`);
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
        <SidebarMenuGroup label="My Dashboard" items={menu} className="pt-16" />
        <SidebarMenuGroup
          label="Inventory"
          items={inventory}
          className="-mt-5"
        />
        <SidebarMenuGroup
          label="Store Config"
          items={config}
          className="-mt-5"
        />
      </SidebarContent>
      <SidebarFooter className="">
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

// "use client";

// import {
//   Home,
//   User2,
//   ChevronUp,
//   ChevronDown,
//   FileBoxIcon,
//   Package,
//   HandshakeIcon,
//   WalletIcon,
//   ShieldAlertIcon,
//   Truck,
//   PlusCircle,
//   Banknote,
// } from "lucide-react";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Link from "next/link";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// type SlideBarProps = {
//   userName: string;
//   params: { slug: string };
// };

// export function AppSidebar({ userName, params }: SlideBarProps) {
//   // Menu items.
//   const items = [
//     {
//       title: "Home",
//       url: `/store/${params.slug}/my-store`,
//       icon: Home,
//     },
//     {
//       title: "Orders",
//       url: `/store/${params.slug}/dash-board`,
//       icon: FileBoxIcon,
//     },

//     {
//       title: "Payout",
//       url: `/store/${params.slug}/payout`,
//       icon: WalletIcon,
//     },

//     {
//       title: "Security",
//       url: `/store/${params.slug}/security`,
//       icon: ShieldAlertIcon,
//     },
//     // {
//     //   title: "Manage Admins",
//     //   url: `/store/${params.slug}/my-store`,
//     //   icon: Users,
//     // },
//     // {
//     //   title: "Update password",
//     //   url: `/store/${params.slug}/my-store`,
//     //   icon: ShieldCheckIcon,
//     // },
//     // {
//     //   title: "Deals",
//     //   url: `/store/${params.slug}/deals`,
//     //   icon: HandshakeIcon,
//     // },
//     // {
//     //   title: "Dispute & Resolution",
//     //   url: `/store/${params.slug}/my-store`,
//     //   icon: FileEdit,
//     // },
//   ];

//   const inventoryItems = [
//     {
//       title: "Inventory",
//       url: `/store/${params.slug}/inventory`,
//       icon: Package,
//     },
//     {
//       title: "Add New Product",
//       url: `/store/${params.slug}/upload-product`,
//       icon: PlusCircle,
//     },
//   ];

//   const configItems = [
//     {
//       title: "Manage Payout",
//       url: `/store/${params.slug}/add-payout-accout`,
//       icon: Banknote,
//     },
//     {
//       title: "Manage Shipping Methods",
//       url: `/store/${params.slug}/dash-board`,
//       icon: Truck,
//     },
//     {
//       title: "Update Password",
//       url: `/store/${params.slug}/store-password-reset`,
//       icon: ShieldAlertIcon,
//     },
//   ];

//   const router = useRouter();
//   const signOut = async () => {
//     try {
//       const response = await axios.get("/api/auth/admin-sign-out");
//       if (response.status === 200) {
//         router.push(`/admin/dashboard`);
//       }
//       // console.log(`response`, response);

//       // return response;
//     } catch (error) {
//       return error;
//     }
//   };
//   return (
//     <Sidebar variant="sidebar" collapsible="icon" className="">
//       <SidebarContent>
//         <SidebarGroup className="pt-16">
//           <SidebarGroupLabel>My Dashboard</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {items.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <Link href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup className="">
//           <SidebarGroupLabel>Inventory</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {inventoryItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <Link href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarGroup>
//           <SidebarGroupLabel>Store Config</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {configItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <Link href={item.url}>
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter className="">
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuButton>
//                   <User2 /> {userName}
//                   <ChevronUp className="ml-auto" />
//                 </SidebarMenuButton>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 side="top"
//                 className="w-[--radix-popper-anchor-width]"
//               >
//                 <DropdownMenuItem onClick={signOut} className="cursor-pointer">
//                   <span>Sign out</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }
