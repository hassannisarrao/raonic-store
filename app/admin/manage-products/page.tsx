"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ManageProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?page=1&limit=100"); 
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${productName}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setProducts(products.filter(product => product._id !== productId));
      } else {
        alert("Failed to delete the product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while trying to delete.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Manage Products</h1>
            <p className="text-sm text-gray-500 mt-1">View and delete your active catalog.</p>
          </div>
          <Link href="/admin" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
            ← Back to Admin
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-5 font-bold w-24">Image</th>
                <th className="p-5 font-bold">Product Details</th>
                <th className="p-5 font-bold">Category</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase">No Img</div>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="font-bold text-gray-900 text-lg">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xs">{product.description}</p>
                  </td>
                  <td className="p-5">
                    <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider">
                      {product.category || "General"}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}