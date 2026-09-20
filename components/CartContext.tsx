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
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void; // NEW: Quantity update function
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); 
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

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
    openCart(); 
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    toast.error("Item removed from cart");
  };

  // NEW: Function to increase or decrease item quantity
  const updateQuantity = (index: number, quantity: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index].quantity = quantity;
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("raonic_cart");
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartTotal, 
      isCartOpen,
      openCart,
      closeCart,
      addToCart, 
      removeFromCart, 
      updateQuantity, // Exporting new function
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