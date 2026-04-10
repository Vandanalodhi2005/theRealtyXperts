import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function About() {
    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Trigger animations on scroll
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main className="about-page-wrapper">
            {/* Hero Section */}
            <section className="about-hero" style={{
                height: '50vh',
                minHeight: '400px',
                backgroundImage: "linear-gradient(rgba(10, 28, 58, 0.85), rgba(10, 28, 58, 0.85)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                paddingTop: '80px'
            }}>
                <div className="container" style={{ opacity: 0 }} className="animate-on-scroll">
                    <span className="subtitle" style={{ color: 'var(--color-gold)', letterSpacing: '6px' }}>ESTABLISHED 2016</span>
                    <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1rem' }}>Our Legacy of Trust</h1>
                    <div className="divider mx-auto" style={{ background: 'var(--color-gold)' }}></div>
                </div>
            </section>

            {/* Quick Stats Bar */}
            <section style={{ backgroundColor: 'var(--color-navy)', color: 'white', padding: '40px 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--color-gold)', fontSize: '2.5rem', marginBottom: '5px' }}>8+</h2>
                            <p style={{ opacity: 0.8, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Years Experience</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--color-gold)', fontSize: '2.5rem', marginBottom: '5px' }}>1500+</h2>
                            <p style={{ opacity: 0.8, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Happy Families</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--color-gold)', fontSize: '2.5rem', marginBottom: '5px' }}>50+</h2>
                            <p style={{ opacity: 0.8, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Expert Consultants</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--color-gold)', fontSize: '2.5rem', marginBottom: '5px' }}>100%</h2>
                            <p style={{ opacity: 0.8, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Transparency</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Story */}
            <section className="section-padding" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="about-highlights-grid">
                        <div className="animate-on-scroll">
                            <span className="subtitle">THE TRX STORY</span>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-navy)' }}>Eight Years of Redefining Real Estate</h2>
                            <div className="divider"></div>
                            <div style={{ fontSize: '1.1rem', color: 'var(--color-dark-gray)', lineHeight: '1.8' }}>
                                <p style={{ marginBottom: '20px' }}>
                                    At <strong className="text-navy">The Realty Xperts (TRX)</strong>, we believe that every dream deserves the right address. Since our inception in 2016, we have transitioned from a promising startup to a cornerstone of trust in the real estate landscape.
                                </p>
                                <p>
                                    Our journey is defined by a commitment to excellence that goes beyond mere transactions. We curate lifestyles, build investment legacies, and ensure that every square foot we represent meets the highest standards of quality and value.
                                </p>
                            </div>
                        </div>
                        <div className="animate-on-scroll">
                            <div className="premium-image-container">
                                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop" alt="Real Estate Excellence" className="about-main-img" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="section-padding" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <div className="section-header text-center animate-on-scroll">
                        <span className="subtitle">OUR PHILOSOPHY</span>
                        <h2>Congruence | Consistency | Curator</h2>
                        <div className="divider mx-auto"></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '50px' }}>
                        {/* Value 1 */}
                        <div className="service-card animate-on-scroll" style={{ textAlign: 'left', padding: '40px' }}>
                            <div className="service-icon" style={{ width: '60px', height: '60px', marginBottom: '25px' }}>
                                <i className="fas fa-handshake"></i>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>Congruence</h3>
                            <p style={{ color: 'var(--color-dark-gray)' }}>Alignment between our promises and our performance. We ensure every deal is transparent and every expectation is met with precision.</p>
                        </div>
                        {/* Value 2 */}
                        <div className="service-card animate-on-scroll" style={{ textAlign: 'left', padding: '40px' }}>
                            <div className="service-icon" style={{ width: '60px', height: '60px', marginBottom: '25px' }}>
                                <i className="fas fa-sync-alt"></i>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>Consistency</h3>
                            <p style={{ color: 'var(--color-dark-gray)' }}>High-quality service across every interaction. Our standards never waver, whether you are a first-time buyer or a seasoned investor.</p>
                        </div>
                        {/* Value 3 */}
                        <div className="service-card animate-on-scroll" style={{ textAlign: 'left', padding: '40px' }}>
                            <div className="service-icon" style={{ width: '60px', height: '60px', marginBottom: '25px' }}>
                                <i className="fas fa-gem"></i>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>Curator</h3>
                            <p style={{ color: 'var(--color-dark-gray)' }}>We don't just list properties; we hand-pick them. Only the most elite residences and high-yield investments enter the TRX portfolio.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="section-padding" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="about-highlights-grid" style={{ gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.2fr)' }}>
                        <div className="animate-on-scroll">
                            <div style={{ position: 'relative' }}>
                                <div style={{ 
                                    borderRadius: 'var(--radius-lg)', 
                                    overflow: 'hidden', 
                                    boxShadow: 'var(--shadow-lg)'
                                }}>
                                    <img src="/about/owner.jpeg" alt="Mr. Sanjeev Kumar" style={{ width: '100%', height: '550px', objectFit: 'cover', display: 'block' }} />
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    left: '30px',
                                    right: '30px',
                                    backgroundColor: 'rgba(10, 28, 58, 0.95)',
                                    padding: '20px',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'white',
                                    textAlign: 'center',
                                    backdropFilter: 'blur(5px)'
                                }}>
                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '2px' }}>Mr. Sanjeev Kumar</h3>
                                    <p style={{ color: 'var(--color-gold)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>CMD, The Realty Xperts</p>
                                </div>
                            </div>
                        </div>

                        <div className="animate-on-scroll">
                            <span className="subtitle">THE VISIONARY</span>
                            <h2 style={{ fontSize: '2.5rem' }}>Leading with 18+ Years of Insight</h2>
                            <div className="divider"></div>
                            <div style={{ fontSize: '1.05rem', color: 'var(--color-dark-gray)', lineHeight: '1.8' }}>
                                <p style={{ marginBottom: '20px' }}>
                                    <strong>Mr. Sanjeev Kumar</strong> is the force behind TRX's excellence. With nearly two decades of leadership roles at global giants like <strong>IBM, United Health Group, and Capgemini</strong>, he brings an unmatched corporate sophistication to the Indian real estate market.
                                </p>
                                <p style={{ marginBottom: '20px' }}>
                                    As an MBA in Operations and a Six Sigma White Belt, Sanjeev has institutionalized efficiency within TRX. His deep understanding of the Noida and NCR markets, combined with his strategic focus on client relationship management, ensures that TRX stands out as a professional beacon in a complex industry.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                                    <div className="stat-item" style={{ padding: '20px', border: '1px solid var(--color-gray)', borderRadius: 'var(--radius-md)' }}>
                                        <i className="fas fa-graduation-cap" style={{ color: 'var(--color-gold)', marginBottom: '10px', fontSize: '1.2rem' }}></i>
                                        <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)' }}>MBA Operations</h4>
                                        <p style={{ fontSize: '0.8rem' }}>Strategic Acumen</p>
                                    </div>
                                    <div className="stat-item" style={{ padding: '20px', border: '1px solid var(--color-gray)', borderRadius: 'var(--radius-md)' }}>
                                        <i className="fas fa-certificate" style={{ color: 'var(--color-gold)', marginBottom: '10px', fontSize: '1.2rem' }}></i>
                                        <h4 style={{ fontSize: '1rem', color: 'var(--color-navy)' }}>Six Sigma White Belt</h4>
                                        <p style={{ fontSize: '0.8rem' }}>Process Excellence</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Legacy / Capital Group Inspired Section */}
            <section className="section-padding" style={{ 
                backgroundImage: "linear-gradient(rgba(10, 28, 58, 0.96), rgba(10, 28, 58, 0.96)), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')",
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                color: 'white'
            }}>
                <div className="container">
                    <div className="section-header text-center animate-on-scroll">
                        <span className="subtitle" style={{ color: 'var(--color-gold)' }}>BUILDING BETTER LIVES</span>
                        <h2 style={{ color: 'white' }}>Our Enduring Commitment</h2>
                        <div className="divider mx-auto" style={{ background: 'var(--color-gold)' }}></div>
                    </div>

                    <div className="animate-on-scroll" style={{ maxWidth: '900px', margin: '40px auto 0', textAlign: 'center', fontSize: '1.1rem', lineHeight: '2', opacity: 0.9 }}>
                        <p style={{ marginBottom: '30px' }}>
                            At <strong style={{ color: 'var(--color-gold)' }}>The Realty Xperts</strong>, our zeal is to create milestones that meet universal eminence, exemplify the esteem of our organization, and are crafted on a legacy of belief traversed over centuries. We are steered by our foresightedness of <strong>‘Creating a better living’</strong> and trust that real estate transfigures lives.
                        </p>
                        <p style={{ marginBottom: '30px' }}>
                            We have the adroitness to deliver both attribute and commitment, at an inimitable swiftness. By forging magnificent worldwide confederations and deploying the finest people and procedures, we generate the best benefits for our consumers across landscapes and markets.
                        </p>
                        <p>
                            We are creating a better living in exceptionally more ways than anyone can envisage. Every home we hand-pick is a springboard for the desires and dreams of a flourishing and persuasive life.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding" style={{ backgroundColor: 'white', textAlign: 'center' }}>
                <div className="container animate-on-scroll">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Start Your Journey?</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-dark-gray)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>Experience the TRX difference. Let our experts guide you to your perfect address.</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/properties" className="btn btn-primary" style={{ padding: '15px 40px' }}>View Properties</Link>
                        <Link to="/contact" className="btn btn-outline-primary" style={{ padding: '15px 40px' }}>Contact Our Team</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default About;
