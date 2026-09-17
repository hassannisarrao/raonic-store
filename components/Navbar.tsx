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

          <Link href="/admin" className="text-xs md:text-sm font-extrabold text-slate-400 hover:text-black transition-colors relative py-1 hover:scale-105">
            Admin
          </Link>

          {/* DYNAMIC: Profile Widget or Sign In Button */}
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-full border border-slate-200">
                <img 
                  src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=0D8ABC&color=fff`} 
                  alt="Profile" 
                  className="w-6 h-6 rounded-full shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-bold text-slate-800">
                  {session.user.name?.split(' ')[0]}
                </span>
              </div>
              <button 
                onClick={() => {
                  sessionStorage.removeItem("welcome_toast_shown");
                  signOut();
                }}
                className="text-xs font-extrabold uppercase tracking-wider text-black bg-white hover:bg-red-600 hover:text-white px-4 py-2.5 rounded-full transition-all duration-300 hover:scale-105 border border-slate-200 shadow-sm"
              >
                Logout
              </button>
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-[0_30px_60px_rgba(0,0,0,0.1)] py-8 px-8 flex flex-col gap-6 z-40 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* MOBILE PROFILE WIDGET */}
          {status === "authenticated" && session?.user && (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
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
                className="text-lg font-black text-red-600 flex items-center justify-between group text-left"
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
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-black transition-colors">
              Admin Portal
            </Link>
            <span className="text-[10px] font-bold text-slate-400">Raonic v2.4</span>
          </div>
        </div>
      )}
    </nav>
  );
}