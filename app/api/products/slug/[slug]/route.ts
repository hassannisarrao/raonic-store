{/* LEFT SIDE: PROFESSIONAL CAROUSEL WITH ARROWS */}
          <div className="w-full lg:w-1/2 relative bg-[#F5F5F7] overflow-hidden group">
            
            {/* Main Image Container */}
            <div className="relative aspect-[4/5] w-full bg-white flex items-center justify-center">
              {allImages.length > 0 ? (
                <img 
                  src={allImages[currentImageIdx]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-500" 
                />
              ) : (
                <div className="text-slate-400 text-sm font-medium">No Image Available</div>
              )}

              {/* Left & Right Arrow Buttons (Only show if multiple images exist) */}
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center shadow-md transition-all opacity-80 group-hover:opacity-100"
                    aria-label="Previous Image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  <button 
                    onClick={() => setCurrentImageIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center shadow-md transition-all opacity-80 group-hover:opacity-100"
                    aria-label="Next Image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>

            {/* Pagination Dots Below Image */}
            {allImages.length > 1 && (
              <div className="py-4 bg-white flex justify-center items-center gap-1.5 w-full">
                {allImages.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentImageIdx === idx ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>