"use client";

import { useCart } from "@/components/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

export default function SidebarCart() {
  const { cart, cartTotal, isCartOpen, closeCart, removeFromCart } = useCart();

  // Prevent background scrolling on mobile when the cart is open
  useEffect(() => {
    if (isCartOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isCartOpen]);

  const FREE_SHIPPING_THRESHOLD = 5000;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountLeft = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Blurred Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
          />

          {/* Slide-Out Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[100] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm md:text-base font-black uppercase tracking-widest text-slate-900">Your Cart</h2>
              <button onClick={closeCart} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="p-5 md:p-6 bg-slate-50 border-b border-slate-100">
              <p className="text-[10px] md:text-xs font-bold text-slate-600 mb-3">
                {amountLeft > 0 
                  ? `You are Rs. ${amountLeft} away from Free Shipping!` 
                  : "🎉 You unlocked Free Shipping!"}
              </p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-black h-full"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 hide-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <p className="text-sm font-bold text-slate-900">Your cart is empty.</p>
                  <button onClick={closeCart} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-400 pb-0.5 hover:text-black hover:border-black transition-colors">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {cart.map((item, index) => (
                    <div key={`${item._id}-${index}`} className="flex gap-4 items-center bg-white">
                      <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {item.color && `Color: ${item.color}`} {item.size && `| Size: ${item.size}`}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs font-black">Rs. {item.price}</p>
                          <div className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Checkout Action */}
            {cart.length > 0 && (
              <div className="p-5 md:p-6 border-t border-slate-100 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Subtotal</p>
                  <p className="text-lg font-black text-black">Rs. {cartTotal}</p>
                </div>
                <Link href="/checkout" onClick={closeCart} className="w-full bg-black text-white py-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}