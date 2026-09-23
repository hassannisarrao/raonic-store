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

  // Image Gallery & Zoom State
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [zoomStyle, setZoomStyle] = useState({});

  // Conversion States
  const [timeLeft, setTimeLeft] = useState({ hours: 16, minutes: 48, seconds: 35 });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stockLeft, setStockLeft] = useState(7); 
  
  // Accordion State
  const [activeAccordion, setActiveAccordion] = useState<string>("");

  // Related Products
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  // Mobile Scroll Ref for Carousel
  const carouselRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Product Data & Related Products
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

          // Fetch Related Products (same category)
          try {
            const relRes = await fetch(`/api/products?category=${data.category || 'All'}&limit=4`);
            if(relRes.ok){
              const relData = await relRes.json();
              const filtered = (relData.products || []).filter((p:any) => p.slug !== slug);
              setRelatedProducts(filtered.slice(0, 4));
            }
          } catch(e) { console.error("Related products fetch error", e); }
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

  // Magnifying Zoom Handlers (Desktop Only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)'
    });
  };
  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
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

      <div className="max-w-[1200px] mx-auto pt-6 pb-12 lg:pb-20">
        
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-12 items-start">
          
          {/* LEFT SIDE: GALLERY */}
          <div className="w-full lg:w-1/2 relative bg-[#F5F5F7] group">
            
            {/* Desktop Zoomable Gallery */}
            <div 
              className="hidden lg:flex relative aspect-[4/5] w-full overflow-hidden cursor-crosshair bg-white items-center justify-center"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
               {allImages.length > 0 ? (
                  <img 
                    src={allImages[currentImageIdx]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-200 ease-out" 
                    style={zoomStyle}
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Image</div>
               )}
            </div>

            {/* Mobile Swipeable Gallery */}
            <div className="lg:hidden relative w-full aspect-[4/5]">
              <div ref={carouselRef} onScroll={handleMobileScroll} className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-full">
                {allImages.length > 0 ? (
                  allImages.map((img, idx) => (
                    <div key={idx} className="min-w-full w-full h-full snap-center bg-white">
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="min-w-full w-full h-full snap-center flex items-center justify-center">No Image</div>
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
            
            {/* Desktop Carousel Arrows */}
            <div className="hidden lg:flex py-4 bg-white justify-center items-center gap-1.5 w-full">
               {allImages.length > 1 && allImages.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentImageIdx(idx)} className={`h-2 rounded-full transition-all duration-300 ${currentImageIdx === idx ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300'}`} />
               ))}
            </div>
          </div>

          {/* RIGHT SIDE: PRODUCT INFO */}
          <div className="w-full lg:w-1/2 flex flex-col pt-10 px-5 md:px-8">
            
            <h1 className="text-2xl md:text-3xl font-black mb-3 text-slate-900 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl font-black text-blue-700">Rs. {currentPrice}</span>
              {product.compareAtPrice && currentPrice < product.compareAtPrice && (
                <span className="text-sm font-bold text-slate-400 line-through">Rs. {product.compareAtPrice}</span>
              )}
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
            <div className="hidden md:flex items-center gap-3 mb-4">
              <div className="flex items-center justify-between border border-gray-300 rounded-lg px-2 h-12 w-28 bg-white shrink-0">
                 <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-xl font-light px-2 text-gray-500 hover:text-black">−</button>
                 <span className="font-bold text-sm text-black">{quantity}</span>
                 <button onClick={() => setQuantity(q => q + 1)} className="text-xl font-light px-2 text-gray-500 hover:text-black">+</button>
              </div>
              <button onClick={handleBuyItNow} className="flex-1 bg-[#FFA500] hover:bg-[#E69500] text-white h-12 rounded-lg font-black uppercase tracking-wider text-sm shadow-[0_4px_15px_rgba(245,158,11,0.3)] transition-all flex flex-col items-center justify-center leading-none">
                <span>GET YOURS - RS. {currentPrice * quantity}</span>
              </button>
            </div>

            {/* SAFE CHECKOUT & SHIPPING BADGES */}
            <div className="hidden md:flex items-center justify-start gap-8 py-3 mb-6">
               <div className="flex items-center gap-2 text-slate-800">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                  <span className="text-[13px] font-bold text-slate-700">Safe and Secure Checkout</span>
               </div>
               <div className="flex items-center gap-2 text-slate-800">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  <span className="text-[13px] font-bold text-slate-700">Free Shipping</span>
               </div>
            </div>

            {/* OPEN ADMIN DESCRIPTION */}
            <div className="mt-4 mb-8">
               {product.description ? (
                 <div className="admin-description" dangerouslySetInnerHTML={{ __html: product.description }} />
               ) : (
                 <div className="admin-description">
                   <p>Experience the ultimate blend of comfort and style. Our exclusive piece is designed to provide you with unrestricted movement and absolute confidence throughout your day.</p>
                 </div>
               )}
            </div>

            <div className="border-t border-gray-200 py-4">
              <button onClick={() => setActiveAccordion(activeAccordion === "shipping" ? "" : "shipping")} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-sm font-bold text-slate-900 tracking-wide">Shipping & Returns</h3>
                <span className="text-xl font-light text-slate-400">{activeAccordion === "shipping" ? "−" : "+"}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === "shipping" ? "max-h-[300px] mt-3" : "max-h-0"}`}>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">Free nationwide shipping. 30-Day Money back guarantee on all items. Fast dispatch within 24 hours.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* WHY 50,000+ CUSTOMERS TRUST US (Centered & Premium)      */}
      {/* ======================================================== */}
      <div className="py-16 md:py-20 bg-white border-t border-gray-100 px-4">
         <div className="max-w-6xl mx-auto">
           <div className="text-center mb-12">
             <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight text-slate-900">Why 50,000+ Customers Trust Us</h2>
             <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
               Our main goal is customer satisfaction, which is why we strive to offer the best service and shopping experience on the market.
             </p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
              
              <div className="flex flex-col items-center text-center mx-auto">
                <div className="w-16 h-16 rounded-full border-2 border-[#1E3A8A] flex items-center justify-center mb-5 p-1">
                  <div className="w-full h-full rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-800">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
                <h4 className="font-black text-[14px] uppercase tracking-wide text-slate-900 mb-2">Customer Service</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Need help? We are at your <br/><span className="text-[#1E3A8A] font-bold">service 24/7.</span></p>
              </div>
              
              <div className="flex flex-col items-center text-center mx-auto">
                <div className="w-16 h-16 rounded-full border-2 border-[#1E3A8A] flex items-center justify-center mb-5 p-1">
                  <div className="w-full h-full rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-800">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
                <h4 className="font-black text-[14px] uppercase tracking-wide text-slate-900 mb-2">Money Back Guarantee</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Not satisfied? Return or exchange<br/>within <span className="text-[#1E3A8A] font-bold">30 days, hassle-free.</span></p>
              </div>

              <div className="flex flex-col items-center text-center mx-auto">
                <div className="w-16 h-16 rounded-full border-2 border-[#1E3A8A] flex items-center justify-center mb-5 p-1">
                  <div className="w-full h-full rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-800">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
                <h4 className="font-black text-[14px] uppercase tracking-wide text-slate-900 mb-2">Secure Payment</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Shop confidently. All transactions<br/>are <span className="text-[#1E3A8A] font-bold">SSL encrypted.</span></p>
              </div>

              <div className="flex flex-col items-center text-center mx-auto">
                <div className="w-16 h-16 rounded-full border-2 border-[#1E3A8A] flex items-center justify-center mb-5 p-1">
                  <div className="w-full h-full rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-800">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
                <h4 className="font-black text-[14px] uppercase tracking-wide text-slate-900 mb-2">Free Shipping</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Worldwide delivery. Free shipping<br/>on <span className="text-[#1E3A8A] font-bold">orders over Rs. 5000</span></p>
              </div>

           </div>
         </div>
      </div>

      {/* ======================================================== */}
      {/* YOU MAY ALSO LIKE (Cross-selling slider)                 */}
      {/* ======================================================== */}
      {relatedProducts.length > 0 && (
        <div className="bg-[#F8FAFC] py-16 px-4 border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-10 text-slate-900 tracking-tight">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(rel => (
                <Link href={`/products/${rel.slug}`} key={rel._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group block">
                  <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                    <img src={rel.imageUrl || rel.images?.[0]} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm font-bold text-slate-900 truncate mb-1">{rel.name}</h3>
                    <p className="text-sm font-black text-[#1E3A8A]">Rs. {rel.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PREMIUM NEWSLETTER SUBSCRIPTION                          */}
      {/* ======================================================== */}
      <div className="py-20 px-4 bg-[#9BA9CE] text-slate-900 text-center flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full">
           <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-slate-900">Get the Best Deals Delivered to Your Inbox</h2>
           <p className="text-sm md:text-[15px] mb-8 text-slate-800 font-semibold leading-relaxed px-2">Subscribe for exclusive discounts, early access to new arrivals, and weekly surprises.</p>
           
           <form className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
             <input type="email" required placeholder="Enter your email" className="flex-1 p-3.5 rounded bg-white text-slate-900 border border-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 font-medium" />
             <button type="submit" className="w-full sm:w-auto bg-[#7D8EBA] hover:bg-[#6A7AA8] text-white px-8 py-3.5 rounded font-bold transition-colors shadow-sm text-[15px] tracking-wide">Subscribe</button>
           </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PROFESSIONAL FOOTER (RAONIC & 2-Column Mobile Grid)      */}
      {/* ======================================================== */}
      <footer className="bg-white py-16 px-6 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-8 text-left">
           
           {/* Column 1: Main Menu */}
           <div className="flex flex-col gap-4">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Main Menu</h3>
             <Link href="/" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">Home</Link>
             <Link href="/products" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">Products</Link>
             <Link href="/about" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">About Us</Link>
             <Link href="/track" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">Track Your Order</Link>
             <Link href="/contact" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">Contact Us</Link>
           </div>

           {/* Column 2: Help & Support */}
           <div className="flex flex-col gap-4">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Help & Support</h3>
             <Link href="/search" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">Search</Link>
             <Link href="/faq" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">FAQs</Link>
             <Link href="/privacy" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">Terms of Service</Link>
             <Link href="/refund" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">Refund Policy</Link>
             <Link href="/shipping" className="text-sm text-slate-700 hover:text-black font-bold uppercase tracking-wider transition-colors">Shipping Policy</Link>
           </div>

           {/* Column 3: Brand & Contact (Full width on mobile) */}
           <div className="col-span-2 md:col-span-1 flex flex-col gap-4 mt-4 md:mt-0 pt-8 md:pt-0 border-t md:border-0 border-gray-100">
             <h2 className="text-4xl font-black text-[#1E3A8A] tracking-tighter mb-2">RAONIC</h2>
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Get In Touch</h3>
             
             <div className="text-sm font-medium text-slate-600 mt-2">
               <p className="mb-1">WhatsApp / Call:</p>
               <a href="tel:+923013043757" className="text-base font-bold text-black hover:text-[#1E3A8A] transition-colors">+92 301 3043757</a>
             </div>
             
             <div className="text-sm font-medium text-slate-600 mt-2">
               <p className="mb-1">Email:</p>
               <a href="mailto:support@raonic.com" className="text-base font-bold text-black hover:text-[#1E3A8A] transition-colors">support@raonic.com</a>
             </div>
             
             <p className="text-xs text-slate-500 leading-relaxed mt-4 uppercase tracking-wider font-semibold">
               Support operating hours:<br/>9 AM to 5 PM (Mon - Fri)
             </p>
           </div>

        </div>
      </footer>

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
          <button onClick={handleBuyItNow} className="flex-1 bg-[#FFA500] hover:bg-[#E69500] text-white h-12 rounded-lg font-black uppercase text-[11px] shadow-md transition-colors flex flex-col items-center justify-center leading-tight">
            <span>GET YOURS - RS. {currentPrice * quantity}</span>
          </button>
        </div>
      </div>

    </main>
  );
}