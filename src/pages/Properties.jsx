import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Properties() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Load properties from shared state
        const saved = localStorage.getItem('trx_properties');
        if (saved) {
            setProperties(JSON.parse(saved));
        }

        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // We need a slight timeout because React's rendering of dynamic lists might happen after the observer is attached.
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('.property-card');
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.animationPlayState = 'paused';
                fadeObserver.observe(el);
            });
        }, 100);

        return () => fadeObserver.disconnect();
    }, []);

    return (
        <main style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <section className="properties section-padding" id="properties">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">Discover</span>
                        <h2>Premium Listed Properties</h2>
                        <div className="divider mx-auto"></div>
                        <p className="section-desc">Browse our exclusive catalog of residential, commercial, and land properties.</p>
                    </div>

                    <div className="property-grid">
                        {properties.length === 0 ? (
                            <p className="text-center" style={{ width: '100%', padding: '3rem 0', color: 'var(--color-dark-gray)' }}>
                                No properties available at the moment. Please check back later!
                            </p>
                        ) : properties.map((prop, idx) => (
                            <div className="property-card" key={prop.id || idx}>
                                <div className="card-img-wrapper">
                                    <div className="status-badge" style={{ 
                                        backgroundColor: prop.status === 'sold' ? 'var(--color-navy)' : 'var(--color-gold)' 
                                    }}>
                                        {prop.status === 'rented' ? 'For Rent' : prop.status === 'sold' ? 'Sold' : 'For Sale'}
                                    </div>
                                    <img src={prop.coverImage || `/assets/images/property_${(idx % 3) + 1}.png`} alt={prop.title} className="card-img" />
                                    <div className="price-tag" style={{ fontSize: '1.2rem' }}>{prop.price || 'Contact for Price'}</div>
                                </div>
                                <div className="card-content">
                                    <h3>{prop.title}</h3>
                                    <p className="location"><i className="fas fa-map-marker-alt"></i> {prop.location} {prop.city ? `, ${prop.city}` : ''}</p>
                                    
                                    <div className="card-amenities" style={{ flexWrap: 'wrap', gap: '10px' }}>
                                        {prop.type && (
                                            <span style={{textTransform: 'capitalize'}}><i className="fas fa-building"></i> {prop.type}</span>
                                        )}
                                        {prop.bedrooms && (
                                            <span><i className="fas fa-bed"></i> {prop.bedrooms} Bed</span>
                                        )}
                                        {prop.area && (
                                            <span><i className="fas fa-vector-square"></i> {prop.area} sqft</span>
                                        )}
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Link to={`/properties/${prop.id || idx}`} className="btn btn-outline-primary btn-full">View Details</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Properties;
