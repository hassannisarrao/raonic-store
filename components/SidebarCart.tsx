"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { useEffect } from "react";

export default function SidebarCart() {
  const { cart, cartTotal, isCartOpen, closeCart, removeFromCart } = useCart();

  // Prevent scrolling on the main page when the cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Dark Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-all duration-300 ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeCart}
      />

      {/* Slide-out Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Your Cart</h2>
          <button 
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <p className="text-gray-500 font-medium">Your cart is currently empty.</p>
              <button onClick={closeCart} className="text-black font-bold border-b-2 border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex gap-4 items-start group">
                {/* Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0 relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] uppercase font-bold tracking-wider text-gray-300">No Img</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</h3>
                  
                  <div className="text-xs text-gray-500 mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    {item.color && <span>Color: <strong className="text-gray-700">{item.color}</strong></span>}
                    {item.size && <span>Size: <strong className="text-gray-700">{item.size}</strong></span>}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-black text-gray-900">
                      Rs. {item.price} <span className="text-xs text-gray-400 font-medium ml-1">x {item.quantity}</span>
                    </span>
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
              <span className="text-2xl font-black text-black">Rs. {cartTotal}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6 font-medium">Shipping & taxes calculated at checkout.</p>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center bg-black text-white py-4 rounded-xl font-black tracking-widest uppercase text-sm hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}