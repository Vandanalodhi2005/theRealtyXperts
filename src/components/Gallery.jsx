import { useState, useEffect } from 'react';
import { HiX, HiPhotograph, HiChevronRight } from 'react-icons/hi';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
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
      setLoading(false);
    }
  };

  const displayedImages = images.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 font-bold tracking-widest text-xs uppercase">Unlocking Media Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB] font-serif selection:bg-gold selection:text-white">
      {/* Premium Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden bg-navy" style={{ backgroundColor: '#07162F' }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#07162F]/80 via-[#07162F]/40 to-[#F8F9FB] z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
        </div>
        <div className="container relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-4 tracking-tighter uppercase italic">
            Elite <span style={{ color: '#C69C6D' }}>Collections</span>
          </h1>
          <p className="text-white/60 text-xs md:text-base font-medium max-w-2xl mx-auto leading-relaxed tracking-[0.5em] uppercase">
            Architectural Excellence Captured
          </p>
        </div>
      </section>

      {/* Gallery Showcase Area */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 -mt-24 relative z-30 pb-40">
        
        {/* Gallery Card Container */}
        <div className="bg-white rounded-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)] p-10 md:p-16 border border-slate-100">
            <div className="flex items-center justify-between mb-16 border-b border-slate-100 pb-8">
                <div>
                   <h2 className="text-4xl font-bold text-[#07162F] tracking-tight m-0">Gallery</h2>
                   <div className="h-[3px] w-16 mt-3" style={{ backgroundColor: '#C69C6D' }}></div>
                </div>
                <div className="hidden md:block text-[#C69C6D] font-bold text-[0.6rem] tracking-[0.4em] uppercase">
                   Showing {displayedImages.length} of {images.length} Assets
                </div>
            </div>

            {/* High-Resolution Grid - No image cutting */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
                {displayedImages.map((image, index) => (
                    <div 
                        key={image._id || index}
                        onClick={() => setSelectedImage(image)}
                        className="group flex flex-col"
                    >
                        {/* THE FRAME: Wide white padding + Strong Border + Deep Shadow */}
                        <div className="bg-white p-6 border-4 border-[#F0F4F8] shadow-[10px_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[15px_15px_60px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden rounded-sm">
                            {/* Inner Container: object-contain ensures NO CUTTING */}
                            <div className="relative aspect-[4/3] bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                                <img 
                                    src={image.imageUrl} 
                                    alt={image.title} 
                                    className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </div>
                        
                        {/* Asset Meta - Bottom spacing as requested */}
                        <div className="mt-8 text-center px-4">
                           <h3 className="text-lg font-bold text-[#07162F] uppercase tracking-tighter truncate leading-tight italic">{image.title}</h3>
                           <p className="mt-2 text-[#C69C6D] text-[0.6rem] font-bold tracking-[0.3em] uppercase">{image.category}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* See More Navigation */}
            {visibleCount < images.length && (
              <div className="mt-24 text-center">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="inline-flex items-center gap-4 px-14 py-5 bg-[#07162F] text-white rounded-lg text-[0.7rem] font-black uppercase tracking-[0.5em] hover:bg-[#C69C6D] transition-all duration-500 shadow-2xl hover:shadow-gold/20 group"
                  >
                    SEE MORE ASSETS <HiChevronRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
                  </button>
              </div>
            )}

            {images.length === 0 && (
                <div className="py-40 text-center">
                    <HiPhotograph className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                    <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">No media assets in collection</p>
                </div>
            )}
        </div>
      </div>

      {/* Image Spotlight Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-[#07162F]/98 backdrop-blur-2xl z-[5000] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-500"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-10 right-10 text-white hover:text-[#C69C6D] transition-all"><HiX size={44} /></button>
          <div className="relative max-w-7xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
             <div className="bg-white p-2 md:p-4 shadow-2xl rounded-sm">
                <img src={selectedImage.imageUrl} className="max-h-[75vh] object-contain" alt="Spotlight" />
             </div>
             <div className="mt-10 text-center">
                <h3 className="text-3xl text-white font-bold tracking-tight uppercase italic">{selectedImage.title}</h3>
                <p className="mt-2 text-[#C69C6D] text-xs font-bold tracking-[0.4em] uppercase">{selectedImage.category} COLLECTION</p>
             </div>
          </div>
        </div>
      )}

      <style>{`
        h1, h2, h3 { font-family: 'Poppins', serif; }
        .bg-navy { background-color: #07162F; }
        .text-gold { color: #C69C6D; }
      `}</style>
    </main>
  );
};

export default Gallery;
