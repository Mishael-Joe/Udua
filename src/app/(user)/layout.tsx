import type { Metadata } from "next";
import "../globals.css";

import { siteConfig } from "@/config/site";
import { SiteBlob } from "@/components/site-blob";
import { SiteFooter } from "@/components/site-footer";

import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";

import { StateContext } from "@/context/stateContext";
import { UserHeader } from "./components/user-header";

import { Montserrat } from 'next/font/google'
 
const montserrat = Montserrat({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
})

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
      <body className={`${montserrat.className} scroll-smooth`}>
        <StateContext>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <UserHeader />
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
