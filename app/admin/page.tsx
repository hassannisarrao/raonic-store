"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation"; 

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

interface ProductOption {
  name: string;
  values: string[];
  inputValue: string;
}

interface VariantMatrixRow {
  id: string;
  title: string;
  price: string;
  inventory: string;
  color?: string;
  size?: string;
  imageFile: File | null;
  imagePreview: string | null;
}

export default function AdminDashboardPage() {
  const router = useRouter(); 
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false); 
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  // Product Fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState(""); 
  
  // Media & Options
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [matrix, setMatrix] = useState<VariantMatrixRow[]>([]);

  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Start writing your product description or paste video embed codes here...',
    height: 400,
    toolbarAdaptive: false,
    enableDragAndDropFileToEditor: true,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_as_html' as const,
    buttons: [
      'paragraph', '|', 
      'bold', 'italic', 'underline', 'font', 'fontsize', 'brush', '|',
      'align', '|', 
      'ul', 'ol', '|',
      'image', 'video', 'table', 'link', '|',
      'undo', 'redo', 'eraser'
    ],
    uploader: { insertImageAsBase64URI: true },
    resizer: { showSize: true }, 
  }), []);

  // Fetch Dashboard Data & Products
  const fetchData = async () => {
    try {
      const [statsRes, productsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/products")
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (productsRes.ok) {
        const prodData = await productsRes.json();
        setProducts(Array.isArray(prodData) ? prodData : prodData.products || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- SECURE LOGOUT HANDLER ---
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // --- DELETE PRODUCT HANDLER ---
  const handleDeleteProduct = async (productId: string, productName: string) => {
    const confirmDelete = window.confirm(`Are you absolutely sure you want to delete "${productName}"? This cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete the product. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while trying to delete.");
    }
  };

  // --- GALLERY HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);
      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // --- MATRIX ENGINE ---
  useEffect(() => {
    const validOptions = options.filter(opt => opt.name.trim() !== "" && opt.values.length > 0);
    if (validOptions.length === 0) {
      if (!editProductId) setMatrix([]);
      return;
    }

    const arrays = validOptions.map(opt => opt.values);
    const combinations = arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]] as any[]);

    const newMatrix = combinations.map(combo => {
      const comboArray = Array.isArray(combo) ? combo : [combo];
      const title = comboArray.join(" / ");
      
      const rowObj: any = {
        id: Math.random().toString(36).substring(7),
        title,
        price: price, 
        inventory: "999", 
        imageFile: null,
        imagePreview: null
      };

      validOptions.forEach((opt, optIdx) => {
        const nameLower = opt.name.toLowerCase();
        const val = comboArray[optIdx];
        if (nameLower.includes("color")) {
          rowObj.color = val;
        } else if (nameLower.includes("size")) {
          rowObj.size = val;
        }
      });

      const existingRow = matrix.find(m => m.title === title);
      return existingRow || rowObj;
    });

    setMatrix(newMatrix);
  }, [options, price, editProductId]);

  const addOption = () => setOptions([...options, { name: "", values: [], inputValue: "" }]);
  const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index));
  const handleOptionNameChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index].name = val;
    setOptions(updated);
  };
  const handleOptionInput = (index: number, val: string) => {
    const updated = [...options];
    updated[index].inputValue = val;
    setOptions(updated);
  };
  const handleAddOptionValue = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const updated = [...options];
      const val = updated[index].inputValue.trim();
      if (val && !updated[index].values.includes(val)) updated[index].values.push(val);
      updated[index].inputValue = ""; 
      setOptions(updated);
    }
  };
  const removeOptionValue = (optIndex: number, valIndex: number) => {
    const updated = [...options];
    updated[optIndex].values = updated[optIndex].values.filter((_, i) => i !== valIndex);
    setOptions(updated);
  };
  const updateMatrixRow = (index: number, field: keyof VariantMatrixRow, value: any) => {
    const updated = [...matrix];
    updated[index] = { ...updated[index], [field]: value };
    setMatrix(updated);
  };
  const handleMatrixImage = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      const updated = [...matrix];
      updated[index].imageFile = file;
      updated[index].imagePreview = preview;
      setMatrix(updated);
    }
  };

  // --- OPEN MODAL FOR EDITING ---
  const handleEditClick = (product: any) => {
    setIsManageModalOpen(false); 
    
    setEditProductId(product._id || product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setCompareAtPrice(product.compareAtPrice ? product.compareAtPrice.toString() : "");
    setCategory(product.category);
    setDescription(product.description);
    
    setImageFiles([]);
    
    if (product.images && product.images.length > 0) {
      setImagePreviews(product.images);
    } else if (product.imageUrl) {
      setImagePreviews([product.imageUrl]);
    } else {
      setImagePreviews([]);
    }

    setOptions(product.options || []);
    setMatrix(product.variants || []);
    
    setIsAddModalOpen(true); 
  };

  // --- RESET FORM ---
  const resetForm = () => {
    setEditProductId(null);
    setName(""); setPrice(""); setCompareAtPrice(""); setCategory("");
    setDescription(""); setImageFiles([]); setImagePreviews([]);
    setOptions([]); setMatrix([]);
  };

  // --- HIGH-SPEED DIRECT UPLOAD SUBMIT HANDLER ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Missing Cloudinary Cloud Name in your environment variables.");

      const uploadedMainUrls: string[] = [];
      for (const file of imageFiles) {
        const cloudData = new FormData();
        cloudData.append("file", file);
        cloudData.append("upload_preset", "raonic_preset");

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: cloudData,
        });
        const data = await uploadRes.json();
        if (data.secure_url) uploadedMainUrls.push(data.secure_url);
      }

      const existingUrls = imagePreviews.filter(p => p.startsWith('http'));
      const finalImageUrls = [...existingUrls, ...uploadedMainUrls];

      const matrixData = [];
      for (const row of matrix) {
        let rowImageUrl = row.imagePreview;
        if (row.imageFile) {
          const cloudData = new FormData();
          cloudData.append("file", row.imageFile);
          cloudData.append("upload_preset", "raonic_preset");
          const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: cloudData,
          });
          const data = await uploadRes.json();
          if (data.secure_url) rowImageUrl = data.secure_url;
        }
        matrixData.push({
          id: row.id,
          title: row.title,
          price: row.price,
          inventory: row.inventory,
          color: row.color, 
          size: row.size,   
          imageUrl: rowImageUrl
        });
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      if (compareAtPrice) formData.append("compareAtPrice", compareAtPrice);
      formData.append("category", category);
      formData.append("description", description);
      
      formData.append("options", JSON.stringify(options.map(o => ({ name: o.name, values: o.values }))));
      formData.append("directImageUrls", JSON.stringify(finalImageUrls));
      formData.append("matrix", JSON.stringify(matrixData));

      const method = editProductId ? "PUT" : "POST";
      const endpoint = editProductId ? `/api/products/${editProductId}` : "/api/products";

      const res = await fetch(endpoint, { method, body: formData });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      setFormSuccess(editProductId ? "Product updated successfully!" : "Product added successfully!");
      fetchData(); 
      
      setTimeout(() => { 
        setIsAddModalOpen(false); 
        setFormSuccess(""); 
        resetForm();
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // MAINTAINED: pt-20 md:pt-24 to keep it safely below your fixed navbar
    <div className="flex flex-col lg:flex-row h-screen pt-20 md:pt-24 bg-[#fafafa] overflow-hidden font-sans selection:bg-black selection:text-white">
      
      <style dangerouslySetInnerHTML={{__html: `
        .jodit-wysiwyg img { display: inline-block !important; margin: 0.5rem; }
        .jodit-container { border-radius: 12px !important; border-color: #eaeaea !important; }
      `}} />

      {/* ========================================== */}
      {/* ENTERPRISE SIDEBAR                         */}
      {/* ========================================== */}
      <aside className="w-full lg:w-[280px] bg-white/70 backdrop-blur-xl border-b lg:border-r border-gray-200/60 flex flex-col h-auto lg:h-full z-10 shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 lg:p-8 flex items-center justify-between lg:justify-start">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
              <span className="bg-black text-white w-7 h-7 rounded-md flex items-center justify-center text-sm font-black shadow-sm">R</span>
              Raonic<span className="text-black">.</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-[0.2em]">Command Center</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 lg:py-4 space-y-8 flex flex-row lg:flex-col gap-6 lg:gap-0 overflow-x-auto lg:overflow-x-visible">
          
          <div className="shrink-0 lg:shrink">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 px-3 hidden lg:block">Workspace</p>
            <div className="space-y-1.5 flex lg:block gap-2">
              <button 
                onClick={() => { resetForm(); setIsAddModalOpen(true); }} 
                className="w-full bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 hover:shadow-md transition-all flex items-center gap-3 shrink-0"
              >
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create Listing
              </button>

              <button 
                onClick={() => setIsManageModalOpen(true)} 
                className="w-full bg-white text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors border border-gray-200/60 shadow-sm flex items-center gap-3 shrink-0"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                Manage Inventory
              </button>
            </div>
          </div>

          <div className="shrink-0 lg:shrink">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 px-3 hidden lg:block">Operations</p>
            <div className="space-y-1 flex lg:block gap-1.5">
              <Link href="/admin/orders" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100/50 hover:text-gray-900 transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Orders
              </Link>
              <Link href="/admin/bulk-edit" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100/50 hover:text-gray-900 transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Bulk Editor
              </Link>
              <Link href="/track" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100/50 hover:text-gray-900 transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Tracker
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 hidden lg:block space-y-2">
          <Link href="/" className="w-full px-4 py-2.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 transition-colors flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Live Storefront
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full px-4 py-2.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            End Session
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* MAIN CONTENT AREA                          */}
      {/* ========================================== */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-12 max-w-6xl mx-auto space-y-10">
          
          {/* Top Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">System Overview</h2>
              <p className="text-gray-500 text-sm mt-1">Live metrics and global performance.</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-gray-200/60 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Connected</span>
            </div>
          </header>

          {/* Premium Minimalist KPI Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse h-32" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              
              <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow group">
                <p className="text-xs font-semibold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  GROSS REVENUE
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-black transition-colors">
                  <span className="text-lg text-gray-400 font-medium mr-1">Rs.</span>
                  {stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow group">
                <p className="text-xs font-semibold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  TOTAL ORDERS
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-black transition-colors">{stats?.totalOrders ?? 0}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow group">
                <p className="text-xs font-semibold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ACTION REQUIRED
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-amber-500 transition-colors">{stats?.pendingOrders ?? 0}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow group">
                <p className="text-xs font-semibold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  FULFILLED
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-emerald-500 transition-colors">{stats?.completedOrders ?? 0}</p>
              </div>

            </div>
          )}

          {/* Enterprise Action Block */}
          <div className="bg-[#0A0A0A] rounded-2xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800/40 via-transparent to-transparent pointer-events-none"></div>
            <div className="relative z-10 max-w-xl">
              <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">Scale your inventory.</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Deploy new product listings instantly to the live storefront. Manage variants, configure pricing, and maintain absolute control over your digital catalog.
              </p>
            </div>
            <button 
              onClick={() => { resetForm(); setIsAddModalOpen(true); }} 
              className="relative z-10 bg-white text-black px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg shrink-0 flex items-center gap-2"
            >
              Initialize Listing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>

        </div>
      </main>

      {/* ========================================== */}
      {/* MANAGE PRODUCTS MODAL (ENTERPRISE)         */}
      {/* ========================================== */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 shrink-0 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Inventory Management</h2>
                <p className="text-sm text-gray-500 mt-1">Modify configurations or permanently remove listings.</p>
              </div>
              <button onClick={() => setIsManageModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto p-8 flex-1">
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-600 w-20">Media</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">Listing Identifier</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">Classification</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">Base Value</th>
                      <th className="px-6 py-4 font-semibold text-gray-600 text-right">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.length > 0 ? (
                      products.map((prod) => (
                        <tr key={prod._id || prod.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                              {prod.imageUrl ? (
                                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">N/A</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">{prod.name}</td>
                          <td className="px-6 py-4">
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-medium">{prod.category || "General"}</span>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">Rs. {prod.price}</td>
                          <td className="px-6 py-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditClick(prod)} 
                              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              Configure
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(prod._id || prod.id, prod.name)} 
                              className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded hover:bg-red-100 transition-colors"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-gray-500">No active listings discovered in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* ADD / EDIT PRODUCT MODAL (ENTERPRISE)      */}
      {/* ========================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-gray-50 w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                  {editProductId ? "Configuration: Edit Listing" : "Initialization: New Listing"}
                </h2>
              </div>
              <button onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-gray-900 transition-colors p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-8 space-y-6 overflow-y-auto flex-1">
              {formError && <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">{formError}</div>}
              {formSuccess && <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-lg font-medium">{formSuccess}</div>}

              {/* Basic Info */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Listing Identifier (Title)</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Base Value (Rs.)</label>
                    <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Retail Value (Compare)</label>
                    <input type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Classification</label>
                    <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Rich Text Editor */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Rich Description Block</label>
                <div className="rounded-xl overflow-hidden shadow-sm">
                  <JoditEditor value={description} config={editorConfig} onBlur={newContent => setDescription(newContent)} />
                </div>
              </div>

              {/* Media Gallery */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Media Assets</label>
                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative bg-gray-50/50">
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-sm font-medium text-gray-600">Drag files here or click to browse</span>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 mt-4">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group shadow-sm">
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white/90 text-red-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variant Engine */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">Variant Engine</h3>
                    <p className="text-xs text-gray-500 mt-1">Configure multi-attribute structures (e.g., Size, Color).</p>
                  </div>
                  <button type="button" onClick={addOption} className="text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded transition-colors flex items-center gap-1 shadow-sm">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Parameter
                  </button>
                </div>
                
                <div className="space-y-4 mb-8">
                  {options.map((opt, optIndex) => (
                    <div key={optIndex} className="p-5 border border-gray-200 rounded-lg bg-gray-50 relative">
                      <button type="button" onClick={() => removeOption(optIndex)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      
                      <div className="mb-4 w-3/4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Parameter Key</label>
                        <input type="text" placeholder="e.g. Color" value={opt.name} onChange={(e) => handleOptionNameChange(optIndex, e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-colors shadow-sm" />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Attributes (Press Enter)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {opt.values.map((val, valIndex) => (
                            <div key={valIndex} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded text-xs font-medium px-2 py-1 shadow-sm text-gray-700">
                              <span>{val}</span>
                              <button type="button" onClick={() => removeOptionValue(optIndex, valIndex)} className="text-gray-400 hover:text-red-500">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <input type="text" placeholder="e.g. Midnight Black (Press Enter)" value={opt.inputValue} onChange={(e) => handleOptionInput(optIndex, e.target.value)} onKeyDown={(e) => handleAddOptionValue(optIndex, e)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-colors shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>

                {matrix.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Generated Matrix</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                          <tr>
                            <th className="p-3 font-semibold w-16">Media</th>
                            <th className="p-3 font-semibold">SKU / Variant</th>
                            <th className="p-3 font-semibold">Assigned Value</th>
                            <th className="p-3 font-semibold w-24">Stock</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {matrix.map((row, i) => (
                            <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-3">
                                <div className="w-8 h-8 rounded border border-gray-200 bg-gray-50 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                                  {row.imagePreview ? <img src={row.imagePreview} alt="var" className="w-full h-full object-cover" /> : <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                                  <input type="file" accept="image/*" onChange={(e) => handleMatrixImage(i, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                              </td>
                              <td className="p-3 font-medium text-gray-900">{row.title}</td>
                              <td className="p-3"><input type="number" value={row.price} onChange={(e) => updateMatrixRow(i, "price", e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-black outline-none transition-colors" /></td>
                              <td className="p-3"><input type="number" value={row.inventory} onChange={(e) => updateMatrixRow(i, "inventory", e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-black outline-none transition-colors" /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </form>
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 shrink-0">
              <button type="button" onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Abort</button>
              <button type="submit" onClick={handleSaveProduct} disabled={submitting} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 disabled:bg-gray-400 transition-colors shadow-md flex items-center gap-2">
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : (
                  editProductId ? "Deploy Changes" : "Commit Listing"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}