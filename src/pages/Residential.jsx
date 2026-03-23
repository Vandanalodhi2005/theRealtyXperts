import React, { useState, useEffect } from 'react';
import { MapPin, BedDouble, Square, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './public-sunrise.css';

const Residential = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const props = JSON.parse(localStorage.getItem('trx_properties') || '[]');
        const projs = JSON.parse(localStorage.getItem('trx_projects') || '[]');
        const invs = JSON.parse(localStorage.getItem('trx_investments') || '[]');
        
        const combined = [...props, ...projs, ...invs];
        
        // Filter for residential: type matches OR keyword matches
        const resData = combined.filter(p => 
            p.type === 'apartment' || 
            p.type === 'villa' || 
            p.type === 'residential' ||
            (p.title && p.title.toLowerCase().includes('residential')) ||
            (p.description && p.description.toLowerCase().includes('residential'))
        );
        
        setProperties(resData);
    }, []);

    return (
        <main>
            {/* Sunrise-style Dark Hero */}
            <section className="sunrise-hero">
                <h1>Premium <span className="gold-accent">Residential</span> Properties</h1>
                <p>Find your next dream home or premium apartment in the heart of the city.</p>
            </section>

            <section className="sunrise-container">
                {properties.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
                        <ShieldCheck size={48} style={{margin: '0 auto 1rem', opacity: 0.5}} />
                        <h2>No residential properties currently listed.</h2>
                        <p>Please check back later or contact us for off-market inventory.</p>
                    </div>
                ) : (
                    <div className="sunrise-grid">
                        {properties.map(prop => (
                            <div key={prop.id} className="sunrise-card">
                                <div className="sunrise-card-img-wrapper">
                                    <img 
                                        src={prop.coverImage || "/assets/images/property_1.png"} 
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
                                            <BedDouble size={18} /> {prop.bedrooms || 'N/A'} Beds
                                        </div>
                                        <div className="sunrise-feature">
                                            <Square size={18} /> {prop.area || 'N/A'} sq.ft
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

export default Residential;
