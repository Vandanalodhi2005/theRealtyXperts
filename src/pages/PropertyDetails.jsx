import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PropertyDetails() {
    const { id } = useParams();
    const [propertyData, setPropertyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchExternalData = () => {
            const properties = JSON.parse(localStorage.getItem('trx_properties') || '[]');
            const projects = JSON.parse(localStorage.getItem('trx_projects') || '[]');
            const investments = JSON.parse(localStorage.getItem('trx_investments') || '[]');
            
            const allItems = [...properties, ...projects, ...investments];
            const found = allItems.find(item => String(item.id) === String(id));
            
            if (found) {
                let statusFormatted = found.status === 'sold' ? 'Sold' : (found.status === 'rented' ? 'For Rent' : 'For Sale');

                return {
                    title: found.title || found.propertyName || found.buildingName || "Premium Property",
                    price: found.price ? (found.price.includes('₹') || found.price.includes('$') ? found.price : `₹${found.price}`) : null,
                    location: `${found.street ? found.street + ', ' : ''}${found.location || ''}${found.city || found.area || ''}`,
                    status: statusFormatted,
                    beds: found.bedrooms || null,
                    baths: found.bathrooms || null, 
                    sqft: found.area || found.plotArea || null,
                    description: found.detailedInfo || found.description || null,
                    features: found.amenities && found.amenities.length > 0 ? found.amenities : null,
                    highlights: found.highlights && found.highlights.length > 0 ? found.highlights : null,
                    youtubeUrl: found.youtubeUrl || null,
                    coverImage: found.coverImage || null,
                    agent: {
                        name: "Sameer Tiwari",
                        phone: "926-417-5587",
                        email: "Emailtotre@gmail.com"
                    }
                };
            }
            return null;
        };

        const adminData = fetchExternalData();
        setPropertyData(adminData);
        setLoading(false);
    }, [id]);

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

    if (!propertyData) {
        return (
            <main style={{ paddingTop: '120px', textAlign: 'center', minHeight: '80vh' }}>
                <div className="container">
                    <i className="fas fa-search" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '20px' }}></i>
                    <h1>Property Not Found</h1>
                    <p>The property you are looking for does not exist or has been removed.</p>
                </div>
            </main>
        );
    }

    const imageSrc = propertyData.coverImage || '/assets/images/property_1.png';

    return (
        <main style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header / Back */}
            <div className="container" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <button onClick={() => window.history.back()} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-navy)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                    <i className="fas fa-arrow-left"></i> Back to Listings
                </button>
            </div>

            <section className="property-details">
                <div className="container">
                    
                    {/* Hero Image Section - Premium Large Header */}
                    <div style={{ 
                        position: 'relative', 
                        height: '70vh', 
                        minHeight: '500px', 
                        borderRadius: 'var(--radius-lg)', 
                        overflow: 'hidden', 
                        marginBottom: '60px', 
                        boxShadow: 'var(--shadow-lg)' 
                    }}>
                        <img 
                            src={imageSrc} 
                            alt={propertyData.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => { e.target.src = '/assets/images/property_1.png' }}
                        />
                        <div style={{ 
                            position: 'absolute', 
                            top: '40px', 
                            left: '40px', 
                            backgroundColor: propertyData.status === 'Sold' ? 'var(--color-navy)' : 'var(--color-gold)',
                            color: 'white',
                            padding: '12px 28px',
                            borderRadius: '50px',
                            fontWeight: '700',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}>
                            {propertyData.status}
                        </div>
                    </div>

                    {/* Centered Main Layout */}
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        
                        {/* Title & Price - Striking Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '40px', gap: '20px' }}>
                            <div style={{ flex: '1' }}>
                                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', color: 'var(--color-navy)', marginBottom: '15px' }}>{propertyData.title}</h1>
                                {propertyData.location && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-teal)', fontSize: '1.2rem', fontWeight: '500' }}>
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>{propertyData.location}</span>
                                    </div>
                                )}
                            </div>
                            {propertyData.price && (
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--color-gold)', letterSpacing: '-1.5px', lineHeight: '1' }}>
                                        {propertyData.price}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-dark-gray)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '5px' }}>Premium Valuation</div>
                                </div>
                            )}
                        </div>

                        {/* Key Stats - Modern Icon Bar */}
                        {(propertyData.beds || propertyData.baths || propertyData.sqft) && (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                gap: '2px', 
                                backgroundColor: '#f0f0f0', 
                                borderRadius: 'var(--radius-lg)', 
                                overflow: 'hidden',
                                marginBottom: '60px',
                                boxShadow: 'var(--shadow-md)',
                                border: '1px solid #eee'
                            }}>
                                {propertyData.beds && (
                                    <div style={{ backgroundColor: 'white', padding: '30px', textAlign: 'center' }}>
                                        <i className="fas fa-bed" style={{ color: 'var(--color-gold)', fontSize: '1.8rem', marginBottom: '12px', display: 'block' }}></i>
                                        <div style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--color-navy)' }}>{propertyData.beds}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-dark-gray)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px' }}>Bedrooms</div>
                                    </div>
                                )}
                                {propertyData.baths && (
                                    <div style={{ backgroundColor: 'white', padding: '30px', textAlign: 'center' }}>
                                        <i className="fas fa-bath" style={{ color: 'var(--color-gold)', fontSize: '1.8rem', marginBottom: '12px', display: 'block' }}></i>
                                        <div style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--color-navy)' }}>{propertyData.baths}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-dark-gray)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px' }}>Bathrooms</div>
                                    </div>
                                )}
                                {propertyData.sqft && (
                                    <div style={{ backgroundColor: 'white', padding: '30px', textAlign: 'center' }}>
                                        <i className="fas fa-vector-square" style={{ color: 'var(--color-gold)', fontSize: '1.8rem', marginBottom: '12px', display: 'block' }}></i>
                                        <div style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--color-navy)' }}>{propertyData.sqft}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-dark-gray)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px' }}>Square Feet</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Highlights Section */}
                        {propertyData.highlights && (
                            <div style={{ marginBottom: '60px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
                                    <h2 style={{ fontSize: '2rem', margin: '0' }}>Project Highlights</h2>
                                    <div style={{ flex: '1', height: '1px', backgroundColor: 'var(--color-gray)' }}></div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                                    {propertyData.highlights.map((h, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: '500' }}>
                                            <i className="fas fa-certificate" style={{ color: 'var(--color-gold)', marginTop: '5px' }}></i>
                                            <span>{h}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Details Sections */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px' }}>
                            {/* Description */}
                            {propertyData.description && (
                                <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{ width: '40px', height: '4px', backgroundColor: 'var(--color-gold)', display: 'inline-block' }}></span>
                                        About This Estate
                                    </h2>
                                    <p style={{ fontSize: '1.2rem', lineHeight: '2', color: '#444', whiteSpace: 'pre-line' }}>{propertyData.description}</p>
                                </div>
                            )}

                            {/* Amenities Grid */}
                            {propertyData.features && (
                                <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{ width: '40px', height: '4px', backgroundColor: 'var(--color-gold)', display: 'inline-block' }}></span>
                                        Premium Amenities
                                    </h2>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                                        gap: '20px'
                                    }}>
                                        {propertyData.features.map((feature, idx) => (
                                            <div key={idx} style={{ 
                                                padding: '15px 25px', 
                                                backgroundColor: '#f9f9f9', 
                                                borderRadius: '50px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '12px',
                                                border: '1px solid #eee'
                                            }}>
                                                <i className="fas fa-star" style={{ color: 'var(--color-gold)', fontSize: '0.8rem' }}></i>
                                                <span style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--color-navy)' }}>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* YouTube Video Section */}
                            {propertyData.youtubeUrl && (
                                <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{ width: '40px', height: '4px', backgroundColor: 'var(--color-gold)', display: 'inline-block' }}></span>
                                        Tour the Property
                                    </h2>
                                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: '0', overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
                                        <iframe 
                                            style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
                                            src={`https://www.youtube.com/embed/${propertyData.youtubeUrl.split('v=')[1]?.split('&')[0] || propertyData.youtubeUrl.split('/').pop()}`}
                                            title="YouTube video player" 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Centered Premium Contact Section */}
                        <div style={{ 
                            backgroundColor: 'var(--color-navy)', 
                            borderRadius: 'var(--radius-lg)', 
                            padding: '80px 40px', 
                            textAlign: 'center',
                            color: 'white',
                            marginTop: '100px',
                            boxShadow: '0 30px 60px rgba(10, 28, 58, 0.3)',
                            backgroundImage: 'linear-gradient(135deg, #0A1C3A 0%, #1a2a4b 100%)',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid rgba(198, 156, 109, 0.3)'
                        }}>
                            {/* Decorative Gold Elements */}
                            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(198, 156, 109, 0.1) 0%, transparent 70%)' }}></div>
                            <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(198, 156, 109, 0.1) 0%, transparent 70%)' }}></div>
                            
                            <div style={{ position: 'relative', zIndex: '2' }}>
                                <span className="subtitle" style={{ color: 'var(--color-gold)', marginBottom: '20px', display: 'block', fontSize: '1rem', letterSpacing: '3px' }}>The Reality Expert</span>
                                <h2 style={{ color: 'white', fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>Consult with our Specialist</h2>
                                <p style={{ opacity: '0.8', fontSize: '1.3rem', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px', lineHeight: '1.6' }}>
                                    Experience the highest level of personalization and expert guidance. Schedule your private sanctuary tour today.
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '50px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.08)', padding: '15px 35px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                                            <i className="fas fa-user-tie"></i>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '1.4rem', letterSpacing: '0.5px' }}>{propertyData.agent.name}</div>
                                            <div style={{ fontSize: '0.95rem', color: 'var(--color-gold)', fontWeight: '600' }}>Senior Luxury Advisor</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <a 
                                        href={`tel:${propertyData.agent.phone.replace(/[^0-9]/g, '')}`} 
                                        className="btn btn-secondary" 
                                        style={{ padding: '20px 50px', fontSize: '1.2rem', minWidth: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', borderRadius: '100px', fontWeight: '700', transition: 'transform 0.3s ease' }}
                                    >
                                        <i className="fas fa-phone-alt"></i> Call Advisor
                                    </a>
                                    <a 
                                        href={`https://wa.me/91${propertyData.agent.phone.replace(/[^0-9]/g, '')}?text=Hello, I am interested in exploring: ${propertyData.title}`} 
                                        className="btn" 
                                        style={{ padding: '20px 50px', fontSize: '1.2rem', backgroundColor: '#25D366', color: 'white', border: 'none', minWidth: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', borderRadius: '100px', fontWeight: '700' }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fab fa-whatsapp" style={{ fontSize: '1.8rem' }}></i> Message Expert
                                    </a>
                                </div>
                                
                                <div style={{ marginTop: '40px', opacity: '0.5', fontSize: '1rem', fontWeight: '500' }}>
                                    Direct Email: <a href={`mailto:${propertyData.agent.email}`} style={{ color: 'white', textDecoration: 'none' }}>{propertyData.agent.email}</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}

export default PropertyDetails;
