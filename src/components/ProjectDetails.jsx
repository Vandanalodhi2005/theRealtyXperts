import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiLocationMarker, HiCurrencyRupee, HiArrowLeft, HiPhone, HiOfficeBuilding, HiHome, HiSparkles, HiCheckCircle, HiArrowSmRight } from 'react-icons/hi';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready-to-move': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'under-construction': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'upcoming': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'completed': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ready-to-move': return 'Ready to Move';
      case 'under-construction': return 'Under Construction';
      case 'upcoming': return 'Upcoming Development';
      case 'completed': return 'Completed Milestone';
      default: return status;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          entry.target.style.opacity = '1';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [id, project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center" style={{ backgroundColor: 'var(--color-navy)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent animate-spin rounded-full mx-auto mb-6" style={{ borderColor: 'rgba(198, 156, 109, 0.2)', borderTopColor: 'var(--color-gold)' }}></div>
          <p className="text-white/50 uppercase tracking-[0.5em] text-[0.6rem] font-black">Architectural Drafting...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-light flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black text-navy mb-6">Asset Not Located</h1>
        <button onClick={() => navigate('/projects')} className="bg-navy text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gold transition-all">Return to Portfolio</button>
      </div>
    );
  }

  return (
    <main className="project-details-wrapper bg-[#F8FAFC]">
      {/* Cinematic Hero Section */}
      <section className="bg-navy relative min-h-[60vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--color-navy)' }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy z-10"></div>
          <img 
            src={project.images && project.images.length > 0 ? project.images[0] : ''} 
            alt="Background" 
            className="w-full h-full object-cover grayscale brightness-50 opacity-40 scale-110"
          />
        </div>
        
        <div className="container relative z-20 px-6 text-center animate-on-scroll" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full mb-10 mx-auto">
             <HiSparkles className="text-gold animate-pulse" />
             <span className="text-gold text-[0.7rem] font-black tracking-[0.4em] uppercase" style={{ color: 'var(--color-gold)' }}>
                {project.type === 'residential' ? 'Elite Residential' : 'Prime Commercial'} Development
             </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white leading-[1.1] mb-12 tracking-tighter uppercase max-w-6xl mx-auto">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-10 mt-12">
            <div className="flex items-center gap-4 text-white/90 group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center border border-gold/30">
                 <HiLocationMarker className="text-gold text-2xl" style={{ color: 'var(--color-gold)' }} />
              </div>
              <div className="text-left">
                 <p className="text-[0.6rem] font-black text-gold uppercase tracking-widest mb-1">Global Address</p>
                 <p className="text-lg font-bold">{project.location}, {project.city}</p>
              </div>
            </div>

            <div className="w-[1px] h-12 bg-white/10 hidden md:block"></div>

            <div className="flex items-center gap-4 text-white/90">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                 <HiOfficeBuilding className="text-white/40 text-2xl" />
              </div>
              <div className="text-left">
                 <p className="text-[0.6rem] font-black text-white/40 uppercase tracking-widest mb-1">Status Phase</p>
                 <p className="text-lg font-bold uppercase tracking-tight">{project.status?.replace('-', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stat Overlay */}
        <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent z-30"></div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 -mt-20 relative z-40">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Visuals & Narrative */}
            <div className="lg:col-span-8 space-y-20 flex flex-col items-center lg:items-start text-center lg:text-left pt-0 md:pt-16 uppercase">
              {/* Image Gallery */}
              <div className="w-full animate-on-scroll" style={{ opacity: 0 }}>
                <div className="relative aspect-[16/10] bg-white rounded-[3rem] overflow-hidden shadow-2xl p-4 border-8 border-white group">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[activeImage]}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-[2rem] transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-[2.5rem]">
                      <HiHome className="w-32 h-32 text-slate-100" />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-x-8 bottom-8 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none rounded-[2rem]"></div>
                </div>

                {project.images && project.images.length > 1 && (
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                    {project.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`w-28 h-20 rounded-2xl overflow-hidden border-4 transition-all duration-300 transform ${
                          activeImage === index ? 'border-gold scale-110 shadow-xl' : 'border-white hover:border-slate-200'
                        }`}
                      >
                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Narrative Content */}
              <div className="w-full space-y-20 animate-on-scroll" style={{ opacity: 0 }}>
                {/* Vision Statement */}
                <div className="max-w-3xl">
                  <div className="inline-block px-6 py-2 bg-navy/5 rounded-full text-navy text-[0.65rem] font-black tracking-widest mb-6">
                     ARCHITECTURAL NARRATIVE
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-navy leading-tight mb-8" style={{ color: 'var(--color-navy)' }}>
                    Engineering a New <br/>Legacy of <span className="text-gold">Luxury</span>
                  </h2>
                  <p className="text-xl text-slate-500 leading-relaxed font-medium">
                    {project.description}
                  </p>
                </div>

                {/* Highlights Grid */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {project.highlights.map((h, i) => (
                      <div key={i} className="flex gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                         <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            <HiCheckCircle className="w-8 h-8" />
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-navy mb-2" style={{ color: 'var(--color-navy)' }}>Signature Feature</h4>
                            <p className="text-slate-500 font-bold">{h}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Video Tour */}
                {project.youtubeUrl && (project.youtubeUrl.includes('youtube.com') || project.youtubeUrl.includes('youtu.be')) && (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-navy">Cinematic Overview</h3>
                        <div className="flex-1 h-[1px] bg-slate-100 mx-8"></div>
                        <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest">
                           <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Virtual Tour
                        </div>
                    </div>
                    <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white group">
                      <iframe
                        src={project.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]}
                        title="Project Video"
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Information & Actions */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 animate-on-scroll" style={{ opacity: 0 }}>
              {/* Status & Category Card */}
              <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-50 text-center lg:text-left">
                <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Current Progress</p>
                <div className={`inline-flex items-center px-8 py-3 rounded-full border-2 text-xs font-black uppercase tracking-widest ${getStatusColor(project.status)} mb-10`}>
                  {getStatusLabel(project.status)}
                </div>

                <div className="space-y-8">
                   <div className="flex items-center justify-between py-6 border-b border-slate-50">
                      <span className="text-sm font-bold text-slate-400">INVESTMENT RANGE</span>
                      <div className="flex items-center text-3xl font-black text-navy" style={{ color: 'var(--color-navy)' }}>
                         <HiCurrencyRupee className="text-gold" style={{ color: 'var(--color-gold)' }} />
                         {project.price}
                      </div>
                   </div>
                   <div className="flex items-center justify-between py-6">
                      <span className="text-sm font-bold text-slate-400">ASSET SCALE</span>
                      <span className="text-lg font-black text-navy uppercase tracking-widest">{project.type} Venture</span>
                   </div>
                </div>

                <div className="mt-12 space-y-4">
                  <a href="tel:+919264175587" className="group w-full bg-navy text-white py-6 rounded-2xl flex items-center justify-center gap-4 font-black uppercase tracking-widest hover:bg-gold transition-all duration-500 shadow-xl" style={{ backgroundColor: 'var(--color-navy)' }}>
                    <HiPhone className="w-6 h-6" />
                    Reserve Consultation
                    <HiArrowSmRight className="w-6 h-6 transform -rotate-45 group-hover:rotate-0 transition-transform" />
                  </a>
                  <p className="text-[0.6rem] text-slate-400 font-bold uppercase tracking-widest text-center mt-4 italic">*Limited slots available for premium investors</p>
                </div>
              </div>

              {/* Amenities Mini-Grid */}
              {project.amenities && project.amenities.length > 0 && (
                <div className="bg-navy rounded-[2.5rem] p-10 shadow-2xl text-white overflow-hidden relative" style={{ backgroundColor: 'var(--color-navy)' }}>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
                  <h3 className="text-xl font-black mb-8 relative z-10">Signature Amenities</h3>
                  <div className="grid grid-cols-1 gap-4 relative z-10">
                    {project.amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-gold" style={{ backgroundColor: 'var(--color-gold)' }}></div>
                        <span className="text-sm font-bold tracking-tight">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Footer Navigation CTA */}
      <section className="container mx-auto px-6 py-32 mt-20 border-t border-slate-100">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black text-navy mb-12">Interested in this Architectural <span className="text-gold">Landmark?</span></h2>
            <div className="flex flex-wrap justify-center gap-6">
               <Link to="/contact" className="px-12 py-6 bg-gold text-navy rounded-2xl font-black uppercase tracking-widest hover:bg-navy hover:text-white transition-all shadow-2xl" style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}>Secure Priority Access</Link>
               <Link to="/projects" className="px-12 py-6 border-2 border-navy text-navy rounded-2xl font-black uppercase tracking-widest hover:bg-navy hover:text-white transition-all">Explore Entire Portfolio</Link>
            </div>
         </div>
      </section>

      {/* Global CSS for scroll reveal */}
      <style>{`
        .fade-in-up {
          animation: fadeInUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default ProjectDetails;
