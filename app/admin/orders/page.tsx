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

  // NEW: The "Cancelled" button now catches both Admin and Customer cancellations
  const filteredOrders = filter === "All" 
    ? orders 
    : filter === "Cancelled"
      ? orders.filter(order => order.status?.includes("Cancel"))
      : orders.filter(order => order.status === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10 pt-32">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
            View Storefront →
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Completed", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === status 
                  ? "bg-black text-white shadow-md" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-5 font-bold">Order ID</th>
                  <th className="p-5 font-bold">Customer Details</th>
                  <th className="p-5 font-bold">Items Ordered</th>
                  <th className="p-5 font-bold">Total</th>
                  <th className="p-5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 align-top">
                      <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg text-sm">{order.orderId}</span>
                    </td>
                    <td className="p-5 align-top">
                      <p className="font-bold text-gray-900">{order.customerInfo?.fullName}</p>
                      <p className="text-sm text-gray-500 mt-1">{order.customerInfo?.phone}</p>
                      {order.customerInfo?.email && (
                        <p className="text-sm text-blue-600 mt-0.5 font-medium">{order.customerInfo.email}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1 max-w-[200px] leading-relaxed">
                        {order.customerInfo?.address}, {order.customerInfo?.city}
                      </p>
                    </td>
                    <td className="p-5 align-top">
                      <div className="max-h-24 overflow-y-auto pr-2 space-y-1">
                        {order.items?.map((item: any, idx: number) => (
                          <p key={idx} className="text-sm text-gray-700">
                            <span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="p-5 font-black text-green-600 text-lg align-top">
                      Rs. {order.totalAmount}
                    </td>
                    <td className="p-5 align-top">
                      {/* NEW: Dropdown handles Admin and Customer cancellations */}
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-sm font-bold p-3 rounded-xl border-2 outline-none cursor-pointer transition-all w-full max-w-[180px] ${
                          order.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          order.status === "Processing" ? "bg-purple-50 text-purple-700 border-purple-200" :
                          order.status === "Shipped" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          order.status === "Delivered" ? "bg-teal-50 text-teal-700 border-teal-200" :
                          order.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" :
                          order.status?.includes("Cancel") ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-gray-50 text-gray-700 border-gray-200"
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
                    <td colSpan={5} className="p-10 text-center text-gray-500 font-medium">
                      No orders found for this status filter.
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