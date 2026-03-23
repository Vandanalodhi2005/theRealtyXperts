import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import './public-sunrise.css';

const Investment = () => {
    const [investments, setInvestments] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const props = JSON.parse(localStorage.getItem('trx_properties') || '[]');
        const projs = JSON.parse(localStorage.getItem('trx_projects') || '[]');
        const invs = JSON.parse(localStorage.getItem('trx_investments') || '[]');
        
        const combined = [...props, ...projs, ...invs];
        
        // Filter for investments
        const investmentData = combined.filter(p => 
            p.type === 'agricultural' || 
            p.type === 'investment' ||
            (p.title && p.title.toLowerCase().includes('investment')) ||
            (p.description && p.description.toLowerCase().includes('investment'))
        );
        
        setInvestments(investmentData);
    }, []);

    return (
        <main>
            <section className="sunrise-hero">
                <h1>High Yield <span className="gold-accent">Investments</span></h1>
                <p>Discover agricultural, land, and early-stage investment plots to maximize returns.</p>
            </section>

            <section className="sunrise-container">
                {investments.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '4rem', color: '#6b7280'}}>
                        <TrendingUp size={48} style={{margin: '0 auto 1rem', opacity: 0.5}} />
                        <h2>No investment portfolios published.</h2>
                    </div>
                ) : (
                    <div className="sunrise-grid">
                        {investments.map(inv => (
                            <div key={inv.id} className="sunrise-card">
                                <div className="sunrise-card-img-wrapper">
                                    <img 
                                        src={inv.coverImage || "/assets/images/invest_1.jpg"} 
                                        alt={inv.title} 
                                        className="sunrise-card-img" 
                                        onError={(e) => { e.target.onerror = null; if(!inv.coverImage) e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"; }}
                                    />
                                    <span className="sunrise-badge-left">{inv.type}</span>
                                    <span className="sunrise-badge-top">{inv.status}</span>
                                </div>
                                <div className="sunrise-card-content">
                                    <h3 className="sunrise-card-title">{inv.title}</h3>
                                    <div className="sunrise-card-location">
                                        <MapPin size={16} /> 
                                        {inv.location}
                                    </div>
                                    <div className="sunrise-card-price">{inv.price}</div>
                                    
                                    <div className="sunrise-card-features">
                                        <div className="sunrise-feature">
                                            <Square size={18} /> High ROI Potential
                                        </div>
                                    </div>
                                    
                                    <Link to={`/properties/${inv.id}`} className="sunrise-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
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

export default Investment;
