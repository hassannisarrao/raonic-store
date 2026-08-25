"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Infinite Scroll State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreNodeRef = useRef<HTMLDivElement | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Force video to loop and play programmatically on mobile and desktop devices immediately[cite: 5]
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

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900 selection:bg-black selection:text-white">
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: 200%;
          animation: ticker 25s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}} />
      
      {/* 1. INTERNATIONAL LUXURY HERO SECTION */}
      <section className="relative text-white overflow-hidden min-h-[65vh] md:min-h-[80vh] flex flex-col justify-between bg-black pt-20 pb-12">
        
        {/* Force-Playing & Seamlessly Looping Mobile/Desktop Video Background[cite: 5] */}
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-75 scale-105 pointer-events-none"
        >
          <source src="/banner-video.mp4" type="video/mp4" />
        </video>
        
        {/* Deep Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/60 pointer-events-none"></div>

        {/* TOP: Sale Badge Announcement Bar */}
        <div className="relative z-10 w-full flex justify-center px-6 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] md:text-xs font-black tracking-[0.25em] uppercase text-white shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            ⚡ 40% Sale on All Products
          </div>
        </div>

        {/* UPPER-MIDDLE: Aesthetic Stylized Subtitle Text placed above video's watermark */}
        <div className="relative z-10 w-full flex flex-col items-center text-center px-6 mt-4">
          <span className="text-[11px] sm:text-xs md:text-sm font-light tracking-[0.4em] uppercase text-amber-200/90 drop-shadow-md">
            REDEFINING THE
          </span>
          <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.3em] uppercase text-white mt-0.5 drop-shadow-lg">
            Luxurious Lifestyle
          </span>
        </div>

        {/* BOTTOM: High-End Transparent Frosted Glass Buttons */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            <button 
              onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
              className="w-full sm:w-auto bg-white/15 backdrop-blur-md border border-white/30 text-white px-9 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:scale-105 cursor-pointer"
            >
              Shop Collection
            </button>
            <Link 
              href="/products"
              className="w-full sm:w-auto text-center bg-black/40 hover:bg-white hover:text-black text-white border border-white/30 backdrop-blur-md px-9 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              Explore Lookbook
            </Link>
          </div>
        </div>

        {/* Ambient Scroll Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1 text-slate-300">Scroll Down</span>
          <svg className="w-4 h-4 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* 2. MOVING BRAND TICKER BAR */}
      <div className="bg-black text-white py-3 overflow-hidden border-y border-white/10 relative z-20">
        <div className="animate-ticker whitespace-nowrap flex items-center gap-12 text-[10px] md:text-xs font-black tracking-[0.25em] uppercase">
          <span>FREE SHIPPING NATIONWIDE</span>
          <span>•</span>
          <span>SECURE CASH ON DELIVERY</span>
          <span>•</span>
          <span>100% AUTHENTIC RAONIC ARTICLES</span>
          <span>•</span>
          <span>EXCLUSIVE LIMITED DROP</span>
          <span>•</span>
          <span>FREE SHIPPING NATIONWIDE</span>
          <span>•</span>
          <span>SECURE CASH ON DELIVERY</span>
          <span>•</span>
          <span>100% AUTHENTIC RAONIC ARTICLES</span>
          <span>•</span>
          <span>EXCLUSIVE LIMITED DROP</span>
        </div>
      </div>

      {/* 3. DEDICATED LUXURY BRAND INTRO BANNER (Clean, Professional, Sized Down) */}
      <section className="bg-white py-12 px-6 border-b border-slate-200 text-center relative z-20 shadow-sm">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-600 mb-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Welcome to Raonic Global Flagship
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight leading-snug">
            Elevate Your Everyday Life.
          </h2>
          <div className="w-12 h-1 bg-black mb-3 rounded-full"></div>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-medium">
            Explore Raonic&apos;s curated collection of premium products Designed for absolute excellence, premium aesthetics, and delivered straight to your door[cite: 5].
          </p>
        </div>
      </section>

      {/* 4. TRUST BADGES */}
      <section className="bg-slate-50 shadow-sm relative z-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-3 gap-2 md:gap-6 text-center divide-x divide-slate-200">
          <div className="flex flex-col items-center px-1">
            <svg className="w-5 h-5 md:w-7 md:h-7 text-black mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-wider">Free Shipping</h3>
            <p className="text-[9px] md:text-xs text-slate-500 mt-0.5 truncate max-w-full">Orders above Rs. 5000</p>
          </div>
          <div className="flex flex-col items-center px-1">
            <svg className="w-5 h-5 md:w-7 md:h-7 text-black mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-wider">Secure Checkout</h3>
            <p className="text-[9px] md:text-xs text-slate-500 mt-0.5 truncate max-w-full">100% protected</p>
          </div>
          <div className="flex flex-col items-center px-1">
            <svg className="w-5 h-5 md:w-7 md:h-7 text-black mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636l3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-wider">24/7 Support</h3>
            <p className="text-[9px] md:text-xs text-slate-500 mt-0.5 truncate max-w-full">Always here</p>
          </div>
        </div>
      </section>

      {/* 5. MAIN STOREFRONT */}
      <div className="max-w-7xl mx-auto px-6 mt-10 md:mt-12 relative z-30">
        
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12 bg-white/95 backdrop-blur-xl p-4 md:p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-200/80">
          <div className="w-full lg:w-1/3 relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search the collection..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar scroll-smooth">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-sm ${
                  selectedCategory === category 
                    ? "bg-black text-white shadow-xl scale-105 ring-2 ring-black" 
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 hover:text-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 pt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
                <div className="w-full aspect-square bg-slate-200"></div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/3 mt-2"></div>
                  <div className="h-10 bg-slate-100 rounded-xl mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-3">No products found</h2>
            <p className="text-slate-500 mb-6 text-sm">Try adjusting your search or filtering options.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => {
              const isWishlisted = wishlist.includes(product._id);
              const secondImage = product.images && product.images[1] ? product.images[1] : product.imageUrl;

              return (
                <div key={product._id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 relative">
                  
                  {/* Wishlist Heart Icon */}
                  <button 
                    onClick={(e) => toggleWishlist(product._id, e)}
                    className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    aria-label="Wishlist"
                  >
                    <svg className={`w-5 h-5 transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : "text-slate-700"}`} fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>

                  {/* Secondary Image Hover Effect Wrapper */}
                  <Link href={`/products/${product.slug}`} className="block relative w-full aspect-square overflow-hidden bg-slate-100">
                    {product.imageUrl ? (
                      <>
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                        />
                        <img 
                          src={secondImage} 
                          alt={`${product.name} alternate`} 
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">No Image</div>
                    )}
                    
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-black shadow-sm">
                      {product.category || "New"}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-5 flex flex-col flex-1 relative bg-white">
                    <Link href={`/products/${product.slug}`}>
                      <h2 className="text-sm md:text-base font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-slate-600 transition-colors">{product.name}</h2>
                    </Link>
                    <p className="text-lg md:text-xl font-black text-black mt-auto">Rs. {product.price}</p>
                    
                    {/* Quick Add & View Details Actions */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                      <Link 
                        href={`/products/${product.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-black text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        <span>Details</span>
                      </Link>
                      <Link 
                        href={`/products/${product.slug}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-2.5 rounded-xl text-xs font-black transition-colors flex items-center justify-center shadow-sm"
                        title="Quick Add"
                      >
                        + Cart
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. INTERACTIVE TRENDING PROMOTIONAL BANNER */}
        <div className="my-24 bg-gradient-to-r from-slate-900 via-black to-slate-900 rounded-3xl p-8 md:p-14 text-white shadow-2xl relative overflow-hidden border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="relative z-10 max-w-xl">
            <span className="bg-white/10 text-cyan-400 border border-white/20 px-3.5 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4 inline-block backdrop-blur-md">
              🔥 Trending Spotlight
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">The Executive Collection</h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-medium">
              Engineered for uncompromising quality and timeless aesthetic. Discover our highest-rated seasonal articles before stock runs out.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-lg hover:scale-105"
            >
              <span>Shop Trending Drop</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
          <div className="relative z-10 w-full md:w-auto text-center bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Limited Availability</p>
            <p className="text-3xl md:text-4xl font-black text-white font-mono tracking-wider">48 : 00 : 00</p>
            <p className="text-[11px] text-slate-400 mt-1">Exclusive promotional window</p>
          </div>
        </div>

        {/* Infinite Scroll Sensor */}
        {hasMore && !loading && (
          <div ref={loadMoreNodeRef} className="h-32 w-full flex items-center justify-center mt-8">
            {loadingMore && (
              <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-widest text-xs">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div>
                Loading more...
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}