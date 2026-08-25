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
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Your Cart is Empty</h1>
        <Link href="/" className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
          Return to Store
        </Link>
      </main>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/admin/orders", {
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
        window.location.href = `/success?orderId=${responseData.orderId}`; 
      } else {
        alert("Failed to place order. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    // FIX APPLIED HERE: Adjusted padding for mobile (p-4) and added top padding (pt-28 md:pt-32) to clear the navbar
    <main className="min-h-screen bg-gray-50 p-4 pt-28 md:p-10 md:pt-32">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Shipping Form */}
        <div className="w-full lg:w-2/3 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Details</h2>
          
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="e.g. Ahsan Khan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="03XX-XXXXXXX" />
              </div>
            </div>

            {/* NEW EMAIL FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address (Optional)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="your@email.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="House/Shop #, Street, Area" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="e.g. Multan" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold text-xl p-4 rounded-xl hover:bg-green-700 transition-colors disabled:bg-gray-400 mt-8 shadow-md">
              {loading ? "Processing..." : "Place Order (COD)"}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-1/3 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-800">{item.name}</h3>
                  <p className="text-xs text-gray-500">
                    {item.color && `Color: ${item.color} | `} {item.size && `Size: ${item.size}`}
                  </p>
                  <p className="text-xs font-medium text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-green-600">Rs. {item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-bold">Rs. {cartTotal}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Shipping</span>
              <span className="font-bold text-green-600">Free</span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-gray-900">Rs. {cartTotal}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}