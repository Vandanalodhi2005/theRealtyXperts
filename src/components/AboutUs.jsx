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
              <p>Whether you're looking for an opulent residence, a commercial hub, or investment land, our expansive portfolio covers all business types to meet your exact needs.</p>

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
              <div className="image-wrapper" style={{ backgroundImage: "url('/assets/images/about_bg.jpg')", backgroundSize: 'cover' }}>
                <div className="glass-panel">
                  <h3>TRX</h3>
                  <p>Excellence in Real Estate</p>
                  <div className="accent-line"></div>
                </div>
              </div>
            </div>
          </div>

          {/* New Leadership Section */}
          <div className="section-padding" style={{ marginTop: '80px', borderTop: '1px solid var(--color-gray)' }}>
            <div className="section-header text-center">
              <span className="subtitle">Our Leadership</span>
              <h2>Chairman & Managing Director</h2>
              <div className="divider mx-auto"></div>
            </div>

            <div className="about-grid" style={{ alignItems: 'flex-start', marginTop: '40px' }}>
              <div className="about-image">
                <div className="image-wrapper" style={{ height: '550px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-gray)' }}>
                  <img
                    src="/about/owner.jpeg"
                    alt="Mr. Sanjeev Kumar - CMD"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="text-center mt-4">
                  <h3 style={{ color: 'var(--color-navy)', fontSize: '1.5rem', marginBottom: '5px' }}>Mr. Sanjeev Kumar</h3>
                  <p className="text-gold" style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>CMD, The Realty Xperts</p>
                </div>
              </div>

              <div className="about-content" style={{ paddingLeft: '20px' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--color-navy)' }}>Visionary Leadership</h3>
                <div style={{ color: 'var(--color-dark-gray)', fontSize: '1.05rem', lineHeight: '1.8' }}>
                  <p style={{ marginBottom: '20px' }}>
                    <strong>Mr. Sanjeev Kumar</strong> is the Chairman & Managing Director (CMD) with over <strong>18 years</strong> of diverse experience spanning sales, operations, and real estate management. His career journey reflects a steady rise through leadership positions in renowned organizations such as <strong>IBM, United Health Group, Capgemini (iGATE/Patni)</strong>, and leading real estate firms in Noida.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                    A certified <strong>Six Sigma White Belt</strong>, Sanjeev has consistently demonstrated excellence in team leadership, process improvement, client relationship management, and strategic operations. He has successfully managed large teams, driven collections and CRM strategies, and built strong broker and investor relations.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                    With an <strong>MBA in Operations</strong> and technical certifications in <strong>MCSE and CCNA</strong>, Sanjeev combines managerial acumen with technical proficiency. His proven ability to synchronize sales and operations, retain clients, and inspire teams positions him as a dynamic leader ready to guide the organization into its next phase of Growth.
                  </p>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <div style={{ padding: '15px', backgroundColor: 'var(--color-light-gray)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                      <span className="text-gold" style={{ display: 'block', fontWeight: 'bold', fontSize: '1.2rem' }}>18+</span>
                      <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Years Exp</span>
                    </div>
                    <div style={{ padding: '15px', backgroundColor: 'var(--color-light-gray)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                      <span className="text-gold" style={{ display: 'block', fontWeight: 'bold', fontSize: '1.2rem' }}>MBA</span>
                      <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Operations</span>
                    </div>
                    <div style={{ padding: '15px', backgroundColor: 'var(--color-light-gray)', borderRadius: 'var(--radius-md)', flex: 1 }}>
                      <span className="text-gold" style={{ display: 'block', fontWeight: 'bold', fontSize: '1.2rem' }}>Six Sigma</span>
                      <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>White Belt</span>
                    </div>
                  </div>
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
