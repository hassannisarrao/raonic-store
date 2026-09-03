"use client";

import { useState } from "react";
import Link from "next/link";

export default function TrackOrderPage() {
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/track/${encodeURIComponent(trackingId.trim())}`);
      
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setError("We couldn't find an order with this tracking code. Please check and try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepState = (status: string, targetStep: string) => {
    const steps = ["Pending", "Processing", "Shipped", "Delivered", "Completed"];
    const currentIndex = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;
    const targetIndex = steps.indexOf(targetStep);

    if (targetIndex < currentIndex) return "complete";
    if (targetIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-black selection:text-white pt-36 pb-32 relative overflow-hidden">
      
      {/* Soft Luxury Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-200/50 via-indigo-100/30 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-bold tracking-wider uppercase text-slate-600 mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Package Tracking
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900">
            Where is your order?
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto font-medium">
            Type your tracking code below to instantly see live status and delivery details.
          </p>
        </div>

        {/* Stunning Floating Search Card */}
        <div className="bg-white p-3 md:p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-200/80 mb-12 relative">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                required
                placeholder="e.g. RNC-841890"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl pl-14 pr-6 py-4 md:py-4 text-sm md:text-base font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-8 py-4 md:py-4 rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-slate-800 transition-all shadow-lg disabled:bg-slate-300 flex items-center justify-center min-w-[170px] cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Track Order"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-2xl text-center">
              {error}
            </div>
          )}
        </div>

        {/* Ultra-Clean International Result Card */}
        {order && (
          <div className="bg-white rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.08)] border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Top Bar Header */}
            <div className="bg-gradient-to-r from-slate-900 to-black text-white px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Tracking Number</p>
                <p className="font-mono text-xl font-black tracking-wider text-white">{order.orderId}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  {order.status || "Pending"}
                </span>
              </div>
            </div>

            {/* Clean Modern Progress Timeline */}
            <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50/60">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Delivery Progress</p>
              
              <div className="grid grid-cols-3 gap-4 relative">
                <div className="absolute top-5 left-[15%] right-[15%] h-1 bg-slate-200 z-0 rounded-full"></div>

                {[
                  { title: "Confirmed", label: "Order Placed" },
                  { title: "Dispatched", label: "On the way" },
                  { title: "Delivered", label: "Completed" }
                ].map((step, idx) => {
                  const state = getStepState(order.status, idx === 0 ? "Pending" : idx === 1 ? "Shipped" : "Delivered");
                  const isDone = state === "complete" || state === "current";

                  return (
                    <div key={idx} className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs mb-3 transition-all duration-500 shadow-md ${
                        isDone 
                          ? "bg-black text-white scale-110 shadow-xl ring-4 ring-black/5" 
                          : "bg-white text-slate-400 border border-slate-200"
                      }`}>
                        {isDone ? (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span className={`text-xs font-bold ${isDone ? "text-slate-900" : "text-slate-400"}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Items Details Box */}
            <div className="p-8 md:p-10 space-y-8">
              
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Deliver To</p>
                  {/* FIX: Correctly maps to fullName from DB */}
                  <p className="text-sm font-bold text-slate-900">{order.customerInfo?.fullName || "Valued Customer"}</p>
                  {/* FIX: Correctly maps to address AND city from DB */}
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {order.customerInfo?.address 
                      ? `${order.customerInfo.address}, ${order.customerInfo.city || ""}` 
                      : "Shipping Address Provided"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Amount</p>
                  <p className="text-xl font-black text-emerald-600">Rs. {order.totalAmount || order.total || "0"}</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Cash on Delivery / Paid</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Ordered Items</p>
                <div className="space-y-3">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 text-sm shadow-sm hover:border-slate-300 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono text-xs font-bold text-slate-800 shrink-0">
                          {item.quantity || 1}x
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.name || item.title || "Product"}</p>
                          {/* FIX: Dynamic rendering for variants if they exist */}
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {item.color && `Color: ${item.color} `}
                            {item.size && `${item.color ? '| ' : ''}Size: ${item.size} `}
                            {!item.color && !item.size && "Raonic Genuine Article"}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shrink-0">
                        Confirmed
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}