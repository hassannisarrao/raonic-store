"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Core product state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // === NEW: Dynamic Variants Engine ===
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
    <div className="p-10 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <Link href="/admin" className="text-gray-500 hover:text-black font-medium">
          ← Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Card */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="e.g. Pro Wireless Earbuds" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (Rs.)</label>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="e.g. 1499" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="e.g. Audio" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full border p-2 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-3 rounded-lg h-32" placeholder="Write a catchy description..."></textarea>
          </div>
        </div>

        {/* === NEW VARIANTS SECTION === */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Inventory & Variants</h2>
            <button type="button" onClick={addVariantRow} className="bg-gray-100 text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
              + Add Variant
            </button>
          </div>
          
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Color (Optional)</label>
                  <input type="text" value={variant.color} onChange={(e) => updateVariant(index, "color", e.target.value)} className="w-full border p-2 rounded-md text-sm" placeholder="e.g. Matte Black" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Size (Optional)</label>
                  <input type="text" value={variant.size} onChange={(e) => updateVariant(index, "size", e.target.value)} className="w-full border p-2 rounded-md text-sm" placeholder="e.g. Medium" />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stock Qty *</label>
                  <input type="number" required min="0" value={variant.stock} onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)} className="w-full border p-2 rounded-md text-sm font-bold text-blue-600" />
                </div>
                {variants.length > 1 && (
                  <div className="pt-5 flex items-center justify-center">
                    <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700 font-bold px-3 py-2 bg-red-50 rounded-lg">✕</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* ============================ */}

        <button type="submit" disabled={loading} className="w-full bg-black text-white font-bold text-lg p-4 rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-400">
          {loading ? "Saving Product..." : "Save Product to Store"}
        </button>
      </form>
    </div>
  );
}