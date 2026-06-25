import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { DeferredCookieBanner } from "@/components/consent/DeferredCookieBanner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SITE } from "@/lib/site/config";
import { createHomeMetadata } from "@/lib/utils/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...createHomeMetadata(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans`}>
        <ConsentProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <DeferredCookieBanner />
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
        </ConsentProvider>
      </body>
    </html>
  );
}
