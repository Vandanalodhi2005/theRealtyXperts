import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState({
        residential: [],
        commercial: [],
        projects: [],
        investments: []
    });

    useEffect(() => {
        // Observer for animations
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

        const animatedElements = document.querySelectorAll('.section-header, .property-card, .service-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.animationPlayState = 'paused';
            fadeObserver.observe(el);
        });

        // Fetch and categorize data
        const props = JSON.parse(localStorage.getItem('trx_properties') || '[]');
        const projs = JSON.parse(localStorage.getItem('trx_projects') || '[]');
        const invs = JSON.parse(localStorage.getItem('trx_investments') || '[]');

        const combined = [...props, ...projs, ...invs];

        setCategories({
            residential: combined.filter(p => 
                p.type === 'apartment' || p.type === 'villa' || p.type === 'residential' ||
                (p.title && p.title.toLowerCase().includes('residential'))
            ).slice(0, 4),
            commercial: combined.filter(p => 
                p.type === 'commercial' || p.type === 'plot' || 
                (p.title && p.title.toLowerCase().includes('commercial'))
            ).slice(0, 4),
            projects: combined.slice(0, 4), // Master projects/latest
            investments: combined.filter(p => 
                p.type === 'agricultural' || p.type === 'investment' ||
                (p.title && p.title.toLowerCase().includes('investment'))
            ).slice(0, 4)
        });

        return () => fadeObserver.disconnect();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('.search-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Searching...';
        btn.style.opacity = '0.7';
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.opacity = '1';
            navigate('/properties');
        }, 800);
    };

    const PropertyCard = ({ item, type }) => {
        // Determine Link based on type
        const linkPath = `/properties/${item.id}`;
        
        return (
            <div className="property-card">
                <div className="card-img-wrapper">
                    <div className="status-badge" style={{ backgroundColor: 'var(--color-gold)', textTransform: 'capitalize' }}>
                        {item.status || 'Available'}
                    </div>
                    <img 
                        src={item.coverImage || `/assets/images/property_${Math.floor(Math.random() * 3) + 1}.png`} 
                        alt={item.title} 
                        className="card-img" 
                        onError={(e) => { e.target.src = '/assets/images/property_1.png' }}
                    />
                    <div className="price-tag">{item.price || 'Price on Request'}</div>
                </div>
                <div className="card-content">
                    <h3>{item.title || item.propertyName || "Premium Property"}</h3>
                    <p className="location">
                        <i className="fas fa-map-marker-alt"></i> {item.location} {item.city ? `, ${item.city}` : ''}
                    </p>
                    <div className="card-amenities">
                        {item.bedrooms && <span><i className="fas fa-bed"></i> {item.bedrooms} Bed</span>}
                        {item.area && <span><i className="fas fa-vector-square"></i> {item.area} sqft</span>}
                    </div>
                </div>
                <div className="card-footer">
                    <Link to={linkPath} className="btn btn-outline-primary btn-full">View Details</Link>
                </div>
            </div>
        );
    };

    const CategorySection = ({ title, subtitle, data, link, dark = false }) => {
        if (!data || data.length === 0) return null;
        
        return (
            <section className="section-padding" style={{ backgroundColor: dark ? '#f8f9fa' : 'white' }}>
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">{subtitle}</span>
                        <h2>{title}</h2>
                        <div className="divider mx-auto"></div>
                    </div>
                    
                    <div className="property-grid">
                        {data.map((item, idx) => (
                            <PropertyCard key={item.id || idx} item={item} />
                        ))}
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to={link} className="btn btn-primary" style={{ padding: '12px 40px' }}>See More</Link>
                    </div>
                </div>
            </section>
        );
    };

    return (
        <main>
            <section className="hero" id="home">
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1 className="fade-in-up">Where Dreams <br/> Meet Addresses</h1>
                    <p className="fade-in-up delay-1">Premium real estate services. Established in 2016.</p>
                    
                    <div className="search-bar-container fade-in-up delay-2">
                        <form className="search-form" onSubmit={handleSearchSubmit}>
                            <div className="search-input">
                                <i className="fas fa-search"></i>
                                <input type="text" placeholder="Search by location, property type..." />
                            </div>
                            <div className="search-divider"></div>
                            <div className="search-select">
                                <select defaultValue="">
                                    <option value="" disabled>Property Type</option>
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="land">Land/Plots</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-secondary search-btn">Search Property</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Residential Section */}
            <CategorySection 
                title="Premium Residential" 
                subtitle="Luxury Living" 
                data={categories.residential} 
                link="/residential" 
                dark={true}
            />

            {/* Projects Section */}
            <CategorySection 
                title="Upcoming Projects" 
                subtitle="Future Developments" 
                data={categories.projects} 
                link="/frontend-projects" 
            />

            {/* Commercial Section */}
            <CategorySection 
                title="Commercial & Land" 
                subtitle="Prime Business Locations" 
                data={categories.commercial} 
                link="/commercial" 
                dark={true}
            />

            {/* Investments Section */}
            <CategorySection 
                title="Investments" 
                subtitle="Agricultural & Plots" 
                data={categories.investments} 
                link="/investment" 
            />

            {/* Welcome/Bottom Section */}
            <section className="section-padding" style={{textAlign: 'center', backgroundColor: '#f8f9fa'}}>
                <div className="container">
                    <div className="section-header text-center" style={{ marginTop: '20px' }}>
                        <span className="subtitle">Welcome</span>
                        <h2>Find Your Next Address With Us</h2>
                        <div className="divider mx-auto"></div>
                        <p className="section-desc">Explore our top-tier properties, comprehensive services, and learn about our prestigious legacy.</p>
                    </div>

                    <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <Link to="/properties" className="btn btn-primary">View All Properties</Link>
                        <Link to="/services" className="btn btn-outline-primary">Our Services</Link>
                        <Link to="/about" className="btn btn-outline-primary">About Us</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;
