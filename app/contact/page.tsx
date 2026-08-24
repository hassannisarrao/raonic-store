import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-500">
            Have a question about our products or your order? We're here to help.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
          
          {/* Left Side: Contact Info & WhatsApp */}
          <div className="w-full md:w-1/3 flex flex-col space-y-10">
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-black mb-3">
                Customer Service
              </h3>
              <p className="text-gray-500 mb-1">support@PLACEHOLDER_BRAND_NAME.com</p>
              <p className="text-gray-500">+1 (555) PLACEHOLDER</p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-black mb-3">
                Business Inquiries
              </h3>
              <p className="text-gray-500">hello@PLACEHOLDER_BRAND_NAME.com</p>
            </div>
            
            <div className="pt-8 border-t border-gray-100">
              <a 
                href="https://wa.me/PLACEHOLDER_NUMBER" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-[#25D366] text-white px-6 py-4 rounded-full font-medium hover:bg-[#20b858] transition-all"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right Side: Contact Form Placeholder */}
          <div className="w-full md:w-2/3">
            <form className="flex flex-col space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm font-medium text-black mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50" 
                    placeholder="Your Name" 
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium text-black mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50" 
                    placeholder="you@example.com" 
                  />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="message" className="text-sm font-medium text-black mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={6} 
                  className="border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 resize-none" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button 
                type="button" 
                className="bg-black text-white px-10 py-4 rounded-full font-medium hover:bg-gray-800 transition-all w-full sm:w-auto self-start"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </section>
    </div>
  );
}