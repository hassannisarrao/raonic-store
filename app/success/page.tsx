"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // Your actual business WhatsApp number (Untouched)
  const storeWhatsAppNumber = "923451666830"; 
  
  // UPGRADED MESSAGE: Highly professional for COD confirmation
  const whatsappMessage = `Hello Raonic Global Flagship! I have just placed Order #${orderId} via Cash on Delivery. Please confirm my order so it can be dispatched.`;
  const whatsappLink = `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-200/80 max-w-lg w-full relative overflow-hidden">
      
      {/* Decorative top border element */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-900 via-black to-slate-900"></div>
      
      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Order Confirmed</h1>
      <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">
        Thank you for elevating your everyday with Raonic. We are getting your order ready for shipment. Click below to verify your Cash on Delivery status.
      </p>

      {orderId && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
            Order Reference
          </div>
          <p className="text-2xl font-black text-black break-all select-all mt-2 tracking-tight">{orderId}</p>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-2 font-bold">Keep this ID safe to track your delivery.</p>
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        {/* UPGRADED WHATSAPP BUTTON WITH ICON */}
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4.5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#20b858] hover:-translate-y-1 shadow-lg hover:shadow-xl transition-all duration-300 w-full"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.063-.173-.302-.019-.465.13-.613.134-.132.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Confirm via WhatsApp
        </a>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Link href="/track" className="bg-black text-white px-4 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-md text-center flex items-center justify-center">
            Track Order
          </Link>
          <Link href="/" className="bg-white border-2 border-slate-100 text-slate-700 px-4 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:border-slate-300 hover:text-black hover:-translate-y-1 transition-all text-center flex items-center justify-center">
            Shop More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-6 md:p-10 text-center pb-20 pt-32 font-sans selection:bg-black selection:text-white">
      <Suspense fallback={<div className="w-10 h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}