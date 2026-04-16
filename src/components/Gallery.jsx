import { useState, useEffect } from 'react';
import { HiX, HiArrowsExpand, HiOutlinePhotograph, HiPlus } from 'react-icons/hi';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
    window.scrollTo(0, 0);
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gallery`);
      if (response.ok) {
        const data = await response.json();
        setImages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const displayedImages = images.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] mb-10 font-sans selection:bg-gold/20">
      
      {/* Refined Hero Section */}
      <section className="relative h-[35vh] flex items-center justify-center bg-navy">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="container relative z-10 px-6 text-center">
           <h1 className="text-4xl md:text-6xl font-bold text-white tracking-[0.2em] uppercase">
              Portfolio
           </h1>
           <div className="w-16 h-1 bg-gold mx-auto mt-6"></div>
        </div>
      </section>

      {/* Main Gallery Grid */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
            {displayedImages.length > 0 ? (
              displayedImages.map((image, index) => (
                <div 
                  key={image._id || index}
                  className="group relative flex flex-col items-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* PURE WHITE FRAME - object-contain ensures NO CROPPING */}
                  <div 
                    className="relative w-full aspect-square bg-white shadow-2xl transition-all duration-700 cursor-pointer overflow-hidden p-6 border border-slate-100"
                    onClick={() => setSelectedImage(image)}
                  >
                    {/* Image Container with contain - NO CUTTING */}
                    <div className="relative w-full h-full overflow-hidden bg-slate-50 flex items-center justify-center">
                      <img 
                        src={image.imageUrl} 
                        alt="" 
                        className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-1000 ease-out group-hover:scale-110"
                      />
                      
                      {/* Interaction Overlay */}
                      <div className="absolute inset-0 bg-[#0A1C3A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                         <HiArrowsExpand size={28} className="text-[#0A1C3A]/20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-40 text-center flex flex-col items-center">
                <HiOutlinePhotograph className="w-10 h-10 text-slate-200 mb-4" />
                <p className="text-xs font-bold text-[#0A1C3A]/20 uppercase tracking-widest">Gallery Empty</p>
              </div>
            )}
          </div>

          {/* Ultra-Minimal Premium Load More Button */}
          {visibleCount < images.length && (
            <div className="flex justify-center my-40 px-6">
              <button 
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="group relative px-20 py-6 transition-all duration-500 overflow-hidden"
                style={{ 
                  backgroundColor: '#0A1C3A', 
                  color: '#FFFFFF',
                  border: '1px solid #C69C6D',
                  letterSpacing: '0.4em',
                  fontSize: '11px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  minWidth: '280px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#C69C6D';
                  e.currentTarget.style.color = '#0A1C3A';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(198, 156, 109, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0A1C3A';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <span>Discover More</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Modal - Clean */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-navy/98 backdrop-blur-3xl z-[9999] flex items-center justify-center p-4 md:p-12 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-10 right-10 text-white/40 hover:text-white transition-all">
            <HiX size={32} />
          </button>

          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
             <div className="bg-white p-2 shadow-2xl animate-scale-up">
                <img 
                  src={selectedImage.imageUrl} 
                  className="max-h-[85vh] w-auto mx-auto object-contain" 
                  alt="" 
                />
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.5s ease-out forwards; }
        
        .text-navy { color: #0A1C3A; }
        .bg-navy { background-color: #0A1C3A; }
        .text-gold { color: #C69C6D; }
        .bg-gold { background-color: #C69C6D; }
      `}</style>
    </div>
  );
};

export default Gallery;
