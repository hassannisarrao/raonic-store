import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
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
            <Navbar />
            {children}
            <Toaster richColors position="bottom-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}