import type { Metadata } from "next";
import "../globals.css";

import { siteConfig } from "@/config/site";
import { SellerSiteHeader } from "@/components/sellOnAlfaComponents/seller-site-header";
import { SiteBlob } from "@/components/site-blob";

import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";

import { StateContext } from "@/context/stateContext";

import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`scroll-smooth`}>
        <StateContext>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SellerSiteHeader />
            <SiteBlob />
            <Toaster />
            <div>{children}</div>
            <SiteFooter />
            <TailwindIndicator />
          </ThemeProvider>
        </StateContext>
      </body>
    </html>
  );
}
