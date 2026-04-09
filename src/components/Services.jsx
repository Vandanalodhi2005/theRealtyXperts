import { useEffect } from 'react';

function Services() {
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on page load
    }, []);

    return (
        <main style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <section className="services section-padding" id="services">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">Our Expertise</span>
                        <h2>Comprehensive Real Estate Services</h2>
                        <div className="divider mx-auto"></div>
                        <p className="section-desc">We handle all aspects of real estate with unmatched professionalism.</p>
                    </div>
                    
                    <div className="service-grid">
                        <div className="service-card">
                            <div className="service-icon"><i className="fas fa-home"></i></div>
                            <h3>Residential Sales</h3>
                            <p>Find your perfect home or sell your property for maximum value with our expert agents.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon"><i className="fas fa-building"></i></div>
                            <h3>Commercial Properties</h3>
                            <p>Strategic locations and premium office spaces tailored for your business growth.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon"><i className="fas fa-map"></i></div>
                            <h3>Land & Plots</h3>
                            <p>Exclusive plots and land acquisitions for development or long-term investment.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Services;
