import type { Metadata } from "next";
import "../../../globals.css";

import { siteConfig } from "@/config/site";
import { SiteBlob } from "@/components/site-blob";

import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import jwt from "jsonwebtoken";
import StoreAside from "./component/store-aside";
import { StoreHeader } from "./component/store-header";

import { Montserrat } from "next/font/google";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { AppSidebar } from "./component/app-sidebar";

const montserrat = Montserrat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const storeName = cookieStore.get("storeToken")?.value || "User";
  const params = await props.params;

  // Verify and decode the token
  const decoded = jwt.verify(storeName, process.env.JWT_SECRET_KEY!) as {
    id: string;
    storeName: string;
    storeEmail: string;
  };

  const { children } = props;

  return (
    <html lang="en">
      <body className={`${montserrat.className} scroll-smooth`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <StoreHeader params={params} />
          <SiteBlob />
          <Toaster />
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar storeName={decoded.storeName} params={params} />
            <SidebarInset>
              <main className="relative">
                <SidebarTrigger className=" fixed top-16" />
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
