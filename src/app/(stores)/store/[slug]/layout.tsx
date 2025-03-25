import type { Metadata } from "next";
import "../../../globals.css";

import { siteConfig } from "@/config/site";
import { SiteBlob } from "@/components/site-blob";

import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";

import { SiteFooter } from "@/components/site-footer";
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
  const userName = cookieStore.get("userName")?.value || "User";
  const params = await props.params;

  const { children } = props;

  return (
    <html lang="en">
      <body className={`${montserrat.className} scroll-smooth`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <StoreHeader params={params} />
          <SiteBlob />
          <Toaster />
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar userName={userName} params={params} />
            <SidebarInset>
              <main className="relative">
                <SidebarTrigger className=" fixed top-16" />
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          {/* <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/10 md:block">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <StoreAside params={params} />
              </div>
            </div>
            {children}
          </div> */}
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
