"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner"; 

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  imageUrl?: string;
};

type CartContextType = {
  cart: CartItem[];
  cartTotal: number;
  isCartOpen: boolean;             // NEW: Tracks if the sidebar is open
  openCart: () => void;            // NEW: Function to open sidebar
  closeCart: () => void;           // NEW: Function to close sidebar
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); 
  
  // NEW: Sidebar state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // 1. Load cart from local storage on load
  useEffect(() => {
    const savedCart = localStorage.getItem("raonic_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
    setIsLoaded(true); 
  }, []);

  // 2. Save cart to local storage ONLY after it has been loaded
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("raonic_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const cartTotal = cart.reduce((total, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 1;
    return total + (itemPrice * itemQty);
  }, 0);

  const addToCart = (product: CartItem) => {
    const safeQty = Number(product.quantity) || 1;
    const safePrice = Number(product.price) || 0;

    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item._id === product._id && item.color === product.color && item.size === product.size
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity = (Number(newCart[existingItemIndex].quantity) || 0) + safeQty;
        return newCart;
      }
      return [...prev, { ...product, quantity: safeQty, price: safePrice }];
    });
    
    toast.success(`${product.name} added to cart!`);
    openCart(); // NEW: Automatically open the slide-out cart when an item is added!
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    toast.error("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("raonic_cart");
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartTotal, 
      isCartOpen,    // Exported for the UI
      openCart,      // Exported for the UI
      closeCart,     // Exported for the UI
      addToCart, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}