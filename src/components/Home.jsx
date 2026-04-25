import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import HeroSlider from './HeroSlider';
import { API_URL } from '../apiConfig';

function Home() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('residential');
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
                    fetch(`${API_URL}/api/properties`),
                    fetch(`${API_URL}/api/projects`),
                    fetch(`${API_URL}/api/investments`)
                ]);

                const props = propsRes.ok ? await propsRes.json() : [];
                const projs = projsRes.ok ? await projsRes.json() : [];
                const invs = invsRes.ok ? await invsRes.json() : [];

                // Combine Residential properties and projects
                const resData = [
                    ...props.filter(p => p.propertyType === 'apartment' || p.propertyType === 'villa'),
                    ...projs.filter(p => p.type === 'residential')
                ];

                // Combine Commercial properties and projects
                const commData = [
                    ...props.filter(p => p.propertyType === 'commercial' || p.propertyType === 'plot'),
                    ...projs.filter(p => p.type === 'commercial')
                ];

                // Combine Investment properties, projects, and investments
                const investData = [
                    ...props.filter(p => p.propertyType === 'investment'),
                    ...projs.filter(p => p.type === 'investment'),
                    ...(invs.data || invs)
                ];

                setCategories({
                    residential: resData.slice(0, 4),
                    commercial: commData.slice(0, 4),
                    investments: investData.slice(0, 4),
                    projects: projs.slice(0, 4) // Keep general projects tab too
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

    const CategorySection = ({ title, subtitle, data, link, dark = false, description }) => {
        if (!data || data.length === 0) return null;

        return (
            <section className="section-padding" style={{ backgroundColor: dark ? '#f8f9fa' : 'white' }}>
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">{subtitle}</span>
                        <h2>{title}</h2>
                        <div className="divider mx-auto"></div>
                        {description && <p className="section-desc">{description}</p>}
                    </div>

                    <div className="property-grid">
                        {data.map((item, idx) => (
                            <PropertyCard key={item._id || idx} property={item} />
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to={link} className="btn btn-primary" style={{ padding: '12px 40px' }}>
                            Explore All {title}
                        </Link>
                    </div>
                </div>
            </section>
        );
    };

    return (
        <main>
            <HeroSlider />

            {/* Visual Category Navigation - 'Shop' Card Presentation */}
            <section className="section-padding bg-white" id="category-navigation">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">Our Expertise</span>
                        <h2>Shop By Category</h2>
                        <div className="divider mx-auto"></div>
                    </div>

                    <div className="category-card-grid">
                        {[
                            { id: 'residential', label: 'Residential', icon: 'fa-home', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070' },
                            { id: 'projects', label: 'Signature Projects', icon: 'fa-building', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070' },
                            { id: 'commercial', label: 'Commercial & Land', icon: 'fa-city', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069' },
                            { id: 'investments', label: 'Investment Assets', icon: 'fa-chart-line', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073' }
                        ].map(cat => (
                            <div 
                                key={cat.id} 
                                className={`category-nav-card ${activeTab === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(cat.id)}
                            >
                                <div className="cat-card-overlay"></div>
                                <img src={cat.img} alt={cat.label} className="cat-card-img" />
                                <div className="cat-card-content">
                                    <i className={`fas ${cat.icon}`}></i>
                                    <h3>{cat.label}</h3>
                                    <span className="cat-card-btn">View {cat.label} Collection</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Property Grid (The 'Shop' View) */}
                    <div className="property-grid animate-fade-in" key={activeTab} style={{ marginTop: '60px' }}>
                        {categories[activeTab]?.slice(0, 4).map((item, idx) => (
                            <PropertyCard key={item._id || idx} property={item} />
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <Link 
                            to={activeTab === 'investments' ? '/investment' : `/${activeTab}`} 
                            className="btn btn-primary" 
                            style={{ padding: '14px 50px', borderRadius: '50px', boxShadow: 'var(--shadow-md)' }}
                        >
                            Explore All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <i className="fas fa-arrow-right" style={{ marginLeft: '10px' }}></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Residential Section */}
            <CategorySection
                title="Residential Properties"
                subtitle="Luxury Living"
                data={categories.residential}
                link="/residential"
                dark={true}
                description="Discover your perfect property from our extensive collection of residential spaces defined by excellence."
            />

            <CategorySection
                title="Upcoming Projects"
                subtitle="Signature Portfolio"
                data={categories.projects}
                link="/projects"
                description="Discover our premium residential and commercial projects elegantly designed to meet your discerning lifestyle needs."
            />

            {/* Commercial Section */}
            <CategorySection
                title="Commercial Properties"
                subtitle="Prime Business Locations"
                data={categories.commercial}
                link="/commercial"
                dark={true}
                description="Explore prime commercial locations and plots designed for business growth and strategic investment."
            />

            {/* Investments Section */}
            <CategorySection
                title="Investment Opportunities"
                subtitle="High Yield Assets"
                data={categories.investments}
                link="/investment"
                description="Curated premium assets and commercial spaces designed to deliver exceptional returns and long-term capital appreciation."
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
            <section className="section-padding" style={{ textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <div className="section-header text-center" style={{ marginTop: '20px' }}>
                        <span className="subtitle">Welcome</span>
                        <h2>Find Your Next Address With Us</h2>
                        <div className="divider mx-auto"></div>
                        <p className="section-desc">Explore our top-tier properties, comprehensive services, and learn about our prestigious legacy.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
