import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ready-to-move': return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' };
      case 'under-construction': return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' };
      case 'upcoming': return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
      case 'completed': return { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' };
      default: return { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ready-to-move': return 'Ready to Move';
      case 'under-construction': return 'Under Construction';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
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

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-navy)', marginBottom: '20px', fontWeight: '900' }}>Project Not Found</h1>
        <button onClick={() => navigate('/projects')} style={{ backgroundColor: 'var(--color-navy)', color: 'white', padding: '14px 40px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
          Back to Projects
        </button>
      </div>
    );
  }

  const statusStyle = getStatusStyle(project.status);

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
        {project.images && project.images.length > 0 && (
          <img
            src={project.images[0]}
            alt={project.title}
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
                <i className="fas fa-building" style={{ marginRight: '6px' }}></i>
                {project.type === 'residential' ? 'Residential' : 'Commercial'} Project
              </span>
              <span style={{
                backgroundColor: statusStyle.bg, color: statusStyle.color,
                padding: '6px 18px', borderRadius: '50px', fontSize: '0.75rem',
                fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px',
                border: `1px solid ${statusStyle.border}`
              }}>
                {getStatusLabel(project.status)}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '900', color: 'white',
              lineHeight: 1.15, marginBottom: '24px'
            }}>
              {project.title}
            </h1>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-map-marker-alt" style={{ color: 'var(--color-gold)' }}></i>
                {project.location}, {project.city}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-rupee-sign" style={{ color: 'var(--color-gold)' }}></i>
                {project.price}
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
            {project.images && project.images.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img
                    src={project.images[activeImage]}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s ease' }}
                  />
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage(i => (i - 1 + project.images.length) % project.images.length)}
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
                        onClick={() => setActiveImage(i => (i + 1) % project.images.length)}
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
                        {activeImage + 1} / {project.images.length}
                      </div>
                    </>
                  )}
                </div>

                {project.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto' }}>
                    {project.images.map((img, index) => (
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
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>About This Project</h2>
              </div>
              <p style={{ color: '#555', lineHeight: '1.9', fontSize: '1rem', margin: 0 }}>
                {project.description || 'No description available.'}
              </p>
            </div>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                  <div style={{ width: '4px', height: '32px', backgroundColor: 'var(--color-gold)', borderRadius: '2px' }}></div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>Key Highlights</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px' }}>
                  {project.highlights.map((h, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '14px',
                      padding: '18px 20px', backgroundColor: '#f8f9fa',
                      borderRadius: '12px', border: '1px solid #eee'
                    }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: 'rgba(5,150,105,0.1)', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <i className="fas fa-check" style={{ color: '#059669', fontSize: '0.8rem' }}></i>
                      </div>
                      <span style={{ color: '#333', fontWeight: '600', fontSize: '0.95rem', lineHeight: 1.5 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                  <div style={{ width: '4px', height: '32px', backgroundColor: 'var(--color-gold)', borderRadius: '2px' }}></div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-navy)', margin: 0 }}>Amenities</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {project.amenities.map((a, i) => (
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

            {/* YouTube Video */}
            {project.youtubeUrl && (project.youtubeUrl.includes('youtube.com') || project.youtubeUrl.includes('youtu.be')) && (
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
                    src={project.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]}
                    title="Project Video Tour"
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
                  {project.price}
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
                    {getStatusLabel(project.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: '600' }}>Type</span>
                  <span style={{ color: 'var(--color-navy)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'capitalize' }}>{project.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: '600' }}>Location</span>
                  <span style={{ color: 'var(--color-navy)', fontWeight: '700', fontSize: '0.9rem' }}>{project.city}</span>
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

      {/* Bottom CTA */}
      <section style={{ backgroundColor: 'var(--color-navy)', padding: '80px 20px', textAlign: 'center', marginTop: '20px' }}>
        <div className="container">
          <p style={{ color: 'var(--color-gold)', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '15px' }}>Interested in This Project?</p>
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
            <Link to="/projects" style={{
              backgroundColor: 'transparent', color: 'white',
              padding: '16px 40px', borderRadius: '12px', fontWeight: 'bold',
              textDecoration: 'none', fontSize: '0.95rem', display: 'inline-block',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              View All Projects
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default ProjectDetails;
