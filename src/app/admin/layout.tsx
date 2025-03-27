import type { Metadata } from "next";
import "../globals.css";
import { siteConfig } from "@/config/site";
import { SiteBlob } from "@/components/site-blob";
import { ThemeProvider } from "@/components/theme-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { StateContext } from "@/context/stateContext";

import { Montserrat } from "next/font/google";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { cookies } from "next/headers";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const userName = cookieStore.get("userName")?.value || "User";
  // console.log("cookieStore", cookieStore);
  return (
    <html lang="en">
      <body className={`${montserrat.className} scroll-smooth`}>
        <StateContext>
          <ThemeProvider attribute="class" defaultTheme="light">
            <SiteBlob />
            <Toaster />
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar userName={userName} />
              <SidebarInset>
                <main className="relative">
                  <SidebarTrigger className=" fixed top-2" />
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
            <TailwindIndicator />
          </ThemeProvider>
        </StateContext>
      </body>
    </html>
  );
}
