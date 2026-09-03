"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Infinite Scroll State[cite: 3]
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreNodeRef = useRef<HTMLDivElement | null>(null);

  // Search & Filter State[cite: 3]
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Wishlist State[cite: 3]
  const [wishlist, setWishlist] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Parallax Setup[cite: 3]
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 1000], [0, 300]);
  const bannerParallax = useTransform(scrollY, [0, 3000], [0, -150]);

  // Dynamic Color Swatch State[cite: 3]
  const [activeColors, setActiveColors] = useState<{ [key: string]: string }>({});

  // Dynamic Social Proof State (Live Viewers)
  const [viewers, setViewers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Auto-play restricted by browser policy:", error);
      });
    }
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleColorSelect = (productId: string, colorHex: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveColors(prev => ({ ...prev, [productId]: colorHex }));
  };

  const fetchProducts = async (pageNum: number, search: string, category: string, isReset: boolean) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(`/api/products?page=${pageNum}&limit=12&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
      if (res.ok) {
        const data = await res.json();
        
        if (isReset) {
          setProducts(data.products);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }
        
        setHasMore(data.hasMore);
        if (data.categories) setCategories(data.categories);

        // Generate dynamic live viewers for new products to build trust and urgency
        const newViewers: { [key: string]: number } = {};
        data.products.forEach((p: any) => {
          newViewers[p._id] = Math.floor(Math.random() * (45 - 12 + 1)) + 12; // Random number between 12 and 45
        });
        setViewers(prev => ({ ...prev, ...newViewers }));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      fetchProducts(1, searchQuery, selectedCategory, true);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, searchQuery, selectedCategory, false);
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (loadMoreNodeRef.current) observerRef.current.observe(loadMoreNodeRef.current);
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [page, loading, loadingMore, hasMore, searchQuery, selectedCategory]);

  // Mock Reviews Data for Wall of Love
  const verifiedReviews = [
    { name: "Ahmed K.", location: "Lahore", text: "Exceptional quality. The unboxing experience alone feels like a true luxury brand.", rating: 5 },
    { name: "Zainab R.", location: "Karachi", text: "Customer service is top tier. Received my order in 48 hours and it's perfect.", rating: 5 },
    { name: "Faisal T.", location: "Islamabad", text: "Worth every penny. The build quality on the executive collection is unmatched.", rating: 5 },
    { name: "Sara H.", location: "Multan", text: "Finally, an authentic premium tech brand in Pakistan. Highly recommended.", rating: 5 },
    { name: "Bilal M.", location: "Faisalabad", text: "The details are insane. From the stitching to the materials, 10/10.", rating: 5 },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900 selection:bg-black selection:text-white overflow-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; width: 200%; animation: ticker 25s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .animate-marquee { display: flex; animation: marquee 35s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}} />
      
      {/* 1. INTERNATIONAL LUXURY HERO SECTION */}
      <section className="relative text-white overflow-hidden min-h-[65vh] md:min-h-[80vh] flex flex-col justify-between bg-black pt-20 pb-12">
        <motion.div style={{ y: heroParallax }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <video 
            ref={videoRef} autoPlay loop muted playsInline preload="auto"
            className="w-full h-full object-cover opacity-70 scale-105 pointer-events-none"
          >
            <source src="/banner-video.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none"></div>

        <div className="relative z-10 w-full flex justify-center px-6 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] md:text-xs font-bold tracking-[0.25em] uppercase text-white shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            ⚡ 40% Sale on All Products
          </div>
        </div>

        <div className="relative z-10 w-full flex flex-col items-center text-center px-6 mt-4">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.4em] uppercase text-amber-100/80 drop-shadow-md">
            REDEFINING THE
          </span>
          <span className="text-sm sm:text-base md:text-lg font-black tracking-[0.25em] uppercase text-white mt-1 drop-shadow-lg">
            Luxurious Lifestyle
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
            <button onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })} className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg cursor-pointer">
              Shop Collection
            </button>
            <Link href="/products" className="w-full sm:w-auto text-center bg-black/30 hover:bg-white hover:text-black text-white border border-white/10 backdrop-blur-md px-8 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg">
              Explore Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TICKER */}
      <div className="bg-black text-white py-2.5 overflow-hidden border-y border-white/5 relative z-20">
        <div className="animate-ticker whitespace-nowrap flex items-center gap-12 text-[9px] md:text-[10px] font-bold tracking-[0.25em] uppercase text-slate-300">
          <span>FREE SHIPPING NATIONWIDE</span><span>•</span>
          <span>SECURE CASH ON DELIVERY</span><span>•</span>
          <span>100% AUTHENTIC RAONIC ARTICLES</span><span>•</span>
          <span>EXCLUSIVE LIMITED DROP</span><span>•</span>
          <span>FREE SHIPPING NATIONWIDE</span><span>•</span>
          <span>SECURE CASH ON DELIVERY</span><span>•</span>
          <span>100% AUTHENTIC RAONIC ARTICLES</span><span>•</span>
          <span>EXCLUSIVE LIMITED DROP</span>
        </div>
      </div>

      {/* 3. TRUST & RELIABILITY INTRO */}
      <section className="bg-white py-14 px-6 border-b border-slate-100 text-center relative z-20">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-500 mb-3 bg-indigo-50/50 px-3 py-1 rounded-full border border-indigo-50 flex items-center gap-1.5">
            <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Verified Global Brand
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-snug">
            Elevate Your Everyday Life.
          </h2>
          <div className="w-10 h-0.5 bg-black mb-4 rounded-full"></div>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-md font-medium">
            Join over 5,000+ satisfied customers. Designed for absolute excellence and delivered securely straight to your door.
          </p>
        </div>
      </section>

      {/* 4. ENHANCED SECURITY BADGES */}
      <section className="bg-slate-50 shadow-sm relative z-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-3 gap-2 md:gap-6 text-center divide-x divide-slate-200">
          <div className="flex flex-col items-center px-1">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-black mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Secure Checkout</h3>
            <p className="text-[8px] md:text-[9px] font-medium text-slate-500 mt-1 truncate max-w-full">256-bit SSL Encryption</p>
          </div>
          <div className="flex flex-col items-center px-1">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-black mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Quality Guarantee</h3>
            <p className="text-[8px] md:text-[9px] font-medium text-slate-500 mt-1 truncate max-w-full">100% Authentic Raonic</p>
          </div>
          <div className="flex flex-col items-center px-1">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-black mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636l3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">VIP Support</h3>
            <p className="text-[8px] md:text-[9px] font-medium text-slate-500 mt-1 truncate max-w-full">Premium Concierge</p>
          </div>
        </div>
      </section>

      {/* 5. MAIN STOREFRONT */}
      <div className="max-w-7xl mx-auto px-5 mt-10 md:mt-12 relative z-30">
        
        {/* Search & Category Filters */}
        <div className="flex flex-col gap-5 mb-10 bg-white p-4 md:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-40">
          <div className="w-full relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search products (e.g. 'Audio under 5000')" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full hide-scrollbar scroll-smooth">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory === category ? "bg-black text-white shadow-md" : "bg-transparent text-slate-500 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
                <div className="w-full aspect-square bg-slate-100"></div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/3 mt-1"></div>
                  <div className="h-8 bg-slate-50 rounded-lg mt-3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-2">No products found</h2>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} className="text-[10px] text-slate-500 border-b border-slate-300 pb-0.5 uppercase tracking-widest font-bold">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((product) => {
              const isWishlisted = wishlist.includes(product._id);
              const secondImage = product.images && product.images[1] ? product.images[1] : product.imageUrl;
              const activeColor = activeColors[product._id];
              const displayImage = activeColor === "#0f172a" && secondImage ? secondImage : product.imageUrl;
              const viewerCount = viewers[product._id] || 15;

              return (
                <div key={product._id} className="group flex flex-col bg-white rounded-xl md:rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative">
                  
                  {/* Dynamic Social Activity Badge */}
                  <div className="absolute top-2.5 left-2.5 z-20 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm border border-slate-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-800">{viewerCount} Viewing</span>
                  </div>

                  <button onClick={(e) => toggleWishlist(product._id, e)} className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                    <svg className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : "text-slate-400"}`} fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>

                  <Link href={`/products/${product.slug}`} className="block relative w-full aspect-square overflow-hidden bg-slate-50">
                    {displayImage ? (
                      <motion.img 
                        key={displayImage} initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                        src={displayImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">No Image</div>
                    )}
                  </Link>

                  <div className="p-3.5 flex flex-col flex-1 relative bg-white">
                    <Link href={`/products/${product.slug}`}>
                      <h2 className="text-[11px] md:text-xs font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-slate-500 transition-colors">{product.name}</h2>
                    </Link>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-sm md:text-base font-black text-black">Rs. {product.price}</p>
                      <div className="flex items-center gap-1.5">
                        <button onClick={(e) => handleColorSelect(product._id, "#ffffff", e)} className={`w-3.5 h-3.5 rounded-full bg-white border shadow-sm transition-all ${activeColor === "#ffffff" || !activeColor ? "border-slate-800 scale-110" : "border-slate-200 hover:scale-110"}`} />
                        <button onClick={(e) => handleColorSelect(product._id, "#0f172a", e)} className={`w-3.5 h-3.5 rounded-full bg-slate-900 border shadow-sm transition-all ${activeColor === "#0f172a" ? "border-slate-800 ring-1 ring-slate-300 scale-110" : "border-transparent hover:scale-110"}`} />
                      </div>
                    </div>
                    
                    {/* Security Badge Below Price */}
                    <div className="flex items-center gap-1 mt-1.5 opacity-70">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest">Secured Checkout</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-50 flex gap-1.5">
                      <Link href={`/products/${product.slug}`} className="flex-1 flex items-center justify-center bg-black text-white py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-sm">Details</Link>
                      <Link href={`/products/${product.slug}`} className="flex-1 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-900 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors border border-slate-100">+ Cart</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. VERIFIED BUYER WALL OF LOVE (New!) */}
        <div className="my-16 md:my-20 overflow-hidden relative">
          <div className="text-center mb-6">
            <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-[8px] font-black tracking-[0.2em] uppercase mb-2 inline-flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Verified Buyers
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">Loved by Thousands</h2>
          </div>
          
          <div className="flex gap-4 animate-marquee hover:animation-paused">
            {[...verifiedReviews, ...verifiedReviews].map((review, idx) => (
              <div key={idx} className="flex-shrink-0 w-64 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex text-amber-400 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed italic mb-4">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">{review.name.charAt(0)}</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900">{review.name}</p>
                    <p className="text-[8px] text-slate-500 font-medium">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-12 md:w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-12 md:w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent pointer-events-none"></div>
        </div>

        {/* 7. INTERACTIVE TRENDING PROMOTIONAL BANNER */}
        <motion.div style={{ y: bannerParallax }} className="my-20 bg-slate-950 rounded-2xl p-6 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 w-full text-center md:text-left">
            <span className="bg-white/10 text-cyan-300 border border-white/10 px-3 py-1 rounded-full text-[8px] font-black tracking-[0.2em] uppercase mb-4 inline-block">
              🔥 Trending Spotlight
            </span>
            <h2 className="text-2xl md:text-4xl font-black mb-2 tracking-tight">The Executive Collection</h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-5 max-w-sm mx-auto md:mx-0">
              Engineered for uncompromising quality and timeless aesthetic. Discover our highest-rated seasonal articles.
            </p>
            <Link href="/products" className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-lg">
              Shop Trending Drop
            </Link>
          </div>
          <div className="relative z-10 w-full md:w-auto text-center bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">Limited Availability</p>
            <p className="text-2xl font-black text-white font-mono tracking-widest drop-shadow-md">48 : 00 : 00</p>
            <p className="text-[9px] text-slate-500 mt-1.5">Exclusive promotional window</p>
          </div>
        </motion.div>

        {/* Infinite Scroll Sensor */}
        {hasMore && !loading && (
          <div ref={loadMoreNodeRef} className="h-24 w-full flex items-center justify-center mt-4">
            {loadingMore && (
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <div className="w-3 h-3 border-2 border-slate-200 border-t-black rounded-full animate-spin"></div>
                Loading...
              </div>
            )}
          </div>
        )}

      </div>

      {/* 8. FLOATING VIP CONCIERGE (WhatsApp Integration) */}
      <a 
        href="https://wa.me/923000000000" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-[100] group flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-3 md:px-4 md:py-3.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-300"
      >
        <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-green-500 text-white rounded-full shadow-inner">
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </div>
        <div className="hidden sm:flex flex-col pr-2">
          <span className="text-[10px] font-black text-slate-900 leading-tight">VIP Concierge</span>
          <span className="text-[8px] font-medium text-slate-500 leading-tight">Replies in 5 mins</span>
        </div>
      </a>
      
    </main>
  );
}