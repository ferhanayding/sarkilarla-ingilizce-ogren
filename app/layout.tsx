import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "./components/topbar";
import AuthProvider from "./context/auth/auth-provider";
import { supabaseServerComponent } from "@/lib/supabase/server";
import { themeStyle } from "@/ui/theme/config";
import SwrProvider from "./providers/swr-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Şarkılarla İngilizce Öğren",
  description:
    "İngilizce şarkılarla İngilizce öğren, okunuş ve anlamlarıyla birlikte.",
  icons: {
    icon: "/logom-light.png",
    apple: "/logom-light.png",
  },
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
  return (
    <html lang="en">
      <body
        style={themeStyle}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
