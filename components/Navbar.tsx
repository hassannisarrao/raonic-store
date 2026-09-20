"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

export default function Navbar() {
  const { cart } = useCart();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Calculate cart items safely
  const cartItemCount = cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);

  // Detect scrolling for dynamic glassmorphism depth
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Premium Welcome Toast (Runs only once per session when user logs in)
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const hasShownWelcome = sessionStorage.getItem("welcome_toast_shown");
      if (!hasShownWelcome) {
        toast.success(`Welcome back, ${session.user.name}!`, {
          description: "You have successfully signed in to Raonic.",
          duration: 5000,
        });
        sessionStorage.setItem("welcome_toast_shown", "true");
      }
    }
  }, [status, session]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_20px_40px_rgba(0,0,0,0.04)] py-3.5" 
        : "bg-white/95 backdrop-blur-md border-b border-slate-100 py-5"
    }`}>
      <div className="flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* VIP INTERNATIONAL GRAPHICAL TEXT LOGO */}
        <Link href="/" className="z-50 flex flex-col items-start justify-center group py-1">
          <span 
            className="text-2xl md:text-3xl font-black tracking-[0.08em] uppercase transition-all duration-500 group-hover:scale-105" 
            style={{ 
              fontFamily: "'Playfair Display', 'Times New Roman', serif", 
              background: "linear-gradient(135deg, #2b2b2b 0%, #111111 50%, #4a3b32 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.12))"
            }}
          >
            Raonic
          </span>
          <span 
            className="text-[8px] md:text-[9px] font-bold tracking-[0.4em] uppercase mt-[-2px] text-slate-500 group-hover:text-black transition-colors"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Elevate Your Lifestyle
          </span>
        </Link>
        
        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 items-center">
          
          {/* VISUAL MEGA-MENU TRIGGER */}
          <div className="group relative">
            <Link href="/products" className="text-xs md:text-sm font-extrabold text-slate-600 hover:text-black transition-colors flex items-center gap-1.5 py-4 group-hover:scale-105">
              Products
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </Link>
            
            {/* The Dropdown Mega-Menu Panel */}
            <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[640px] bg-white rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.12)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-4 group-hover:translate-y-0 overflow-hidden flex backdrop-blur-2xl">
              
              {/* Category Links Area */}
              <div className="w-1/2 p-8 bg-white">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-5">Discover Collections</h4>
                <ul className="space-y-3.5">
                  <li>
                    <Link href="/products" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-all flex items-center justify-between group/item">
                      <span>New Arrivals</span>
                      <span className="text-xs text-slate-300 group-hover/item:translate-x-1 transition-transform">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-all flex items-center justify-between group/item">
                      <span>Best Sellers</span>
                      <span className="text-xs text-slate-300 group-hover/item:translate-x-1 transition-transform">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-sm font-medium text-slate-600 hover:text-black transition-all flex items-center justify-between group/item">
                      <span>Audio & Tech</span>
                      <span className="text-xs text-slate-300 group-hover/item:translate-x-1 transition-transform">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-sm font-medium text-slate-600 hover:text-black transition-all flex items-center justify-between group/item">
                      <span>Lifestyle Accessories</span>
                      <span className="text-xs text-slate-300 group-hover/item:translate-x-1 transition-transform">→</span>
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Promotional Visual Area */}
              <div className="w-1/2 p-8 bg-slate-900 relative overflow-hidden group/promo flex flex-col justify-end">
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10"></div>
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Promo" className="absolute inset-0 w-full h-full object-cover group-hover/promo:scale-110 transition-transform duration-700 opacity-85" />
                <div className="relative z-20">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3 inline-block shadow-lg">Limited Drop</span>
                  <h4 className="text-lg font-black text-white leading-tight mb-2">Summer Sale: <br/> Up to 40% Off</h4>
                  <Link href="/products" className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors mt-1">
                    <span>Shop Collection</span> 
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

            </div>
          </div>
          
          <Link href="/my-orders" className="text-xs md:text-sm font-extrabold text-slate-600 hover:text-black transition-colors relative py-1 hover:scale-105">
            My Orders
          </Link>

          <Link href="/track" className="text-xs md:text-sm font-extrabold text-slate-600 hover:text-black transition-colors relative py-1 hover:scale-105">
            Track Order
          </Link>

          {/* DYNAMIC: VIP Dropdown Widget or Sign In Button */}
          {status === "authenticated" && session?.user ? (
            <div className="relative group z-50">
              
              {/* Profile Trigger Button */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 cursor-pointer rounded-full border border-slate-200 transition-all duration-300 group-hover:shadow-sm">
                <img 
                  src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=0D8ABC&color=fff`} 
                  alt="Profile" 
                  className="w-7 h-7 rounded-full shadow-sm border border-white"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-bold text-slate-800 pr-1">
                  {session.user.name?.split(' ')[0]}
                </span>
              </div>

              {/* VIP Dropdown Panel */}
              <div className="absolute top-[100%] right-0 mt-4 w-[280px] bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 overflow-hidden flex flex-col">
                
                {/* 1. User VIP Identity (Header) */}
                <div className="p-5 border-b border-slate-100 bg-[#FAFAFA]">
                  <p className="font-black text-sm text-slate-900 truncate">{session.user.name}</p>
                  <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">{session.user.email}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-black text-white px-2.5 py-1.5 rounded-md text-[8px] font-black uppercase tracking-[0.2em] shadow-sm">
                    <span className="text-amber-400">✦</span> Customer Level
                  </div>
                </div>

                {/* VIP Links */}
                <div className="p-3 flex flex-col gap-1">
                  {/* 2. My Orders & Returns */}
                  <Link href="/my-orders" className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-black hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    My Orders & Returns
                  </Link>

                  {/* 3. Personal Lookbook (Wishlist) */}
                  <Link href="/lookbook" className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-black hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    Personal Lookbook
                  </Link>

                  {/* 4. Address Book & Preferences */}
                  <Link href="/address" className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-black hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    My Address
          
                </Link>

                  {/* 5. Premium Support / Concierge */}
                  <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-black hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    Customer Service
                  </a>

                  {/* 6. Admin Access (Smart Logic) - Sirf Admin Email par show hoga */}
                  {(session.user.email === "picsmarriage86@gmail.com" || (session as any).user?.role === "admin") && (
                    <Link href="/admin" className="px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between mt-1 border border-transparent hover:border-blue-100">
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        Admin Portal
                      </div>
                      <span className="text-[8px] uppercase tracking-widest font-black bg-blue-100 px-1.5 py-0.5 rounded text-blue-600">Secure</span>
                    </Link>
                  )}
                </div>

                {/* 7. Secure Logout */}
                <div className="p-3 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      sessionStorage.removeItem("welcome_toast_shown");
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between"
                  >
                    Sign Out
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <Link 
              href="/login" 
              className="text-xs font-extrabold uppercase tracking-wider text-black bg-slate-100 hover:bg-black hover:text-white px-4 py-2.5 rounded-full transition-all duration-300 hover:scale-105 border border-slate-200"
            >
              Sign In
            </Link>
          )}
          
          {/* Desktop Cart Button with Glow Badge */}
          <Link 
            href="/cart" 
            className="bg-black text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all hover:scale-105 flex items-center gap-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="bg-blue-600 text-white w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shadow-[0_0_10px_#2563eb]">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center gap-3 z-50">
          <Link href="/cart" className="text-xs font-bold bg-black text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-md">
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
             {cartItemCount}
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 text-slate-900 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors shadow-sm"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-[0_30px_60px_rgba(0,0,0,0.1)] py-6 px-6 flex flex-col gap-6 z-40 animate-in fade-in slide-in-from-top-2 duration-300 max-h-[85vh] overflow-y-auto">
          
          {/* MOBILE VIP PROFILE WIDGET */}
          {status === "authenticated" && session?.user && (
            <div className="flex flex-col gap-4 p-5 bg-[#FAFAFA] rounded-2xl border border-slate-100 mb-2">
              <div className="flex items-center gap-4">
                <img 
                  src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=0D8ABC&color=fff`} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-black text-slate-900">{session.user.name}</div>
                  <div className="text-xs font-medium text-slate-500 truncate w-48">{session.user.email}</div>
                </div>
              </div>
              <div className="inline-flex items-center justify-center gap-1.5 bg-black text-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-sm w-max">
                <span className="text-amber-400">✦</span> Customer Level
              </div>

              {/* Mobile VIP Links */}
              <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-slate-200">
                <Link href="/lookbook" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 hover:text-black py-2 flex items-center gap-3">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Personal Lookbook
                </Link>
                <Link href="/address" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 hover:text-black py-2 flex items-center gap-3">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Address Book
                </Link>
                <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-600 hover:text-black py-2 flex items-center gap-3">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  VIP Concierge
                </a>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Navigation Menu</h4>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-slate-900 flex items-center justify-between group">
              <span>Shop Products</span> 
              <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-slate-900 flex items-center justify-between group">
              <span>My Orders</span> 
              <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-slate-900 flex items-center justify-between group">
              <span>Track Order</span> 
              <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            
            {status === "authenticated" ? (
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  sessionStorage.removeItem("welcome_toast_shown");
                  signOut();
                }} 
                className="text-lg font-black text-red-600 flex items-center justify-between group text-left mt-2"
              >
                <span>Sign Out</span> 
                <span className="text-red-300 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-blue-600 flex items-center justify-between group">
                <span>Sign In / VIP Portal</span> 
                <span className="text-blue-300 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            )}
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
             {/* Admin Logic for Mobile */}
             {(session?.user?.email === "admin@gmail.com" || session?.user?.email === "marriage@gmail.com" || (session as any)?.user?.role === "admin") ? (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-md">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Admin Portal
                </Link>
             ) : (
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Secure Connect</span>
             )}
            <span className="text-[10px] font-bold text-slate-400">Raonic v2.4</span>
          </div>
        </div>
      )}
    </nav>
  );
}