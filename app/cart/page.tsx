"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      // FIX: Responsive padding for empty cart screen
      <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-10 bg-gray-50">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Your Cart is Empty</h1>
        <Link href="/" className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    // FIX: Changed 'p-10' to 'p-4 md:p-10' on the main background
    <main className="min-h-screen bg-gray-50 p-4 md:p-10">
      
      {/* FIX: Changed 'p-10' to 'p-5 md:p-10' on the white container */}
      <div className="max-w-4xl mx-auto bg-white p-5 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 md:mb-8 border-b pb-4">Shopping Cart</h1>
        
        <div className="space-y-6 mb-8">
          {cart.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-6 gap-4 md:gap-0">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                {/* FIX: Slightly smaller image on mobile, normal size on desktop */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] md:text-xs text-center p-1">No Image</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="font-bold text-base md:text-lg text-gray-900 line-clamp-2">{item.name}</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {item.color && <span className="mr-2 md:mr-3">Color: <span className="font-medium text-gray-700">{item.color}</span></span>}
                    {item.size && <span>Size: <span className="font-medium text-gray-700">{item.size}</span></span>}
                  </p>
                  <p className="text-xs md:text-sm font-medium text-gray-500 mt-1 md:mt-2">Qty: <span className="text-gray-900">{item.quantity}</span></p>
                </div>
              </div>
              
              {/* FIX: Cleanly spaces the price and remove button across the bottom on mobile */}
              <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-4 md:gap-6 pt-2 md:pt-0">
                <p className="font-bold text-green-600 text-lg md:text-xl">Rs. {item.price * item.quantity}</p>
                
                <button 
                  onClick={() => removeFromCart(index)} 
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors text-xs md:text-sm shrink-0"
                >
                  Remove
                </button>
              </div>
              
            </div>
          ))}
        </div>

        {/* FIX: Ensured the subtotal and checkout button fill the screen properly on mobile */}
        <div className="flex flex-col items-end pt-4">
          <p className="text-gray-500 text-sm md:text-base font-medium mb-1">Subtotal</p>
          <p className="text-3xl md:text-4xl font-black text-gray-900 mb-6 md:mb-8">Rs. {cartTotal}</p>
          <Link 
            href="/checkout" 
            className="w-full md:w-auto text-center bg-black text-white px-8 md:px-12 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-800 transition-colors shadow-md"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}