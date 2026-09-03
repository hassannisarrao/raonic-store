"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Core product state (100% Untouched)
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // === NEW: Dynamic Variants Engine (100% Untouched) ===
  const [variants, setVariants] = useState([{ color: "", size: "", stock: 0 }]);

  const addVariantRow = () => {
    setVariants([...variants, { color: "", size: "", stock: 0 }]);
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };
  // ====================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description);
      if (image) formData.append("image", image);

      // Package up the variants into a format the server can read
      formData.append("variants", JSON.stringify(variants));

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 pt-28 md:pt-32 font-sans selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Add New Product</h1>
          <Link href="/admin" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-colors bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
            ← Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Info Card */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200/80">
            <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight border-b border-slate-100 pb-4">Basic Information</h2>
            
            {/* FIX: Mobile responsive grid (grid-cols-1 md:grid-cols-2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Product Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all" placeholder="e.g. Pro Wireless Earbuds" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Base Price (Rs.)</label>
                <input type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all" placeholder="e.g. 1499" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
                <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all" placeholder="e.g. Audio" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Product Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white p-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white p-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all h-32 resize-none" placeholder="Write a catchy description..."></textarea>
            </div>
          </div>

          {/* === NEW VARIANTS SECTION === */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Inventory & Variants</h2>
              <button type="button" onClick={addVariantRow} className="bg-slate-100 text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition-colors shadow-sm self-start md:self-auto border border-slate-200">
                + Add Variant
              </button>
            </div>
            
            <div className="space-y-4">
              {variants.map((variant, index) => (
                /* FIX: Mobile responsive flex-col stacking */
                <div key={index} className="flex flex-col md:flex-row md:items-end gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 group">
                  <div className="w-full md:flex-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Color <span className="font-normal capitalize">(Optional)</span></label>
                    <input type="text" value={variant.color} onChange={(e) => updateVariant(index, "color", e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none" placeholder="e.g. Matte Black" />
                  </div>
                  <div className="w-full md:flex-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Size <span className="font-normal capitalize">(Optional)</span></label>
                    <input type="text" value={variant.size} onChange={(e) => updateVariant(index, "size", e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black outline-none" placeholder="e.g. Medium" />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-black mb-1.5">Stock Qty *</label>
                    <input type="number" required min="0" value={variant.stock} onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-black text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  
                  {variants.length > 1 && (
                    <div className="w-full md:w-auto flex justify-end md:justify-center md:pb-1">
                      <button type="button" onClick={() => removeVariant(index)} className="text-rose-500 hover:text-white bg-rose-50 hover:bg-rose-500 font-bold p-3 rounded-xl transition-colors border border-rose-100 flex items-center gap-2 text-xs uppercase tracking-wider">
                        <span className="md:hidden">Remove Variant</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* ============================ */}

          <button type="submit" disabled={loading} className="w-full bg-black text-white font-black text-sm uppercase tracking-widest py-4.5 rounded-xl hover:bg-slate-800 hover:-translate-y-1 transition-all disabled:bg-slate-300 disabled:text-slate-500 disabled:transform-none shadow-xl hover:shadow-2xl flex justify-center items-center gap-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Inventory...
              </>
            ) : (
              "Save Product to Store"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}