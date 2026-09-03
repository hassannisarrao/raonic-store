import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor"; // 1. Imported Custom Cursor
import { Toaster } from "sonner";
import AuthProvider from "@/components/AuthProvider"; // NEW: Authentication Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raonic | Premium Store",
  description: "Redefining premium wireless audio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {/* 2. Added the Cursor component globally */}
            <CustomCursor /> 
            <Navbar />
            {children}
            <Toaster richColors position="bottom-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}