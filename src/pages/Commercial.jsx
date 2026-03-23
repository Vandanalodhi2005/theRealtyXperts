import React, { useState, useEffect } from 'react';
import { MapPin, Square, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import './public-sunrise.css';

const Commercial = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const props = JSON.parse(localStorage.getItem('trx_properties') || '[]');
        const projs = JSON.parse(localStorage.getItem('trx_projects') || '[]');
        const invs = JSON.parse(localStorage.getItem('trx_investments') || '[]');
        
        const combined = [...props, ...projs, ...invs];
        
        // Filter for commercial: type matches OR keyword matches
        const comData = combined.filter(p => 
            p.type === 'commercial' || 
            p.type === 'plot' || 
            (p.title && p.title.toLowerCase().includes('commercial')) ||
            (p.description && p.description.toLowerCase().includes('commercial'))
        );
        
        setProperties(comData);
    }, []);

    return (
        <main>
            <section className="sunrise-hero">
                <h1>Exclusive <span className="gold-accent">Commercial</span> Spaces</h1>
                <p>Secure the perfect location to scale your business operations and footprint.</p>
            </section>

            <section className="sunrise-container">
                {properties.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
                        <Briefcase size={48} style={{margin: '0 auto 1rem', opacity: 0.5}} />
                        <h2>No commercial properties currently listed.</h2>
                        <p>We are constantly acquiring new spaces. Reach out for direct inquiries.</p>
                    </div>
                ) : (
                    <div className="sunrise-grid">
                        {properties.map(prop => (
                            <div key={prop.id} className="sunrise-card">
                                <div className="sunrise-card-img-wrapper">
                                    <img 
                                        src={prop.coverImage || "/assets/images/property_2.png"} 
                                        alt={prop.title} 
                                        className="sunrise-card-img" 
                                    />
                                    <span className="sunrise-badge-left">{prop.type}</span>
                                    <span className="sunrise-badge-top">{prop.status}</span>
                                </div>
                                <div className="sunrise-card-content">
                                    <h3 className="sunrise-card-title">{prop.title}</h3>
                                    <div className="sunrise-card-location">
                                        <MapPin size={16} /> 
                                        {prop.location}
                                    </div>
                                    <div className="sunrise-card-price">{prop.price}</div>
                                    
                                    <div className="sunrise-card-features">
                                        <div className="sunrise-feature">
                                            <Square size={18} /> Area: {prop.area || 'N/A'} sq.ft
                                        </div>
                                    </div>
                                    
                                    <Link to={`/properties/${prop.id}`} className="sunrise-btn">
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

export default Commercial;
