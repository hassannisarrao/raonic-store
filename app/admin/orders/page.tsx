"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  // 100% UNTOUCHED LOGIC
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // 100% UNTOUCHED LOGIC
  const handleStatusChange = async (orderDbId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderDbId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setOrders(orders.map(order => 
          order._id === orderDbId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 100% UNTOUCHED LOGIC
  const filteredOrders = filter === "All" 
    ? orders 
    : filter === "Cancelled"
      ? orders.filter(order => order.status?.includes("Cancel"))
      : orders.filter(order => order.status === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 pt-32 font-sans selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Order Management</h1>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-colors bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
            <span>View Storefront</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Completed", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                filter === status 
                  ? "bg-black text-white shadow-xl scale-105" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-black hover:shadow-sm"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        {/* Luxury Data Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500">
                  <th className="p-6 font-black">Order ID</th>
                  <th className="p-6 font-black">Customer Details</th>
                  <th className="p-6 font-black">Items Ordered</th>
                  <th className="p-6 font-black">Total</th>
                  <th className="p-6 font-black text-center">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 align-top">
                      <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-lg text-xs tracking-wider inline-block group-hover:bg-white transition-colors">{order.orderId}</span>
                    </td>
                    <td className="p-6 align-top">
                      <p className="font-bold text-slate-900 text-sm">{order.customerInfo?.fullName}</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">{order.customerInfo?.phone}</p>
                      {order.customerInfo?.email && (
                        <p className="text-xs text-indigo-600 mt-0.5 font-bold tracking-wide">{order.customerInfo.email}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-2 max-w-[220px] leading-relaxed font-medium">
                        {order.customerInfo?.address}, {order.customerInfo?.city}
                      </p>
                    </td>
                    <td className="p-6 align-top">
                      <div className="max-h-28 overflow-y-auto pr-2 space-y-2 hide-scrollbar">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="font-black text-black bg-white px-2 py-0.5 rounded shadow-sm">{item.quantity}x</span>
                            <span className="font-medium mt-0.5">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-6 font-black text-black text-lg align-top tracking-tight">
                      Rs. {order.totalAmount}
                    </td>
                    <td className="p-6 align-top text-center">
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider p-3 rounded-xl border-2 outline-none cursor-pointer transition-all w-full max-w-[190px] shadow-sm hover:shadow-md ${
                          order.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300" :
                          order.status === "Processing" ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300" :
                          order.status === "Shipped" ? "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300" :
                          order.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300" :
                          order.status === "Completed" ? "bg-slate-900 text-white border-slate-900 hover:bg-black" :
                          order.status?.includes("Cancel") ? "bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300" :
                          "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled by Admin">Cancel (By Admin)</option>
                        {order.status === "Cancelled by Customer" && (
                          <option value="Cancelled by Customer">Cancelled by Customer</option>
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No orders found for this status.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}