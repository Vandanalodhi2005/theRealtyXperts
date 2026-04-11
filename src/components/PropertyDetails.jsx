import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft, HiLocationMarker, HiCurrencyRupee, HiHome, HiOfficeBuilding, HiMail, HiPhone, HiSparkles, HiShieldCheck, HiOutlineVariable, HiArrowSmRight } from 'react-icons/hi';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import PropertyCard from './PropertyCard';

// Inquiry Modal Component
const InquiryModal = ({ property, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in this ${property?.propertyType} in ${property?.location}, ${property?.city}. Please provide more details.`
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      toast.success('Inquiry sent successfully! We will contact you soon.');
      onClose();
    } catch (error) {
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-navy/95 backdrop-blur-xl flex items-center justify-center z-[1000] p-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] max-w-xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="p-10 md:p-14">
          <div className="text-center mb-10">
            <span className="subtitle" style={{ fontSize: '0.65rem', color: 'var(--color-gold)' }}>VIP CONSULTATION</span>
            <h2 className="text-4xl font-black text-navy mt-4" style={{ color: 'var(--color-navy)' }}>Direct Inquiry</h2>
            <div className="w-12 h-1 bg-gold mx-auto mt-4 rounded-full" style={{ backgroundColor: 'var(--color-gold)' }}></div>
          </div>
          
          <div className="mb-10 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex gap-6 items-center">
             <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                <img src={property?.images?.[0]} alt="Property" className="w-full h-full object-cover" />
             </div>
             <div>
                <h3 className="font-black text-navy text-base leading-tight" style={{ color: 'var(--color-navy)' }}>{property?.propertyName || `${property?.bedroom} BHK ${property?.propertyType}`}</h3>
                <p className="text-xs text-slate-400 font-bold mt-1">{property?.location}, {property?.city}</p>
                <p className="text-xl font-black text-gold mt-2" style={{ color: 'var(--color-gold)' }}>₹{property?.price?.toLocaleString()}</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all font-medium text-navy"
                    required
                  />
               </div>
               <div>
                  <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all font-medium text-navy"
                    required
                  />
               </div>
            </div>

            <div>
              <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Email Identity</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all font-medium text-navy"
                required
              />
            </div>

            <div>
              <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Personal Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all font-medium text-navy"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                type="button"
                onClick={onClose}
                className="order-2 sm:order-1 flex-1 px-8 py-5 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="order-1 sm:order-2 flex-[2] px-8 py-5 bg-navy text-white rounded-2xl hover:bg-gold transition-all duration-500 font-black text-xs uppercase tracking-[0.3em] shadow-2xl disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-navy)' }}
              >
                {loading ? 'Transmitting...' : 'Send Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

InquiryModal.propTypes = {
  property: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (property) {
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
    }
  }, [property]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
        fetchRelatedProperties(data);
      } else {
        toast.error('Property not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Error loading property details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProperties = async (currentProp) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`);
      if (response.ok) {
        const allProps = await response.json();
        const related = allProps
          .filter(p => p._id !== currentProp._id)
          .filter(p => p.propertyType === currentProp.propertyType || p.city === currentProp.city)
          .slice(0, 3);
        setRelatedProperties(related);
      }
    } catch (error) {
      console.error('Error fetching related properties:', error);
    } finally {
      setRelatedLoading(false);
    }
  };

  const handleInquirySubmit = async (inquiryData) => {
    const inquiryPayload = {
      ...inquiryData,
      propertyId: property._id,
      propertyTitle: property.propertyName || `${property.bedroom} BHK ${property.propertyType}`
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryPayload),
    });

    if (!response.ok) {
      throw new Error('Failed to send inquiry');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center" style={{ backgroundColor: 'var(--color-navy)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent animate-spin rounded-full mx-auto mb-6" style={{ borderColor: 'rgba(198, 156, 109, 0.2)', borderTopColor: 'var(--color-gold)' }}></div>
          <p className="text-white/50 uppercase tracking-[0.4em] text-[0.6rem] font-black">Syncing Portfolio...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-light flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-black text-navy mb-4">Property Not Found</h1>
        <button onClick={() => navigate('/')} className="btn btn-primary">Return to Collection</button>
      </div>
    );
  }

  return (
    <main className="property-details-wrapper bg-[#FDFDFD]">
      {/* Cinematic Hero Section */}
      <section className="bg-navy relative overflow-hidden flex items-center justify-center py-32 lg:py-52" style={{ backgroundColor: 'var(--color-navy)' }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy z-10"></div>
          <img 
            src={property.images && property.images.length > 0 ? property.images[0] : ''} 
            alt="Background" 
            className="w-full h-full object-cover grayscale opacity-30 animate-ken-burns"
          />
        </div>
        <div className="container relative z-10 px-6 text-center animate-on-scroll" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-10">
             <HiSparkles className="text-gold" style={{ color: 'var(--color-gold)' }} />
             <span className="text-gold text-[0.65rem] font-black tracking-[0.4em] uppercase">{property.propertyType} | {property.status}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mt-4 mb-8 leading-tight tracking-tighter uppercase whitespace-pre-wrap">
            {property.propertyName || `${property.bedroom || ''} BHK ${property.propertyType}`}
          </h1>
          <div className="max-w-2xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50 mb-10"></div>
          <div className="flex items-center justify-center gap-4 text-white/70 font-bold text-xl">
            <HiLocationMarker className="text-gold" style={{ color: 'var(--color-gold)' }} />
            {property.location}, {property.city}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 -mt-24 relative z-40 pb-32">
        {/* Navigation Action */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-xl text-navy font-black text-xs tracking-widest hover:text-gold transition-all group mb-16 border border-slate-50">
          <HiArrowLeft className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform" />
          BACK TO PORTFOLIO
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Visuals & Specs */}
          <div className="lg:col-span-8 space-y-20">
            {/* Image Showcase */}
            <div className="bg-white rounded-[3rem] shadow-2xl border-8 border-white overflow-hidden group animate-on-scroll" style={{ opacity: 0 }}>
              <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={property.images[currentImageIndex]}
                      alt={property.propertyName || 'Property'}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {property.images.length > 1 && (
                      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
                          className="bg-white/90 backdrop-blur-md text-navy p-4 rounded-full hover:bg-gold hover:text-white transition-all shadow-2xl"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
                          className="bg-white/90 backdrop-blur-md text-navy p-4 rounded-full hover:bg-gold hover:text-white transition-all shadow-2xl"
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <HiHome className="w-32 h-32 text-slate-100" />
                )}
              </div>
              {property.images && property.images.length > 1 && (
                <div className="p-6 bg-white border-t border-slate-50">
                  <div className="flex gap-4 overflow-x-auto pb-2 px-2">
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`View ${index + 1}`}
                        className={`w-32 h-20 rounded-2xl flex-none object-cover cursor-pointer transition-all duration-300 border-4 ${
                          currentImageIndex === index 
                            ? 'border-gold scale-110 shadow-lg' 
                            : 'border-white opacity-50 hover:opacity-100'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Structured Details */}
            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-50 p-10 md:p-20 animate-on-scroll" style={{ opacity: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div>
                  <span className="subtitle block mb-4" style={{ fontSize: '0.7rem' }}>ASSET DEFINITION</span>
                  <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight" style={{ color: 'var(--color-navy)' }}>
                    Exclusive Luxury {property.propertyType}
                  </h2>
                  <div className="w-16 h-1.5 bg-gold mt-8 rounded-full"></div>
                </div>
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border-l-8 border-gold shadow-sm flex flex-col justify-center gap-2" style={{ borderColor: 'var(--color-gold)' }}>
                  <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Global Valuation</span>
                  <div className="text-5xl font-black text-navy" style={{ color: 'var(--color-navy)' }}>
                    ₹{property.price?.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* High-Performance Icons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 bg-slate-50 p-4 rounded-[2.5rem]">
                {[
                  { icon: HiHome, label: 'Type', val: property.propertyType, color: 'text-emerald-500' },
                  { icon: HiOfficeBuilding, label: 'Space', val: `${property.area} sq.ft`, color: 'text-blue-500' },
                  { icon: HiOutlineVariable, label: 'Rooms', val: `${property.bedroom} BHK`, color: 'text-gold' },
                  { icon: HiCurrencyRupee, label: 'Intent', val: property.transaction, color: 'text-purple-500' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2rem] text-center border border-slate-100 hover:shadow-xl transition-all">
                    <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} />
                    <p className="text-[0.6rem] font-black text-slate-300 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-lg font-black text-navy uppercase truncate" style={{ color: 'var(--color-navy)' }}>{stat.val}</p>
                  </div>
                ))}
              </div>

              {/* Multimedia & Narrative */}
              <div className="space-y-20">
                {property.youtubeUrl && (property.youtubeUrl.includes('youtube.com') || property.youtubeUrl.includes('youtu.be')) && (
                  <div>
                    <h2 className="text-2xl font-black text-navy mb-10 flex items-center gap-4">
                       <span className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                       </span>
                       Cinematic Tour
                    </h2>
                    <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                      <iframe
                        src={property.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]}
                        title="Tour"
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 capitalize font-black">
                  <div>
                    <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-navy">Asset Description</h3>
                    <p className="text-slate-500 leading-relaxed font-bold border-l-4 border-slate-100 pl-8 capitalize">{property.propertyDescription}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-navy">Global Specs</h3>
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         { l: 'Asset ID', v: property._id?.slice(-8).toUpperCase() },
                         { l: 'Age', v: property.propertyAge || 'Prime' },
                         { l: 'Furnishing', v: property.furnishing || 'Standard' },
                         { l: 'Listing Date', v: new Date(property.createdAt).toLocaleDateString() }
                       ].map((spec, i) => (
                         <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50">
                            <span className="text-[0.6rem] text-slate-400 font-bold uppercase">{spec.l}</span>
                            <span className="text-sm text-navy">{spec.val || spec.v}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-black mb-10 text-navy uppercase tracking-widest">Premium Amenities</h3>
                    <div className="flex flex-wrap gap-4">
                      {property.amenities.map((a, i) => (
                        <div key={i} className="px-8 py-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 hover:border-gold transition-colors shadow-sm">
                           <HiShieldCheck className="text-emerald-500 w-6 h-6" />
                           <span className="text-sm font-black text-navy uppercase">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-10">
            {/* Conversion Card */}
            <div className="bg-navy rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group" style={{ backgroundColor: 'var(--color-navy)' }}>
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
               
               <span className="text-gold font-black tracking-[0.4em] uppercase text-[0.6rem] mb-6 block" style={{ color: 'var(--color-gold)' }}>SECURE TRANSACTION</span>
               <h3 className="text-4xl font-black mb-8 leading-tight">Initiate Acquisition</h3>
               <p className="text-white/50 mb-12 font-medium leading-relaxed italic border-l border-white/10 pl-6 text-sm">
                 Connect with our executive planners to receive the full prospectus of this luxury asset.
               </p>

               <button
                 onClick={() => setShowInquiryModal(true)}
                 className="w-full bg-gold text-navy py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group/btn"
                 style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
               >
                 <HiMail className="w-7 h-7" />
                 Inquire via VIP Channel
                 <HiArrowSmRight className="w-6 h-6 transform -rotate-45 group-hover/btn:rotate-0 transition-transform" />
               </button>

               <div className="grid grid-cols-2 gap-4 mt-10">
                  <a href="tel:+919264175587" className="bg-white/10 p-5 rounded-2xl flex flex-col items-center gap-3 border border-white/5 hover:bg-white/20 transition-all">
                     <HiPhone className="w-6 h-6 text-gold" style={{ color: 'var(--color-gold)' }} />
                     <span className="text-[0.6rem] font-black uppercase tracking-widest">Call Expert</span>
                  </a>
                  <a href="https://wa.me/919264175587" target="_blank" rel="noreferrer" className="bg-[#25D366]/10 p-5 rounded-2xl flex flex-col items-center gap-3 border border-[#25D366]/20 hover:bg-[#25D366] transition-all group/wa">
                     <svg className="w-6 h-6 text-[#25D366] group-hover/wa:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                     <span className="text-[0.6rem] font-black uppercase tracking-widest group-hover/wa:text-white">WhatsApp</span>
                  </a>
               </div>
            </div>

            {/* Credibility Sidebar */}
            <div className="bg-white rounded-[3rem] p-12 border border-slate-50 shadow-xl overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <HiShieldCheck size={100} />
               </div>
               <span className="text-gold font-black uppercase text-[0.6rem] tracking-widest mb-8 block">PLATINUM ASSURANCE</span>
               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="text-5xl font-black text-navy" style={{ color: 'var(--color-navy)' }}>15+</div>
                     <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest leading-tight">Years Industry <br/>Leadership</div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-5xl font-black text-gold" style={{ color: 'var(--color-gold)' }}>50k+</div>
                     <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest leading-tight">Satisfied <br/>Global Clients</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Global Related Section */}
        {relatedProperties.length > 0 && (
          <div className="mt-40">
             <div className="flex items-end justify-between mb-20">
                <div>
                   <span className="text-gold font-black uppercase text-[0.65rem] tracking-[0.4em] mb-4 block">Recommended Asset</span>
                   <h2 className="text-5xl font-black text-navy leading-tight uppercase tracking-tighter">You Might Also <span className="text-gold">Admire</span></h2>
                </div>
                <Link to="/properties" className="hidden md:flex items-center gap-3 px-10 py-5 bg-white border border-slate-100 rounded-full font-black text-[0.65rem] tracking-widest hover:bg-navy hover:text-white transition-all shadow-xl">
                   FULL COLLECTION
                </Link>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {relatedProperties.map(p => <PropertyCard key={p._id} property={p} />)}
             </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <InquiryModal
          property={property}
          onClose={() => setShowInquiryModal(false)}
          onSubmit={handleInquirySubmit}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: ken-burns 30s infinite alternate ease-in-out;
        }
        .fade-in-up {
          animation: fadeInUp 1.2s cubic-bezier(0.2, 1, 0.2, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default PropertyDetails;