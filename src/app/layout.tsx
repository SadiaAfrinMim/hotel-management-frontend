import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/store/providers/ReduxProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
  title: "StayFinder - Find Your Perfect Stay",
  description: "Discover amazing hotels at the best prices. Your next unforgettable journey starts here.",
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
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <ReduxProvider>
          <ThemeProvider>
            <ToastProvider>
              <Navbar />
              {children}
              <Footer />
            </ToastProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
