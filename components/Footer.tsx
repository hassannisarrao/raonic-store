import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div>
            <span className="text-xl font-bold tracking-tighter text-black">
              PLACEHOLDER_BRAND_NAME
            </span>
            <p className="mt-4 text-sm text-gray-500">
              Redefining premium wireless audio. Designed for the everyday visionary.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold text-black uppercase text-xs tracking-wider">Shop</h3>
            <Link href="/products" className="text-gray-500 hover:text-black text-sm transition-colors">All Products</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold text-black uppercase text-xs tracking-wider">Connect</h3>
            <Link href="/contact" className="text-gray-500 hover:text-black text-sm transition-colors">Contact Us</Link>
            <a href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Instagram Placeholder</a>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} PLACEHOLDER_BRAND_NAME. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}