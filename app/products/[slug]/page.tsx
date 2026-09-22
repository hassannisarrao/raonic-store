"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function ProductDetail() {
  const params = useParams(); 
  const slug = params.slug;
  const router = useRouter(); 
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Selections, Pricing & Quantity
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1); 

  // Image Gallery State
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  // Conversion States
  const [timeLeft, setTimeLeft] = useState({ hours: 16, minutes: 48, seconds: 35 });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stockLeft, setStockLeft] = useState(7); 
  
  // Accordion State (This was missing)
  const [activeAccordion, setActiveAccordion] = useState<string>("");

  // Mobile Scroll Ref for Carousel
  const carouselRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Product Data
  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setCurrentPrice(data.price); 
          setStockLeft(Math.floor(Math.random() * 10) + 3); 
          
          const imagesArray = data.images && data.images.length > 0 
            ? data.images 
            : (data.imageUrl ? [data.imageUrl] : []);
          setAllImages(imagesArray);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // 2. Update price whenever user selections change
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) return;

    const optionKeys = product.options?.map((o: any) => o.name) || [];
    const allSelected = optionKeys.every((key: string) => selectedOptions[key]);

    if (allSelected) {
      const comboTitle = optionKeys.map((key: string) => selectedOptions[key]).join(" / ");
      const matchedVariant = product.variants.find((v: any) => v.title === comboTitle);
      if (matchedVariant && matchedVariant.price) {
        setCurrentPrice(Number(matchedVariant.price));
      } else {
        setCurrentPrice(product.price);
      }
    }
  }, [selectedOptions, product]);

  // 3. Countdown Timer (Visual) & Scroll Tracker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMobileScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const width = carouselRef.current.offsetWidth;
      const currentIndex = Math.round(scrollPosition / width);
      setCurrentImageIdx(currentIndex);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-8 h-8 border-[2px] border-slate-100 border-t-black rounded-full animate-spin mb-4"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
      <Link href="/" className="bg-black text-white px-8 py-3 rounded-md font-medium">Return to Store</Link>
    </div>
  );

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const getValidatedProductData = () => {
    const optionsList = product.options || [];
    for (const opt of optionsList) {
      if (!selectedOptions[opt.name]) {
        alert(`Please select your preferred ${opt.name} first.`);
        return null;
      }
    }
    const optionKeys = optionsList.map((o: any) => o.name);
    const comboTitle = optionKeys.map((key: string) => selectedOptions[key]).join(" / ");
    
    return { 
      ...product, 
      price: currentPrice, 
      color: selectedOptions["Color"] || selectedOptions["color"] || comboTitle, 
      size: selectedOptions["Size"] || selectedOptions["size"] || "",
      quantity: quantity
    };
  };

  const handleAddToCart = () => {
    const validData = getValidatedProductData();
    if (validData) {
      addToCart(validData);
    }
  };

  const handleBuyItNow = () => {
    const validData = getValidatedProductData();
    if (validData) {
      addToCart(validData);
      router.push('/checkout'); 
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 pb-32">
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        /* Rich Text styling for Admin Description */
        .admin-description img { width: 100%; border-radius: 12px; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .admin-description h2, .admin-description h3 { font-size: 1.25rem; font-weight: 900; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #111; }
        .admin-description p { font-size: 0.95rem; line-height: 1.7; color: #444; margin-bottom: 1rem; }
      `}} />

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="w-full bg-[#3B5EDF] text-white text-center py-2.5 px-4 text-[10px] md:text-xs font-bold tracking-wider flex items-center justify-center flex-wrap gap-1 md:gap-2 z-40 relative mt-16 md:mt-20">
        <span>BIGGEST SALE | 50% OFF | SALE ENDS IN</span>
        <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>

      <div className="max-w-[1200px] mx-auto pt-6 pb-12 lg:pb-24">
        
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-12 items-start">
          
          {/* LEFT SIDE: SWIPEABLE GALLERY */}
          <div className="w-full lg:w-1/2 relative bg-[#F5F5F7]">
            {/* Desktop Gallery */}
            <div className="hidden lg:block relative aspect-[4/5]">
               {allImages.length > 0 ? (
                  <img src={allImages[currentImageIdx]} alt={product.name} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Image</div>
               )}
            </div>

            {/* Mobile Swipeable Gallery */}
            <div className="lg:hidden relative w-full aspect-[4/5]">
              <div 
                ref={carouselRef}
                onScroll={handleMobileScroll}
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-full"
              >
                {allImages.length > 0 ? (
                  allImages.map((img, idx) => (
                    <div key={idx} className="min-w-full w-full h-full snap-center bg-white">
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="min-w-full w-full h-full snap-center flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>
              
              {/* Carousel Dots */}
              {allImages.length > 1 && (
                <div className="absolute -bottom-6 left-0 w-full flex justify-center gap-1.5 z-10">
                  {allImages.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIdx === idx ? 'w-5 bg-blue-600' : 'w-1.5 bg-gray-300'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: PRODUCT INFO */}
          <div className="w-full lg:w-1/2 flex flex-col pt-10 px-5 md:px-8">
            
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black mb-3 text-slate-900 leading-tight">
              {product.name}
            </h1>
            
            {/* Price & Compare */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-black text-blue-700">Rs. {currentPrice}</span>
              {product.compareAtPrice && currentPrice < product.compareAtPrice && (
                <span className="text-sm font-bold text-slate-400 line-through">Rs. {product.compareAtPrice}</span>
              )}
            </div>

            {/* Trust Tick Marks */}
            <div className="flex flex-col gap-2 mb-6 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                <span className="flex items-center justify-center w-4 h-4 rounded bg-green-500 text-white"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                Trusted by 50,000+ Happy Customers
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                <span className="flex items-center justify-center w-4 h-4 rounded bg-green-500 text-white"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                30-Day Money-Back Guarantee
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                <span className="flex items-center justify-center w-4 h-4 rounded bg-green-500 text-white"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                Hassle-Free Returns - No Questions Asked
              </div>
            </div>

            {/* DYNAMIC OPTIONS */}
            <div className="space-y-5 mb-8">
              {product.options && product.options.map((opt: any) => (
                <div key={opt.name}>
                  <div className="mb-2">
                    <h3 className="text-sm font-bold text-slate-900">{opt.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {opt.values.map((val: string) => {
                      const isSelected = selectedOptions[opt.name] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleOptionSelect(opt.name, val)}
                          className={`px-4 py-2 text-xs font-bold rounded-full transition-all border ${isSelected ? "bg-black text-white border-black" : "bg-white text-slate-700 border-gray-300 hover:border-gray-500"}`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* MAIN CHECKOUT ACTIONS (Desktop Only) */}
            <div className="hidden md:flex items-center gap-3 mb-6">
              <div className="flex items-center justify-between border border-gray-300 rounded-lg px-2 h-12 w-28 bg-white shrink-0">
                 <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-xl font-light px-2 text-gray-500 hover:text-black">−</button>
                 <span className="font-bold text-sm text-black">{quantity}</span>
                 <button onClick={() => setQuantity(q => q + 1)} className="text-xl font-light px-2 text-gray-500 hover:text-black">+</button>
              </div>
              <button 
                onClick={handleBuyItNow} 
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white h-12 rounded-lg font-black uppercase tracking-wider text-sm shadow-[0_4px_15px_rgba(245,158,11,0.3)] transition-all flex flex-col items-center justify-center leading-none"
              >
                <span>GET YOURS - RS. {currentPrice * quantity}</span>
              </button>
            </div>

            {/* Promo Box */}
            <div className="bg-[#E8F3F4] border border-[#BDE0E2] rounded-lg p-3 flex items-center justify-center gap-3 mb-8">
               <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
               <span className="text-[11px] font-black text-teal-900 tracking-wide">FREE MYSTERY GIFT with orders over Rs. 5000!</span>
            </div>
            
            {/* Trust Seals */}
            <div className="flex flex-col items-center justify-center pt-4 pb-8 border-b border-gray-100">
               <span className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Guaranteed Safe Checkout</span>
               <div className="flex items-center gap-4 opacity-70 grayscale">
                 <span className="text-xs font-black italic">Mcafee</span>
                 <span className="text-xs font-black italic">NORTON</span>
                 <span className="text-xs font-black italic">TRUSTe</span>
               </div>
            </div>

            {/* OPEN ADMIN DESCRIPTION (RICH TEXT) */}
            <div className="mt-8 mb-12">
               {product.description ? (
                 <div 
                   className="admin-description" 
                   dangerouslySetInnerHTML={{ __html: product.description }} 
                 />
               ) : (
                 <div className="admin-description">
                   <h3>Key Features!</h3>
                   <p>Experience the ultimate blend of comfort and style. Our exclusive piece is designed to provide you with unrestricted movement and absolute confidence throughout your day.</p>
                   <p>✓ Premium build quality<br/>✓ All-day comfort<br/>✓ Versatile aesthetic</p>
                 </div>
               )}
            </div>

            {/* Standard Shipping Dropdown */}
            <div className="border-t border-gray-200 py-4">
              <button onClick={() => setActiveAccordion(activeAccordion === "shipping" ? "" : "shipping")} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-sm font-bold text-slate-900 tracking-wide">Shipping & Returns</h3>
                <span className="text-xl font-light text-slate-400">{activeAccordion === "shipping" ? "−" : "+"}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === "shipping" ? "max-h-[300px] mt-3" : "max-h-0"}`}>
                <p className="text-sm text-slate-600 leading-relaxed">Free nationwide shipping. 30-Day Money back guarantee on all items. Fast dispatch within 24 hours.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ADVANCED MOBILE STICKY BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 pb-5 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        
        <div className="flex gap-2 mb-2">
          {product.options?.map((opt: any) => (
             <div key={opt.name} className="flex-1 border border-gray-200 rounded text-center py-1 text-[10px] font-bold text-slate-600 truncate bg-slate-50">
               {selectedOptions[opt.name] || `Select ${opt.name}`}
             </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-between border border-gray-300 rounded-lg px-2 h-12 w-28 bg-white shrink-0">
             <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-xl font-light px-2 text-gray-500 hover:text-black">−</button>
             <span className="font-bold text-sm text-black">{quantity}</span>
             <button onClick={() => setQuantity(q => q + 1)} className="text-xl font-light px-2 text-gray-500 hover:text-black">+</button>
          </div>
          
          <button 
            onClick={handleBuyItNow} 
            className="flex-1 bg-[#FFA500] text-white h-12 rounded-lg font-black uppercase text-[11px] shadow-md active:bg-orange-600 transition-colors flex flex-col items-center justify-center leading-tight"
          >
            <span>GET YOURS - RS. {currentPrice * quantity}</span>
          </button>
        </div>
        <div className="text-center mt-2">
           <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Secure 256-bit Checkout</span>
        </div>
      </div>

    </main>
  );
}