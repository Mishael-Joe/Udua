import type { Metadata } from "next";
import "../globals.css";
import { siteConfig } from "@/config/site";
import { SiteBlob } from "@/components/site-blob";
import { ThemeProvider } from "@/components/theme-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";
import { StateContext } from "@/context/stateContext";
import { AuthHeader } from "./component/authHeader";

import { Rubik } from 'next/font/google'
 
const rubik = Rubik({
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
      <body className={`${rubik.className} scroll-smooth`}>
        <StateContext>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* <AuthHeader /> */}
            <SiteBlob />
            <Toaster />
            <div>{children}</div>
            {/* <SiteFooter /> */}
            <TailwindIndicator />
          </ThemeProvider>
        </StateContext>
      </body>
    </html>
  );
}
