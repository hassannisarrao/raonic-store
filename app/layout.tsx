import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import SidebarCart from "@/components/SidebarCart";
import { Toaster } from "sonner";

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
        <CartProvider>
          <Navbar />
          <SidebarCart />
          {children}
          {/* Sonner Toaster safely added below your content! */}
          <Toaster richColors position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}