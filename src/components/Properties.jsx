import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHome, HiOfficeBuilding, HiLocationMarker, HiCurrencyRupee, HiFilter, HiX } from 'react-icons/hi';
import PropTypes from 'prop-types';
import PropertyCard from './PropertyCard';

const Properties = ({ category = 'all' }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    propertyType: 'all',
    minPrice: '',
    maxPrice: '',
    location: '',
    transaction: 'all',
    status: 'all',
    bedroom: 'all',
    furnishing: 'all'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const navigate = useNavigate();

  const fetchProperties = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      propertyType: 'all',
      minPrice: '',
      maxPrice: '',
      location: '',
      transaction: 'all',
      status: 'all',
      bedroom: 'all',
      furnishing: 'all'
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'minPrice' || key === 'maxPrice' || key === 'location') return value !== '';
    return value !== 'all';
  });

  const filteredProperties = properties.filter(property => {
    // Filter by route category
    if (category === 'residential') {
      if (!['apartment', 'villa', 'plot'].includes(property.propertyType)) return false;
    } else if (category === 'commercial') {
      if (property.propertyType !== 'commercial') return false;
    } else if (category === 'investment') {
      if (property.propertyType !== 'investment') return false;
    }

    // Additional User Filters
    if (filters.category !== 'all') {
      if (filters.category === 'residential') {
        const isResProp = ['apartment', 'villa', 'plot'].includes(property.propertyType);
        const isResProj = property.type === 'residential';
        if (!isResProp && !isResProj) return false;
      } else if (filters.category === 'commercial') {
        const isCommProp = property.propertyType === 'commercial';
        const isCommProj = property.type === 'commercial';
        if (!isCommProp && !isCommProj) return false;
      } else if (filters.category === 'investment') {
        const isInvProp = property.propertyType === 'investment';
        const isInvProj = property.type === 'investment';
        if (!isInvProp && !isInvProj) return false;
      }
    }

    if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) return false;
    if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false;
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.transaction !== 'all' && property.transaction !== filters.transaction) return false;
    if (filters.status !== 'all' && property.status !== filters.status) return false;
    if (filters.bedroom !== 'all' && property.bedroom?.toString() !== filters.bedroom) return false;
    if (filters.furnishing !== 'all' && property.furnishing !== filters.furnishing) return false;

    return true;
  });

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-gray)', borderTopColor: 'var(--color-navy)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px' }}>
      <section className="section-padding">
        <div className="container">
          {/* Header */}
          <div className="section-header text-center fade-in-up">
            <span className="subtitle">Real Estate Portfolio</span>
            <h2>
              {category === 'residential' ? 'Residential Properties' : category === 'commercial' ? 'Commercial Properties' : 'All Properties'}
            </h2>
            <div className="divider mx-auto"></div>
            <p className="section-desc">
              Discover your perfect property from our extensive collection of residential and commercial spaces defined by excellence.
            </p>
          </div>

          {/* Filters (Modified to match search-bar-container logic) */}
          <div className="search-bar-container mx-auto fade-in-up" style={{ marginBottom: '40px', maxWidth: '1000px', animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-gray)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}><i className="fas fa-filter text-gold" style={{ marginRight: '8px' }}></i> Filter Search</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' }}>
                  Clear All
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
              >
                <option value="all">All Categories</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="investment">Investment</option>
              </select>

              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
                <option value="investment">Investment</option>
              </select>

              <select
                name="transaction"
                value={filters.transaction}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
              >
                <option value="all">Sale / Rent</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>

              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
              >
                <option value="all">Any Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>

              <select
                name="bedroom"
                value={filters.bedroom}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
                disabled={filters.category === 'commercial' || filters.propertyType === 'plot' || filters.propertyType === 'commercial'}
              >
                <option value="all">Bedrooms (Any)</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
              </select>

              <select
                name="furnishing"
                value={filters.furnishing}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
              >
                <option value="all">Furnishing (Any)</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>

              <input
                type="number"
                name="minPrice"
                placeholder="Min Price (₹)"
                value={filters.minPrice}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price (₹)"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
              />

            </div>
            <div style={{ marginTop: '15px' }}>
              <input
                type="text"
                name="location"
                placeholder="Search Location..."
                value={filters.location}
                onChange={handleFilterChange}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
              />
            </div>
          </div>

          {/* Properties Grid */}
          <div className="property-grid">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center section-padding fade-in-up">
              <i className="fas fa-building" style={{ fontSize: '4rem', color: 'var(--color-gray)', marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '10px' }}>No properties found</h3>
              <p className="text-slate-500">Try adjusting your filters or check back later for new premium listings.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

Properties.propTypes = {
  category: PropTypes.string
};

export default Properties;