"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();

  if (cart.length === 0) {
    return (
      // Added pt-32 md:pt-40 to prevent header overlap
      <main className="min-h-screen flex flex-col items-center justify-center pt-32 pb-10 px-4 md:pt-40 md:pb-16 md:px-10 bg-[#F8FAFC]">
        <div className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center">
          <h1 className="text-2xl md:text-3xl font-black mb-4 text-slate-900 uppercase tracking-widest">Your Bag is Empty</h1>
          <p className="text-slate-500 text-sm mb-6">Discover our latest premium collection.</p>
          <Link href="/" className="bg-black text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors shadow-lg">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    // Added pt-32 md:pt-40 to push content below the fixed header
    <main className="min-h-screen bg-[#F8FAFC] pt-32 pb-12 px-4 md:pt-40 md:pb-20 md:px-10 font-sans selection:bg-black selection:text-white">
      
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Shopping Bag</h1>
          <span className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
        
        <div className="space-y-6 mb-8">
          {cart.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-50 pb-6 gap-4 md:gap-0">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                {/* Clickable Image going back to Product Detail */}
                <Link href={`/products/${item._id}`} className="shrink-0">
                  <div className="w-24 h-32 md:w-28 md:h-36 bg-[#f4f4f4] rounded-lg overflow-hidden border border-slate-100 hover:border-slate-300 transition-colors">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase tracking-widest p-1 text-center">No Image</div>
                    )}
                  </div>
                </Link>
                
                <div className="flex-1">
                  {/* Clickable Title */}
                  <Link href={`/products/${item._id}`}>
                    <h2 className="font-bold text-base md:text-lg text-slate-900 line-clamp-2 hover:text-slate-600 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.name}
                    </h2>
                  </Link>
                  <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-medium">
                    {item.color && <span className="mr-3">Color: <span className="text-slate-900">{item.color}</span></span>}
                    {item.size && <span>Size: <span className="text-slate-900">{item.size}</span></span>}
                  </p>
                  
                  {/* Interactive Premium Quantity Selector */}
                  <div className="flex items-center mt-3 bg-white border border-slate-200 rounded-lg w-max overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 hover:text-black transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="px-4 text-xs font-bold text-slate-900 min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 hover:text-black transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-6 pt-3 md:pt-0">
                <p className="font-bold text-slate-900 text-lg md:text-xl">Rs. {item.price * item.quantity}</p>
                
                {/* Premium Sleek Remove Button */}
                <button 
                  onClick={() => removeFromCart(index)} 
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 underline underline-offset-4 transition-colors shrink-0"
                >
                  Remove
                </button>
              </div>
              
            </div>
          ))}
        </div>

        <div className="flex flex-col items-end pt-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Subtotal</p>
          <p className="text-3xl md:text-4xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight">Rs. {cartTotal}</p>
          <Link 
            href="/checkout" 
            className="w-full md:w-auto text-center bg-black text-white px-10 md:px-14 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors shadow-lg"
          >
            Proceed to Checkout
          </Link>
          <p className="text-[9px] text-slate-400 font-medium mt-4 uppercase tracking-widest flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Secure 256-bit Checkout
          </p>
        </div>
      </div>
    </main>
  );
}