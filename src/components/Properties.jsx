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
    }

    // Additional User Filters
    if (filters.category !== 'all') {
      if (filters.category === 'residential') {
        if (!['apartment', 'villa', 'plot'].includes(property.propertyType)) return false;
      } else if (filters.category === 'commercial') {
        if (property.propertyType !== 'commercial') return false;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
              {category === 'residential' ? 'Residential Properties' : category === 'commercial' ? 'Commercial Properties' : 'All Properties'}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover your perfect property from our extensive collection of residential and commercial spaces.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <HiFilter className="text-blue-500 w-6 h-6" />
                <h3 className="text-xl font-bold text-slate-800">Filter Properties</h3>
              </div>
              
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    Clear All
                  </button>
                )}
                {/* Mobile Filter Toggle Button */}
                <button 
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="md:hidden flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {showMobileFilters ? <HiX className="w-6 h-6" /> : <HiFilter className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(filters).map(([key, value]) => {
                  if (value === 'all' || value === '') return null;
                  const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                  return (
                    <span key={key} className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                      <span className="text-blue-900 mr-1">{label.trim()}:</span> {value}
                    </span>
                  );
                })}
              </div>
            )}

            <div className={`${showMobileFilters ? 'block' : 'hidden md:grid'} grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in`}>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-700 transition-all"
              >
                <option value="all">All Categories</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>

              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-700 transition-all"
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>

              <select
                name="transaction"
                value={filters.transaction}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-700 transition-all"
              >
                <option value="all">Sale / Rent</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>

              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-700 transition-all"
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
                className="px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-700 transition-all"
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
                className="px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-700 transition-all"
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
                className="px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-700 transition-all"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price (₹)"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-700 transition-all"
              />
              <input
                type="text"
                name="location"
                placeholder="Search Location..."
                value={filters.location}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-700 transition-all lg:col-span-1 md:col-span-3"
              />
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <HiOfficeBuilding className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No properties found</h3>
              <p className="text-slate-500">Try adjusting your filters or check back later for new listings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Properties.propTypes = {
  category: PropTypes.string
};

export default Properties;