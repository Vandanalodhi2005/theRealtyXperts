import { useState, useEffect } from 'react';
import { HiCamera, HiSearch, HiX, HiAdjustments } from 'react-icons/hi';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
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
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(images.map(img => img.category || 'General'))];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center" style={{ backgroundColor: 'var(--color-navy)' }}>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 border-w-2 border-gold border-t-transparent animate-spin rounded-full mb-6" style={{ border: '3px solid rgba(198, 156, 109, 0.1)', borderTopColor: 'var(--color-gold)' }}></div>
          <p className="text-gold/50 text-[0.6rem] font-bold tracking-[0.4em] uppercase animate-pulse">Establishing Connection</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      {/* Dynamic Hero Section */}
      <section className="relative h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden bg-navy">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/40 to-navy z-10"></div>
           <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" 
              className="w-full h-full object-cover scale-110 animate-ken-burns"
              alt="Architecture"
           />
        </div>
        
        <div className="container relative z-20 px-6 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-8">
             <span className="w-2 h-2 bg-gold rounded-full animate-ping"></span>
             <span className="text-gold text-[0.65rem] font-black tracking-[0.3em] uppercase">Visual Portfolio 2024</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8">
            The Art of <span className="text-gold" style={{ color: 'var(--color-gold)' }}>Living</span>
          </h1>
          <div className="max-w-xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50 mb-8"></div>
          <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Every structure tells a story of ambition. Explore our collection of architectural landmarks and premium developments.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
           <div className="w-[1px] h-16 bg-gradient-to-b from-gold/50 to-transparent"></div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-6 -mt-20 relative z-30 pb-32">
        {/* Refined Filter Bar */}
        <div className="bg-white rounded-[3rem] shadow-2xl p-4 md:p-6 mb-20 border border-slate-100 flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
          <div className="hidden md:flex items-center gap-2 px-6 border-r border-slate-100 mr-2 text-navy/40">
             <HiAdjustments className="w-5 h-5" />
             <span className="text-[0.6rem] font-black uppercase tracking-widest">Filter By</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-[0.65rem] font-black uppercase tracking-widest transition-all duration-500 ${
                filter === cat 
                  ? 'bg-navy text-white shadow-[0_10px_30px_rgba(10,28,58,0.3)] transform -translate-y-1' 
                  : 'text-slate-400 hover:text-gold hover:bg-slate-50'
              }`}
              style={filter === cat ? { backgroundColor: 'var(--color-navy)' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Masonry */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
          {filteredImages.map((image, index) => (
            <div 
              key={image._id} 
              className="break-inside-avoid relative group rounded-[2.5rem] overflow-hidden bg-white shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(10,28,58,0.15)] transition-all duration-700 hover:-translate-y-2 border border-slate-100"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={image.imageUrl} 
                  alt={image.title} 
                  className="w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]"></div>
                
                {/* Visual Label */}
                <div className="absolute top-8 left-8 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                   <div className="text-white text-[0.6rem] font-black tracking-widest uppercase">{image.category || 'Architecture'}</div>
                </div>

                {/* Main Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-10 translate-y-6 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                   <h3 className="text-2xl font-black text-white leading-tight mb-2">{image.title || 'Exquisite Space'}</h3>
                   <div className="w-12 h-1 bg-gold rounded-full" style={{ backgroundColor: 'var(--color-gold)' }}></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-16 h-16 bg-gold text-white rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                       <HiSearch className="w-6 h-6" />
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-slate-100 rounded-[4rem]">
             <HiCamera className="w-24 h-24 text-slate-100 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">Awaiting the lens...</h3>
             <p className="text-slate-400 mt-2 font-medium">Visual assets are being curated for this collection.</p>
          </div>
        )}
      </div>

      {/* Experimental Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-navy/98 backdrop-blur-2xl z-[1000] flex items-center justify-center p-6 md:p-16 animate-in fade-in duration-500"
          onClick={() => setSelectedImage(null)}
        >
          <button 
             className="absolute top-10 right-10 text-white/50 hover:text-gold transition-all duration-300 z-[1001] transform hover:rotate-90"
             onClick={() => setSelectedImage(null)}
          >
            <HiX className="w-10 h-10" />
          </button>
          
          <div className="relative w-full h-full flex flex-col md:flex-row gap-12 items-center justify-center" onClick={e => e.stopPropagation()}>
             <div className="flex-1 max-w-5xl h-full flex items-center justify-center">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.title} 
                  className="max-w-full max-h-full object-contain rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10"
                />
             </div>
             
             <div className="w-full md:w-80 text-center md:text-left">
                <span className="text-gold font-black tracking-[0.4em] uppercase text-xs mb-4 block" style={{ color: 'var(--color-gold)' }}>{selectedImage.category}</span>
                <h3 className="text-4xl font-black text-white mb-6 leading-tight">{selectedImage.title}</h3>
                <div className="w-16 h-1.5 bg-gold mb-12 hidden md:block" style={{ backgroundColor: 'var(--color-gold)' }}></div>
                <p className="text-white/40 text-sm font-medium leading-relaxed italic border-l-2 border-white/10 pl-6">
                   "This asset represents the high standard of engineering and design excellence maintained by Realty Xperts."
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Custom Keyframes for Animations */}
      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s infinite alternate ease-in-out;
        }
      `}</style>
    </main>
  );
};

export default Gallery;
