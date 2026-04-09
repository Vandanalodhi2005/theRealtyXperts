import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiLocationMarker, HiCurrencyRupee, HiHome, HiOfficeBuilding, HiMail, HiPhone, HiSparkles } from 'react-icons/hi';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import PropertyCard from './PropertyCard';

// Inquiry Modal Component
const InquiryModal = ({ property, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in this ${property?.propertyType} in ${property?.location}, ${property?.city}. Please provide more details.`
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      toast.success('Inquiry sent successfully! We will contact you soon.');
      onClose();
    } catch (error) {
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Inquiry Form</h2>
          <div className="mb-4 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900">{property?.propertyName || `${property?.bedroom} BHK ${property?.propertyType}`}</h3>
            <p className="text-sm text-slate-600">{property?.location}, {property?.city}</p>
            <p className="text-lg font-bold text-blue-600 mt-1">₹{property?.price?.toLocaleString()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

InquiryModal.propTypes = {
  property: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
        // After fetching current property, fetch related ones
        fetchRelatedProperties(data);
      } else {
        toast.error('Property not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Error loading property details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProperties = async (currentProp) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`);
      if (response.ok) {
        const allProps = await response.json();
        // Filter: same type or same city, excluding current property
        const related = allProps
          .filter(p => p._id !== currentProp._id)
          .filter(p => p.propertyType === currentProp.propertyType || p.city === currentProp.city)
          .slice(0, 3);
        setRelatedProperties(related);
      }
    } catch (error) {
      console.error('Error fetching related properties:', error);
    } finally {
      setRelatedLoading(false);
    }
  };

  const handleInquirySubmit = async (inquiryData) => {
    const inquiryPayload = {
      ...inquiryData,
      propertyId: property._id,
      propertyTitle: property.propertyName || `${property.bedroom} BHK ${property.propertyType}`
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryPayload),
    });

    if (!response.ok) {
      throw new Error('Failed to send inquiry');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading property details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Property Not Found</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
              <div className="aspect-[16/9] lg:aspect-[21/9] bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={property.images[currentImageIndex]}
                      alt={property.propertyName || 'Property'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-md text-slate-900 p-3 rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-lg z-10"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-md text-slate-900 p-3 rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-lg z-10"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center text-slate-400">
                    <HiHome className="w-20 h-20 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No image available</p>
                  </div>
                )}
              </div>
              {property.images && property.images.length > 1 && (
                <div className="p-4 bg-white border-t border-slate-50">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Property ${index + 1}`}
                        className={`w-24 h-16 flex-none object-cover rounded-xl cursor-pointer transition-all duration-300 ${
                          currentImageIndex === index 
                            ? 'ring-2 ring-blue-500 ring-offset-2 opacity-100' 
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    {property.status.toUpperCase()}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                    {property.propertyName || `${property.bedroom || ''} BHK ${property.propertyType}`}
                  </h1>
                  <div className="flex items-center text-slate-500 font-medium">
                    <HiLocationMarker className="w-5 h-5 mr-1.5 text-slate-400 flex-shrink-0" />
                    {property.location}, {property.city}
                  </div>
                </div>
                <div className="md:text-right bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full md:w-auto">
                  <div className="text-3xl font-extrabold text-blue-600 mb-1">
                    ₹{property.price?.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    {property.transaction === 'rent' ? 'per month' : 'Total Price'}
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500">
                    <HiHome className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Type</div>
                    <div className="font-bold text-slate-900">{property.propertyType}</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500">
                    <HiOfficeBuilding className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Area</div>
                    <div className="font-bold text-slate-900">{property.area} sq.ft</div>
                  </div>
                </div>
                {property.bedroom && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500">
                      <HiHome className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Bedrooms</div>
                      <div className="font-bold text-slate-900">{property.bedroom}</div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500">
                    <HiCurrencyRupee className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Transaction</div>
                    <div className="font-bold text-slate-900 capitalize">{property.transaction || 'Sale'}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {property.propertyDescription && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                    </span>
                    Description
                  </h2>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">{property.propertyDescription}</p>
                </div>
              )}

              {/* Detailed Information */}
              {property.detailedInformation && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </span>
                    Detailed Information
                  </h2>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">{property.detailedInformation}</p>
                </div>
              )}

              {/* Property Overview / Summary */}
              <div className="mb-10 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                    <HiOfficeBuilding className="w-5 h-5" />
                  </span>
                  Property Overview
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 capitalize">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Property ID</div>
                    <div className="font-semibold text-slate-900">{property._id?.slice(-8).toUpperCase()}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Listed On</div>
                    <div className="font-semibold text-slate-900">{new Date(property.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  </div>
                  {property.furnishing && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Furnishing</div>
                      <div className="font-semibold text-slate-900">{property.furnishing}</div>
                    </div>
                  )}
                  {property.propertyAge && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Property Age</div>
                      <div className="font-semibold text-slate-900">{property.propertyAge}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="p-1.5 bg-green-100 rounded-lg text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </span>
                    Premium Amenities
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div 
                        key={index} 
                        className="flex items-center px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl text-sm font-medium text-slate-700 transition-all duration-300 cursor-default group shadow-sm"
                      >
                        <span className="w-2 h-2 bg-blue-400 group-hover:bg-blue-500 group-hover:scale-125 transition-transform duration-300 rounded-full mr-2"></span>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Details */}
              <div className="border-t pt-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                    <HiLocationMarker className="w-5 h-5" />
                  </span>
                  Location & Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {property.flatNo && (
                    <div className="flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Flat/Unit No</span>
                      <span className="font-semibold text-slate-900">{property.flatNo}</span>
                    </div>
                  )}
                  {property.buildingName && (
                    <div className="flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Building</span>
                      <span className="font-semibold text-slate-900">{property.buildingName}</span>
                    </div>
                  )}
                  {property.street && (
                    <div className="flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Street</span>
                      <span className="font-semibold text-slate-900">{property.street}</span>
                    </div>
                  )}
                  {property.landmark && (
                    <div className="flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Landmark</span>
                      <span className="font-semibold text-slate-900">{property.landmark}</span>
                    </div>
                  )}
                  {property.pinCode && (
                    <div className="flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Pin Code</span>
                      <span className="font-semibold text-slate-900">{property.pinCode}</span>
                    </div>
                  )}
                  {property.address && (
                    <div className="flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all md:col-span-3">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Full Address</span>
                      <span className="font-semibold text-slate-900">{property.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Inquiry Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 sticky top-28 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Interested?</h2>
              <p className="text-slate-500 mb-8 relative z-10">Contact us to get more details or schedule a viewing for this property.</p>
              
              <button
                onClick={() => setShowInquiryModal(true)}
                className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl hover:bg-blue-500 transition-all duration-300 font-bold flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20 hover:shadow-blue-500/30 transform hover:-translate-y-1 relative z-10"
              >
                <HiMail className="w-6 h-6" />
                Send Inquiry Now
              </button>

              <div className="mt-4 space-y-3 relative z-10">
                <a 
                  href="tel:+919406650197" 
                  className="w-full bg-slate-100 text-slate-800 py-4 px-6 rounded-2xl hover:bg-slate-200 transition-all duration-300 font-bold flex items-center justify-center gap-3 shadow-sm transform hover:-translate-y-1 border border-slate-200"
                >
                  <HiPhone className="w-6 h-6 text-slate-600" />
                  Call Now
                </a>
                <a 
                  href="https://wa.me/919406650197" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white py-4 px-6 rounded-2xl hover:bg-[#128C7E] transition-all duration-300 font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 transform hover:-translate-y-1"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Related Properties Section */}
        {relatedProperties.length > 0 && (
          <div className="mt-16 pt-16 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <HiSparkles className="text-blue-500 w-8 h-8" />
                  You Might Also Like
                </h2>
                <p className="text-slate-600">Discover other properties that match your preferences.</p>
              </div>
              <button 
                onClick={() => navigate('/properties')}
                className="hidden sm:block text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                View All Properties →
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProperties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <InquiryModal
          property={property}
          onClose={() => setShowInquiryModal(false)}
          onSubmit={handleInquirySubmit}
        />
      )}
    </div>
  );
};

export default PropertyDetails;