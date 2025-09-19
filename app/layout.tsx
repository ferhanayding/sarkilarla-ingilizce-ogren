import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "./components/topbar";
import AuthProvider from "./context/auth/auth-provider";
import { supabaseServerComponent } from "@/lib/supabase/server";
import { themeStyle } from "@/ui/theme/config";
import SwrProvider from "./providers/swr-provider";
import { Toaster } from "sonner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"
  ),
  title: {
    default: "Aylavyu",
    template: "%s • Sing & Learn with Lyrics ",
  },
  description: "Şarkı sözleriyle telaffuz ve çeviri – YouTube ile eşzamanlı.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "aylavyu",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await supabaseServerComponent();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const googleAdsClientId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID;
  return (
    <html lang="tr">
      <body
        style={themeStyle}
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {/* <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8176951447137413"
          crossOrigin="anonymous"
        /> */}
        {/* <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsClientId}`}
          crossOrigin="anonymous"
          ></Script> */}

        <AuthProvider initialUserEmail={user?.email}>
          <SwrProvider>
            <Topbar />

            {children}
            <Toaster richColors closeButton position="top-center" />
          </SwrProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
