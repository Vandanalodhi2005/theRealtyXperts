import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyCard from './PropertyCard';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProperties, setRelatedProperties] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
        fetchRelatedProperties(data);
      } else {
        toast.error('Property not found');
        navigate('/properties');
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
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'available': return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' };
      case 'sold': return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' };
      case 'rented': return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
      default: return { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'sold': return 'Sold Out';
      case 'rented': return 'Rented';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-navy)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            border: '4px solid rgba(198,156,109,0.2)',
            borderTopColor: 'var(--color-gold)',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!property) return null;

  const statusStyle = getStatusStyle(property.status);
  const propertyTitle = property.propertyName || `${property.bedroom ? property.bedroom + ' BHK ' : ''}${property.propertyType}`;

  return (
    <main style={{ backgroundColor: '#f8f9fa' }}>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        backgroundColor: 'var(--color-navy)'
      }}>
        {property.images && property.images.length > 0 && (
          <img
            src={property.images[0]}
            alt={propertyTitle}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,28,58,1) 30%, rgba(10,28,58,0.5) 100%)' }}></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: '100px', left: '30px', zIndex: 10,
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)', color: 'white',
            padding: '10px 20px', borderRadius: '50px', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s'
          }}
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div style={{ position: 'relative', zIndex: 5, width: '100%', padding: '60px 40px 80px' }}>
          <div className="container">
            {/* Badges */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span style={{
                backgroundColor: 'rgba(198,156,109,0.2)', color: 'var(--color-gold)',
                padding: '6px 18px', borderRadius: '50px', fontSize: '0.75rem',
                fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px',
                border: '1px solid rgba(198,156,109,0.3)'
              }}>
                <i className="fas fa-home" style={{ marginRight: '6px' }}></i>
                {property.propertyType}
              </span>
              <span style={{
                backgroundColor: statusStyle.bg, color: statusStyle.color,
                padding: '6px 18px', borderRadius: '50px', fontSize: '0.75rem',
                fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px',
                border: `1px solid ${statusStyle.border}`
              }}>
                {getStatusLabel(property.status)}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '900', color: 'white',
              lineHeight: 1.15, marginBottom: '24px'
            }}>
              {propertyTitle}
            </h1>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-map-marker-alt" style={{ color: 'var(--color-gold)' }}></i>
                {property.location}, {property.city}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-rupee-sign" style={{ color: 'var(--color-gold)' }}></i>
                ₹{property.price?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ padding: '60px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: '40px',
          alignItems: 'start'
        }}
        className="project-layout-grid"
        >

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* Image Gallery */}
            {property.images && property.images.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img
                    src={property.images[activeImage]}
                    alt={propertyTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s ease' }}
                  />
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage(i => (i - 1 + property.images.length) % property.images.length)}
                        style={{
                          position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
                          width: '44px', height: '44px', borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.2)', fontSize: '1rem', color: 'var(--color-navy)'
                        }}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button
                        onClick={() => setActiveImage(i => (i + 1) % property.images.length)}
                        style={{
                          position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                          width: '44px', height: '44px', borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.2)', fontSize: '1rem', color: 'var(--color-navy)'
                        }}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      <div style={{ position: 'absolute', bottom: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.55)', color: 'white', padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {activeImage + 1} / {property.images.length}
                      </div>
                    </>
                  )}
                </div>

                {property.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto' }}>
                    {property.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        style={{
                          flexShrink: 0, width: '90px', height: '65px', borderRadius: '10px',
                          overflow: 'hidden', padding: 0,
                          border: activeImage === index ? '3px solid var(--color-gold)' : '3px solid transparent',
                          cursor: 'pointer', transition: 'all 0.2s',
                          opacity: activeImage === index ? 1 : 0.6
                        }}
                      >
                        <img src={img} alt={`View ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* About Section */}
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '4px', height: '32px', backgroundColor: 'var(--color-gold)', borderRadius: '2px' }}></div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>About This Property</h2>
              </div>
              <p style={{ color: '#555', lineHeight: '1.9', fontSize: '1rem', margin: 0 }}>
                {property.propertyDescription || property.description || 'No description available.'}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                  <div style={{ width: '4px', height: '32px', backgroundColor: 'var(--color-gold)', borderRadius: '2px' }}></div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>Amenities</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {property.amenities.map((a, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 18px', backgroundColor: '#f8f9fa',
                      borderRadius: '10px', border: '1px solid #eee'
                    }}>
                      <i className="fas fa-star" style={{ color: 'var(--color-gold)', fontSize: '0.75rem', flexShrink: 0 }}></i>
                      <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube Video tour */}
            {property.youtubeUrl && (property.youtubeUrl.includes('youtube.com') || property.youtubeUrl.includes('youtu.be')) && (
              <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                  <div style={{ width: '4px', height: '32px', backgroundColor: '#ef4444', borderRadius: '2px' }}></div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>
                    <i className="fab fa-youtube" style={{ color: '#ef4444', marginRight: '10px' }}></i>
                    Video Tour
                  </h2>
                </div>
                <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/9' }}>
                  <iframe
                    src={property.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]}
                    title="Property Video Tour"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Sticky Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', position: 'sticky', top: '110px' }}>

            {/* Price & Info Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Investment Overview</p>

              {/* Price */}
              <div style={{ padding: '20px 0', borderBottom: '1px solid #f0f0f0', marginBottom: '20px' }}>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '5px', fontWeight: '600' }}>PRICE RANGE</p>
                <p style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-navy)', margin: 0 }}>
                  <i className="fas fa-rupee-sign" style={{ color: 'var(--color-gold)', marginRight: '4px', fontSize: '1.4rem' }}></i>
                  ₹{property.price?.toLocaleString()}
                </p>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: '600' }}>Status</span>
                  <span style={{
                    padding: '4px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 'bold',
                    backgroundColor: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`
                  }}>
                    {getStatusLabel(property.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: '600' }}>Type</span>
                  <span style={{ color: 'var(--color-navy)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'capitalize' }}>{property.propertyType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: '600' }}>Location</span>
                  <span style={{ color: 'var(--color-navy)', fontWeight: '700', fontSize: '0.9rem' }}>{property.city}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: '600' }}>Area</span>
                  <span style={{ color: 'var(--color-navy)', fontWeight: '700', fontSize: '0.9rem' }}>{property.area?.toLocaleString()} sq.ft</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a
                  href="tel:+919264175587"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    backgroundColor: 'var(--color-navy)', color: 'white',
                    padding: '16px', borderRadius: '12px', fontWeight: 'bold',
                    textDecoration: 'none', fontSize: '0.95rem', transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-phone-alt"></i>
                  Call Now
                </a>
                <Link
                  to="/contact"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    backgroundColor: 'var(--color-gold)', color: 'white',
                    padding: '16px', borderRadius: '12px', fontWeight: 'bold',
                    textDecoration: 'none', fontSize: '0.95rem', transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-envelope"></i>
                  Enquire Now
                </Link>
              </div>
            </div>

            {/* Contact Info Card */}
            <div style={{
              backgroundColor: 'var(--color-navy)', borderRadius: '20px', padding: '30px',
              color: 'white', boxShadow: '0 8px 30px rgba(10,28,58,0.2)'
            }}>
              <h3 style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem', marginBottom: '20px' }}>
                <i className="fas fa-headset" style={{ color: 'var(--color-gold)', marginRight: '10px' }}></i>
                Need Assistance?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(198,156,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-phone" style={{ color: 'var(--color-gold)' }}></i>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase' }}>Phone</p>
                    <a href="tel:+919264175587" style={{ color: 'white', fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem' }}>926-417-5587</a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(198,156,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-envelope" style={{ color: 'var(--color-gold)' }}></i>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase' }}>Email</p>
                    <a href="mailto:emailtotrx@gmail.com" style={{ color: 'white', fontWeight: '700', textDecoration: 'none', fontSize: '0.85rem' }}>emailtotrx@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Assets */}
      {relatedProperties.length > 0 && (
        <section style={{ backgroundColor: 'white', padding: '80px 20px', borderTop: '1px solid #f0f0f0' }}>
          <div className="container">
             <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Recommended Assets</span>
                <h2 style={{ color: 'var(--color-navy)', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>You Might Also Admire</h2>
                <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--color-gold)', margin: '20px auto' }}></div>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {relatedProperties.map(p => (
                  <PropertyCard key={p._id} property={p} />
                ))}
             </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section style={{ backgroundColor: 'var(--color-navy)', padding: '80px 20px', textAlign: 'center' }}>
        <div className="container">
          <p style={{ color: 'var(--color-gold)', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '15px' }}>Interested in This Property?</p>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '900', marginBottom: '30px' }}>
            Get in Touch with Our Experts
          </h2>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{
              backgroundColor: 'var(--color-gold)', color: 'white',
              padding: '16px 40px', borderRadius: '12px', fontWeight: 'bold',
              textDecoration: 'none', fontSize: '0.95rem', display: 'inline-block'
            }}>
              Contact Us
            </Link>
            <Link to="/properties" style={{
              backgroundColor: 'transparent', color: 'white',
              padding: '16px 40px', borderRadius: '12px', fontWeight: 'bold',
              textDecoration: 'none', fontSize: '0.95rem', display: 'inline-block',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Responsive Styles */}
    </main>
  );
};

export default PropertyDetails;