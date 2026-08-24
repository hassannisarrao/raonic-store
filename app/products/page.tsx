import Link from 'next/link';
import { products } from '../../data/products';

export default function ProductsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-4">All Products</h1>
        <p className="text-lg text-gray-500">Premium audio gear designed for the everyday visionary.</p>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <Link href={`/products/${product.slug}`} key={product.id} className="group cursor-pointer">
            
            {/* Image Placeholder */}
            <div className="bg-gray-100 aspect-square rounded-3xl mb-6 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
              <span className="text-gray-400 font-medium text-sm text-center px-4">
                [ {product.name} <br/> IMAGE PLACEHOLDER ]
              </span>
            </div>
            
            {/* Product Details */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-black group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm capitalize mt-1">{product.category}</p>
              </div>
             <span className="text-lg font-medium text-black">Rs. {product.price}</span>
            </div>

          </Link>
        ))}
      </div>

    </div>
  );
}