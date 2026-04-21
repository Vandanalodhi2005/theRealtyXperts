import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from './PropertyCard';

const Projects = ({ type = 'all' }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [type]);

  const fetchProjects = async () => {
    try {
      const url = type && type !== 'all' 
        ? `${import.meta.env.VITE_BACKEND_URL}/api/projects?type=${type}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/projects`;
        
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready-to-move': return 'bg-green-100 text-green-800';
      case 'under-construction': return 'bg-yellow-100 text-yellow-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px' }}>
      <section className="section-padding">
        <div className="container">
          {/* Header */}
          <div className="section-header text-center fade-in-up">
            <span className="subtitle">Signature Portfolio</span>
            <h2 className="capitalize">{type !== 'all' ? `${type} Projects` : 'Our Projects'}</h2>
            <div className="divider mx-auto"></div>
            <p className="section-desc">
              Discover our premium residential and commercial projects elegantly designed to meet your discerning lifestyle needs.
            </p>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="property-grid">
              {projects.map((project) => (
                 <PropertyCard key={project._id} property={project} />
              ))}
            </div>
          ) : (
            <div className="text-center section-padding fade-in-up">
               <i className="fas fa-building" style={{ fontSize: '4rem', color: 'var(--color-gray)', marginBottom: '20px' }}></i>
               <h3 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '10px' }}>No Projects Available Yet</h3>
               <p className="text-slate-500">We're adding new prestigious projects soon. Check back later or contact our advisory team.</p>
            </div>
          )}

          {/* CTA Section */}
          <section className="section-padding" style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-white)', textAlign: 'center', marginTop: '60px', borderRadius: '16px' }}>
             <div className="container fade-in-up">
                <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '15px' }}>Interested in Our Projects?</h2>
                <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px', opacity: '0.9' }}>
                  Get detailed priority information about our ongoing and upcoming signature projects before they hit the open market.
                </p>
                <Link to="/contact" className="btn btn-secondary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                  Get Priority Access
                </Link>
             </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Projects;