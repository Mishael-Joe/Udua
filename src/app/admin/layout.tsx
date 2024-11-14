import type { Metadata } from "next";
import "../globals.css";
import { siteConfig } from "@/config/site";
import { SiteBlob } from "@/components/site-blob";
import { ThemeProvider } from "@/components/theme-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";
import { StateContext } from "@/context/stateContext";
import { AdminHeader } from "./components/admin-header";

import AdminAside from "./components/admin-aside";
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
            <AdminHeader />
            <SiteBlob />
            <Toaster />
            <main className="grid min-h-screen mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] px-5 md:px-4 gap-4 max-w-7xl">
              <div className="hidden border-r bg-muted/10 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                  <AdminAside />
                </div>
              </div>
              {children}
            </main>
            <SiteFooter />
            <TailwindIndicator />
          </ThemeProvider>
        </StateContext>
      </body>
    </html>
  );
}
