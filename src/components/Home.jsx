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

        // Fetch and categorize data from API
        const fetchData = async () => {
            try {
                const [propsRes, projsRes, invsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investments`)
                ]);

                const props = propsRes.ok ? await propsRes.json() : [];
                const projs = projsRes.ok ? await projsRes.json() : [];
                const invs = invsRes.ok ? await invsRes.json() : [];

                setCategories({
                    residential: props.filter(p => 
                        p.propertyType === 'apartment' || p.propertyType === 'villa'
                    ).slice(0, 4),
                    commercial: props.filter(p => 
                        p.propertyType === 'commercial' || p.propertyType === 'plot'
                    ).slice(0, 4),
                    projects: projs.slice(0, 4),
                    investments: invs.slice(0, 4)
                });
            } catch (err) {
                console.error("Home data fetch error:", err);
            }
        };

        fetchData();

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

    const PropertyCard = ({ item }) => {
        // Determine Link based on type
        const linkBase = item.landType ? 'investment' : (item.type && !item.propertyType) ? 'project' : 'property';
        const linkPath = `/${linkBase}/${item._id}`;
        
        return (
            <div className="property-card">
                <div className="card-img-wrapper">
                    <div className="status-badge" style={{ backgroundColor: 'var(--color-gold)', textTransform: 'capitalize' }}>
                        {item.status?.replace(/-/g, ' ') || 'Available'}
                    </div>
                    <img 
                        src={item.images?.[0] || `/assets/images/property_1.png`} 
                        alt={item.title || item.propertyName} 
                        className="card-img" 
                        onError={(e) => { e.target.src = '/assets/images/property_1.png' }}
                    />
                    <div className="price-tag">₹ {item.price?.toLocaleString() || item.totalPrice?.toLocaleString() || 'Price on Request'}</div>
                </div>
                <div className="card-content">
                    <h3 className="line-clamp-1">{item.propertyName || item.title || "Premium Property"}</h3>
                    <p className="location line-clamp-1">
                        <i className="fas fa-map-marker-alt"></i> {item.location} {item.city ? `, ${item.city}` : ''}
                    </p>
                    <div className="card-amenities">
                        {item.bedroom && <span><i className="fas fa-bed"></i> {item.bedroom} Bed</span>}
                        {item.area && <span><i className="fas fa-vector-square"></i> {item.area} {item.areaUnit || 'sq.ft'}</span>}
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

            <CategorySection 
                title="Upcoming Projects" 
                subtitle="Future Developments" 
                data={categories.projects} 
                link="/projects" 
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

            {/* About TRX Section */}
            <section className="section-padding" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="about-highlights-grid">
                        <div className="about-image-side section-header">
                            <div className="premium-image-container">
                                <img 
                                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop" 
                                    alt="Luxury Real Estate" 
                                    className="about-main-img"
                                    onError={(e) => { e.target.src = '/assets/images/about_trx.png' }}
                                />
                                <div className="experience-badge">
                                    <h4>8+</h4>
                                    <p>Years of Excellence</p>
                                </div>
                            </div>
                        </div>

                        <div className="about-content-side section-header">
                            <span className="subtitle" style={{ letterSpacing: '4px' }}>ABOUT REALTY XPERTS</span>
                            <h2 className="about-title">
                                Congruence | Consistency | Curator
                            </h2>
                            <h3 className="about-tagline">
                                Building Better Lives With Every Home
                            </h3>
                            <div className="divider"></div>
                            
                            <div className="about-text" style={{ textAlign: 'justify' }}>
                                <p>
                                    At <strong className="text-navy">The Realty Xperts</strong>, our zeal is to create milestones that meet universal eminence, exemplify the esteem of our organization, and are crafted on a legacy of belief traversed over centuries. We are steered by our foresightedness of <strong className="text-teal">‘Creating a better living’</strong> and trust that real estate transfigures lives. Any place you buy is a springboard for the desire and dreams, for living a flourishing and persuasive life.
                                </p>
                                <p>
                                    We have the adroitness to deliver both attribute and commitment, at an inimitable swiftness. By forging the magnificent worldwide confederation, and deploying the finest people and procedures, we generate the best benefits for our consumers beyond landscapes, markets, and customer tranche.
                                </p>
                                <p>
                                    As a family which makes presumably the long-lasting impact to our surroundings and the lives of our compeer, we perpetrate to act in the concern of each one of our peer. We are <strong>‘Creating a better living’</strong> in exceptionally furthermore mechanism than anyone can envisage.
                                </p>
                            </div>
                            
                            <div style={{ marginTop: '2.5rem' }}>
                                <Link to="/about" className="btn btn-primary">Learn Our Legacy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
