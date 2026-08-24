"use client";

import { useState } from "react";
import Link from "next/link";

export default function MyOrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleFetchOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/my-orders?phone=${encodeURIComponent(phone.trim())}`);
      if (!res.ok) {
        throw new Error("Failed to fetch orders. Please try again.");
      }
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <Link href="/" className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest inline-block mb-2 transition-colors">
            ← Back to Storefront
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order History</h1>
          <p className="text-gray-500 text-sm">Enter the phone number you used at checkout to view your past orders and live tracking status.</p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200">
          <form onSubmit={handleFetchOrders} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number</label>
              <input 
                type="tel" 
                required
                placeholder="e.g. 03001234567" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-400 shadow-sm h-[50px]"
              >
                {loading ? "Searching..." : "Find My Orders"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl text-center">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {hasSearched && !loading && orders.length === 0 && !error && (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 font-medium">We couldn't find any orders linked to this phone number.</p>
            <p className="text-sm text-gray-400 mt-1">Please double-check the number you entered.</p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 px-2">Your Orders ({orders.length})</h2>
            
            {orders.map((order: any) => (
              <div key={order._id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6 transition-all hover:shadow-md">
                
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Order ID (Tracking Number)</span>
                    <p className="text-sm font-mono font-bold text-gray-800 mt-0.5">{order._id}</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Date Placed</span>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Status Banner */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  order.status === "Shipped" ? "bg-blue-50 border-blue-100" :
                  order.status === "Completed" ? "bg-emerald-50 border-emerald-100" :
                  "bg-amber-50 border-amber-100"
                }`}>
                  <span className="text-sm font-bold text-gray-900">Current Status:</span>
                  <span className={`inline-block px-4 py-1.5 font-bold text-xs rounded-lg uppercase tracking-wide ${
                    order.status === "Shipped" ? "bg-blue-600 text-white" :
                    order.status === "Completed" ? "bg-emerald-600 text-white" :
                    "bg-amber-500 text-white"
                  }`}>
                    {order.status || "Pending"}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Products Ordered</span>
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                      <div>
                        <span className="font-bold text-gray-900 block">{item.name}</span>
                        {(item.color || item.size) && (
                          <span className="text-xs text-gray-500 mt-1 block">
                            {item.color && `Color: ${item.color} `} 
                            {item.size && `Size: ${item.size}`}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-700 block text-xs mb-1">Qty: {item.quantity}</span>
                        <span className="font-bold text-gray-900 block">Rs. {item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer / Total */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-5">
                  <span className="text-sm font-bold text-gray-900">Order Total</span>
                  <span className="text-2xl font-black text-emerald-600">Rs. {order.totalAmount}</span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}