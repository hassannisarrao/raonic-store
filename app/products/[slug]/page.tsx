"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function ProductDetail() {
  const params = useParams(); 
  const slug = params.slug;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Selections & Pricing
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // === NEW PHASE 2: CONVERSION STATES ===
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stockLeft, setStockLeft] = useState(7); // Fake scarcity stock number

  // 1. Fetch Product Data
  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setCurrentPrice(data.price); // Set base price initially
          // Randomize stock between 3 and 12 for realistic scarcity
          setStockLeft(Math.floor(Math.random() * 10) + 3); 
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

    // Check if all options are selected
    const optionKeys = product.options?.map((o: any) => o.name) || [];
    const allSelected = optionKeys.every((key: string) => selectedOptions[key]);

    if (allSelected) {
      // Build the matching title string (e.g. "red / Buy 1")
      const comboTitle = optionKeys.map((key: string) => selectedOptions[key]).join(" / ");
      
      // Find matching variant row in matrix
      const matchedVariant = product.variants.find((v: any) => v.title === comboTitle);
      if (matchedVariant && matchedVariant.price) {
        setCurrentPrice(Number(matchedVariant.price));
      } else {
        setCurrentPrice(product.price);
      }
    }
  }, [selectedOptions, product]);

  // === NEW PHASE 2: COUNTDOWN TIMER & SCROLL TRACKER ===
  useEffect(() => {
    // 24-Hour looping countdown timer
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    // Sticky Bar Scroll Listener
    const handleScroll = () => {
      // Show the sticky bar if they scroll down more than 600px
      setShowStickyBar(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">Preparing Product...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <h2 className="text-3xl font-black text-gray-900 mb-2">Product Not Found</h2>
      <p className="text-gray-500 mb-6">This item might have been removed or is unavailable.</p>
      <Link href="/" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
        Return to Store
      </Link>
    </div>
  );

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value
    }));
  };

  // Handle the Add to Cart button click
  const handleAddToCart = () => {
    const optionsList = product.options || [];
    
    // Ensure all options are selected if they exist
    for (const opt of optionsList) {
      if (!selectedOptions[opt.name]) {
        alert(`Please select a ${opt.name} first.`);
        return;
      }
    }

    // Find specific variant title combination
    const optionKeys = optionsList.map((o: any) => o.name);
    const comboTitle = optionKeys.map((key: string) => selectedOptions[key]).join(" / ");
    
    // Pass custom variant details into cart
    addToCart({ 
      ...product, 
      price: currentPrice, // Uses the specific variant price!
      color: selectedOptions["Color"] || selectedOptions["color"] || comboTitle, 
      size: selectedOptions["Size"] || selectedOptions["size"] || "" 
    });
  };

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 pb-32">
      <div className="max-w-7xl mx-auto px-6 pt-8 md:pt-16 pb-12 lg:pb-24">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 md:mb-12">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-2 w-fit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Collection
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT SIDE: STICKY IMAGE GALLERY */}
          <div className="relative">
            <div className="sticky top-28 bg-[#F8FAFC] rounded-[2.5rem] p-8 md:p-12 flex items-center justify-center aspect-square md:aspect-[4/5] border border-gray-100 shadow-sm overflow-hidden group">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                />
              ) : (
                <span className="text-gray-400 font-medium tracking-wide uppercase text-sm">No Image Available</span>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: DETAILS & CHECKOUT */}
          <div className="flex flex-col pt-2 lg:pt-8">
            
            {/* UPGRADED: Premium Minimalist Urgency Banner */}
            <div className="flex items-center justify-between py-4 px-5 border border-gray-100 rounded-2xl mb-8 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Sale Ends In</span>
              </div>
              <span className="tabular-nums font-black text-lg text-red-600 tracking-wider">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <span className="text-xs font-black tracking-[0.2em] uppercase text-gray-400 mb-4 block">
              {product.category || "Premium Collection"}
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-gray-900 leading-tight">
              {product.name}
            </h1>
            
            {/* Dynamic Price */}
            <div className="mb-6">
              <span className="text-3xl md:text-4xl font-black text-black">Rs. {currentPrice}</span>
              {product.compareAtPrice && currentPrice < product.compareAtPrice && (
                <span className="ml-4 text-xl md:text-2xl font-bold text-gray-400 line-through decoration-2">Rs. {product.compareAtPrice}</span>
              )}
            </div>

            {/* UPGRADED: Scarcity Indicator */}
            <div className="flex items-center gap-2 mb-10">
              <div className="w-2 h-2 rounded-full bg-gray-900"></div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Only {stockLeft} items left in stock</p>
            </div>

            {/* DYNAMICALLY RENDER ALL OPTIONS FROM ADMIN PANEL */}
            <div className="space-y-8 mb-10">
              {product.options && product.options.map((opt: any) => (
                <div key={opt.name}>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    Select {opt.name}
                    {selectedOptions[opt.name] && <span className="text-gray-400 font-medium normal-case">- {selectedOptions[opt.name]}</span>}
                  </h3>
                  
                  {/* UPGRADED: Check if option is "Color" to render swatches instead of buttons */}
                  {opt.name.toLowerCase() === "color" ? (
                    <div className="flex flex-wrap gap-4">
                      {opt.values.map((val: string) => {
                        const isSelected = selectedOptions[opt.name] === val;
                        // Removes spaces to handle things like "Light Blue" becoming "lightblue" which CSS understands
                        const cssColor = val.toLowerCase().replace(/\s+/g, "");
                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionSelect(opt.name, val)}
                            title={val}
                            className={`relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center bg-white ${
                              isSelected ? "border-black scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            <span 
                              className="w-9 h-9 rounded-full shadow-inner border border-black/10" 
                              style={{ backgroundColor: cssColor }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Standard text buttons for Size, Bundle, etc. */
                    <div className="flex flex-wrap gap-3">
                      {opt.values.map((val: string) => (
                        <button
                          key={val}
                          onClick={() => handleOptionSelect(opt.name, val)}
                          className={`px-6 py-3.5 rounded-2xl text-sm font-bold transition-all border-2 ${
                            selectedOptions[opt.name] === val 
                              ? "bg-black text-white border-black shadow-lg scale-105" 
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-black"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart} 
              className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mb-8"
            >
              Add to Cart
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 mb-10 bg-gray-50/50 rounded-2xl px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-black shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-900">Free Shipping</p>
                  <p className="text-[10px] text-gray-500 font-medium">On local orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-black shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-900">100% Secure</p>
                  <p className="text-[10px] text-gray-500 font-medium">Protected checkout</p>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Product Details</h3>
              {product.description ? (
                <div 
                  className="prose prose-gray max-w-none text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-headings:font-bold prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-p:text-sm md:prose-p:text-base"
                  dangerouslySetInnerHTML={{ __html: product.description }} 
                />
              ) : (
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">No description provided for this product.</p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE STICKY ADD TO CART BAR */}
      <div 
        className={`md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-in-out ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 line-clamp-1">{product.name}</span>
            <span className="text-lg font-black text-black">Rs. {currentPrice}</span>
          </div>
          <button 
            onClick={() => {
              const optionsList = product.options || [];
              const allSelected = optionsList.every((opt: any) => selectedOptions[opt.name]);
              if (!allSelected) {
                window.scrollTo({ top: 300, behavior: 'smooth' });
                alert("Please select your options first.");
              } else {
                handleAddToCart();
              }
            }} 
            className="bg-black text-white px-8 py-3.5 rounded-xl font-bold tracking-wide hover:bg-gray-800 transition-colors shrink-0"
          >
            Add to Cart
          </button>
        </div>
      </div>

    </main>
  );
}