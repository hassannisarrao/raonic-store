"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BulkEditPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Fetch all products when the page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle typing in the spreadsheet cells
  const handleInputChange = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setProducts(updatedProducts);
  };

  // Send all changes to the database at once
  const handleSaveAll = async () => {
    setSaving(true);
    setFeedback({ type: "", message: "" });
    try {
      const res = await fetch("/api/admin/bulk-edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: products }),
      });

      if (res.ok) {
        setFeedback({ type: "success", message: "All products successfully updated across the store!" });
      } else {
        setFeedback({ type: "error", message: "Failed to save updates. Please try again." });
      }
    } catch (error) {
      console.error("Bulk save error:", error);
      setFeedback({ type: "error", message: "Something went wrong with the server connection." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* ========================================== */}
      {/* PROFESSIONAL LEFT SIDEBAR                  */}
      {/* ========================================== */}
      <aside className="w-full lg:w-72 bg-white border-b lg:border-r border-gray-200 flex flex-col h-auto lg:h-full z-10 shadow-sm shrink-0">
        
        {/* Brand Logo Area */}
        <div className="p-6 lg:p-8 border-b border-gray-100 flex items-center justify-between lg:justify-start">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span className="bg-black text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg">R</span>
              Raonic<span className="text-blue-600">.</span>
            </h1>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">Command Center</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 flex flex-row lg:flex-col gap-4 lg:gap-0 overflow-x-auto lg:overflow-x-visible">
          
          <div className="shrink-0 lg:shrink">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 hidden lg:block">Primary Actions</p>
            <div className="space-y-2 flex lg:block gap-2">
              <Link 
                href="/admin" 
                className="w-full bg-white text-gray-700 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-3 shrink-0"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Dashboard Overview
              </Link>
            </div>
          </div>

          <div className="shrink-0 lg:shrink">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 hidden lg:block">Store Management</p>
            <div className="space-y-1 flex lg:block gap-2">
              <Link href="/admin/orders" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-black transition-colors shrink-0">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Orders Manager
              </Link>
              <Link href="/admin/bulk-edit" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold bg-black text-white rounded-xl shadow-sm shrink-0">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                Bulk Price Editor
              </Link>
              <Link href="/track" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-black transition-colors shrink-0">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Public Order Tracker
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6 border-t border-gray-100 hidden lg:block">
          <Link href="/" className="w-full bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            View Live Storefront
          </Link>
        </div>
      </aside>

      {/* ========================================== */}
      {/* MAIN SPREADSHEET CONTENT AREA              */}
      {/* ========================================== */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
          
          {/* Header & Save Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Bulk Price Editor</h1>
              <p className="text-gray-500 text-sm mt-0.5">Quickly modify titles, categories, and prices across your entire inventory spreadsheet.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="bg-white border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
              <button 
                onClick={handleSaveAll} 
                disabled={saving || loading}
                className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 shadow-sm"
              >
                {saving ? "Saving Changes..." : "Save All Changes"}
              </button>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback.message && (
            <div className={`p-4 rounded-xl text-sm font-medium border ${feedback.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {feedback.message}
            </div>
          )}

          {/* Spreadsheet Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-16 text-center text-gray-500 font-medium animate-pulse">Loading store inventory...</div>
            ) : products.length === 0 ? (
              <div className="p-16 text-center text-gray-500 font-medium">No products found in database.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-bold w-20 text-center">Image</th>
                      <th className="p-4 font-bold">Product Name</th>
                      <th className="p-4 font-bold w-64">Category</th>
                      <th className="p-4 font-bold w-48">Base Price (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product, index) => (
                      <tr key={product._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-4 text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mx-auto">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-gray-400 flex items-center justify-center h-full font-medium">No Img</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <input 
                            type="text" 
                            value={product.name} 
                            onChange={(e) => handleInputChange(index, "name", e.target.value)}
                            className="w-full bg-white border border-gray-300 p-2.5 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-black outline-none shadow-sm"
                          />
                        </td>
                        <td className="p-4">
                          <input 
                            type="text" 
                            value={product.category} 
                            onChange={(e) => handleInputChange(index, "category", e.target.value)}
                            className="w-full bg-white border border-gray-300 p-2.5 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-black outline-none shadow-sm"
                          />
                        </td>
                        <td className="p-4">
                          <input 
                            type="number" 
                            value={product.price} 
                            onChange={(e) => handleInputChange(index, "price", Number(e.target.value))}
                            className="w-full bg-white border border-gray-300 p-2.5 rounded-xl text-sm font-extrabold text-emerald-600 focus:ring-2 focus:ring-black outline-none shadow-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>

    </div>
  );
}