import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteNavSession } from "@/components/site-nav-session";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Template Static",
  description:
    "Next.js template with Supabase authentication, RLS-backed data, and a calculator reference UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteNavSession />
        <div className="flex min-h-full flex-1 flex-col">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
