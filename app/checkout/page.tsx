"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  // Form State - ADDED EMAIL
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-10">
        <h1 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Your Cart is Empty</h1>
        <Link href="/" className="bg-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          Return to Store
        </Link>
      </main>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // FIX APPLIED: Pointing to the correct API route based on your folder structure
      const res = await fetch("/api/orders/my-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo: formData,
          items: cart,
          totalAmount: cartTotal,
        }),
      });

      if (res.ok) {
        const responseData = await res.json(); 
        localStorage.removeItem("raonic_cart");
        
        // FIX APPLIED: Safely extracting the orderId from our new API response structure
        const finalOrderId = responseData.order?.orderId || responseData.orderId;
        window.location.href = `/success?orderId=${finalOrderId}`; 
      } else {
        alert("Failed to place order. Please check your details and try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong with the network. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 pt-28 md:p-10 md:pt-32 font-sans selection:bg-black selection:text-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-12">
        
        {/* Left Side: Shipping Form */}
        <div className="w-full lg:w-2/3 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200/80">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 tracking-tight">Shipping Details</h2>
          
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all" placeholder="e.g. Ahsan Khan" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all" placeholder="03XX-XXXXXXX" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address <span className="font-normal text-slate-400 capitalize tracking-normal">(Optional)</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all" placeholder="your@email.com" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Street Address</label>
              <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all" placeholder="House/Shop #, Street, Area" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">City</label>
              <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all" placeholder="e.g. Multan" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black text-white font-black text-sm uppercase tracking-widest py-4.5 rounded-xl hover:bg-slate-800 hover:-translate-y-1 transition-all disabled:bg-slate-300 disabled:text-slate-500 disabled:transform-none mt-8 shadow-xl hover:shadow-2xl flex justify-center items-center gap-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                "Place Order (COD)"
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-1/3 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/80 h-fit sticky top-28">
          <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 tracking-tight">Order Summary</h2>
          
          <div className="space-y-5 mb-6 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {item.color && `Color: ${item.color} | `} {item.size && `Size: ${item.size}`}
                  </p>
                  <p className="text-xs font-bold text-slate-700 mt-1">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-black text-black">Rs. {item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="font-bold text-slate-900">Rs. {cartTotal}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Shipping</span>
              <span className="font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px]">Free</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-2">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-black tracking-tight">Rs. {cartTotal}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}