import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-black mb-8">
          Sound without <br className="hidden md:block" /> compromise.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 leading-relaxed">
          We founded PLACEHOLDER_BRAND_NAME because we were tired of choosing between exorbitant prices and mediocre quality. We believe that true, studio-grade audio belongs to the everyday visionary.
        </p>
      </section>

      {/* Brand Image Placeholder */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="w-full bg-gray-100 aspect-video rounded-3xl flex items-center justify-center overflow-hidden">
          <span className="text-gray-400 font-medium tracking-widest uppercase text-sm">
            [ PLACEHOLDER: Premium Lifestyle or Factory Image ]
          </span>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full bg-black text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-gray-800 pb-4">Design</h3>
              <p className="text-gray-400 leading-relaxed">
                Minimalist, ergonomic, and built to last. We strip away the unnecessary so you can focus purely on the experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-gray-800 pb-4">Engineering</h3>
              <p className="text-gray-400 leading-relaxed">
                Relentlessly tested and acoustically tuned. We partner with top-tier manufacturers to bring cutting-edge tech to your ears.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 text-center px-4">
        <h2 className="text-3xl font-bold text-black mb-6">Experience the difference.</h2>
        <Link 
          href="/products" 
          className="inline-block bg-black text-white px-10 py-4 rounded-full font-medium hover:bg-gray-800 transition-all"
        >
          Explore Our Products
        </Link>
      </section>

    </div>
  );
}