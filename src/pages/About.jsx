import { useEffect } from 'react';

function About() {
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on page mount
    }, []);

    return (
        <main style={{ paddingTop: '80px' }}>
            <section className="about section-padding" id="about">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-content">
                            <span className="subtitle">About TRX</span>
                            <h2>Trusted Excellence Since 2016</h2>
                            <div className="divider"></div>
                            <p>At <strong>The Realty Xperts (TRX)</strong>, we believe that every dream deserves the right address. Founded back in 2016, we have built a legacy on trust, transparency, and top-tier service.</p>
                            <p>Whether you&apos;re looking for an opulent residence, a commercial hub, or investment land, our expansive portfolio covers all business types to meet your exact needs.</p>
                            
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-num">8+</span>
                                    <span className="stat-text">Years Experience</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-num">1k+</span>
                                    <span className="stat-text">Properties Sold</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-num">100%</span>
                                    <span className="stat-text">Client Satisfaction</span>
                                </div>
                            </div>
                        </div>
                        <div className="about-image">
                            <div className="image-wrapper">
                                <div className="glass-panel">
                                    <h3>TRX</h3>
                                    <p>Excellence in Real Estate</p>
                                    <div className="accent-line"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default About;
