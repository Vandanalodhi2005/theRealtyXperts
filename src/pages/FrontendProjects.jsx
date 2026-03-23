import React, { useState, useEffect } from 'react';
import { MapPin, Building2, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';
import './public-sunrise.css';

const FrontendProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Fetch all data sources for Master List
        const props = JSON.parse(localStorage.getItem('trx_properties') || '[]');
        const projs = JSON.parse(localStorage.getItem('trx_projects') || '[]');
        const invs = JSON.parse(localStorage.getItem('trx_investments') || '[]');
        
        // Combine all items
        const combined = [...props, ...projs, ...invs];
        
        // Sort by ID (Date.now) descending to show newest first
        const sorted = combined.sort((a, b) => b.id - a.id);
        
        setProjects(sorted);
    }, []);

    return (
        <main>
            {/* Sunrise-style Light/Alt Header for Projects */}
            <section className="sunrise-hero" style={{backgroundColor: '#fafafa', color: '#111827', borderBottomColor: '#e5e7eb'}}>
                <h1>Our Core <span className="gold-accent">Projects</span></h1>
                <p style={{color: '#4b5563'}}>View our complete catalog of structural masterpieces and premium developments.</p>
            </section>

            <section className="sunrise-container">
                {projects.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
                        <Building2 size={48} style={{margin: '0 auto 1rem', opacity: 0.5}} />
                        <h2>No active projects found.</h2>
                    </div>
                ) : (
                    <div className="sunrise-grid">
                        {projects.map(proj => (
                            <div key={proj.id} className="sunrise-card">
                                <div className="sunrise-card-img-wrapper">
                                    <img 
                                        src={proj.coverImage || "/assets/images/project_1.jpg"} 
                                        alt={proj.title || "Project"} 
                                        className="sunrise-card-img" 
                                        onError={(e) => { e.target.onerror = null; if(!proj.coverImage) e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"; }}
                                    />
                                    <span className="sunrise-badge-left">{proj.type}</span>
                                    <span className="sunrise-badge-top" style={{backgroundColor: proj.status === 'completed' || proj.status === 'sold' ? '#10b981' : 'var(--color-gold)'}}>{proj.status}</span>
                                </div>
                                <div className="sunrise-card-content">
                                    <h3 className="sunrise-card-title">{proj.title || proj.propertyName || "Premium Project"}</h3>
                                    <div className="sunrise-card-location">
                                        <MapPin size={16} /> 
                                        {proj.location} {proj.city ? `, ${proj.city}` : ''}
                                    </div>
                                    <div className="sunrise-card-price" style={{fontSize: '1.25rem', color: '#111827', marginTop: '10px'}}>
                                        Price: <span className="gold-accent" style={{fontSize: '1.4rem', fontWeight: 700}}>{proj.price || 'Contact for price'}</span>
                                    </div>
                                    
                                    <div className="sunrise-card-features">
                                        {proj.bedrooms && (
                                            <div className="sunrise-feature">
                                                <Hammer size={18} /> {proj.bedrooms} Bedrooms
                                            </div>
                                        )}
                                        {proj.area && (
                                            <div className="sunrise-feature">
                                                <Building2 size={18} /> {proj.area} sq.ft
                                            </div>
                                        )}
                                    </div>
                                    
                                    <Link to={`/properties/${proj.id}`} className="sunrise-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default FrontendProjects;
