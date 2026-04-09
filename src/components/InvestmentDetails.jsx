import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiLocationMarker, HiCurrencyRupee, HiArrowLeft, HiPhone } from 'react-icons/hi';

const InvestmentDetails = () => {
  const { id } = useParams();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchInvestment();
  }, [id]);

  const fetchInvestment = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investments/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInvestment(data);
      }
    } catch (error) {
      console.error('Error fetching investment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Investment Not Found</h2>
          <Link to="/investment" className="text-blue-600 hover:underline">← Back to Investments</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link to="/investment" className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-6 transition-colors">
            <HiArrowLeft className="w-5 h-5 mr-2" />
            Back to Investments
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden mb-4">
                {investment.images && investment.images.length > 0 ? (
                  <img
                    src={investment.images[activeImage]}
                    alt={investment.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200">
                    <svg className="w-24 h-24 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                )}
              </div>
              {investment.images && investment.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {investment.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    investment.status === 'available' ? 'bg-green-100 text-green-700' :
                    investment.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {investment.status?.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 capitalize">
                    {investment.landType} Land
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">{investment.title}</h1>
                <div className="flex items-center gap-1 text-slate-500">
                  <HiLocationMarker className="w-5 h-5" />
                  <span>{investment.location}, {investment.city}</span>
                </div>
              </div>

              {/* Price & Area */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Price</p>
                    <div className="flex items-center text-blue-600 font-extrabold text-2xl">
                      <HiCurrencyRupee className="w-6 h-6" />
                      {investment.totalPrice?.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Land Area</p>
                    <p className="text-2xl font-bold text-slate-900">{investment.area} {investment.areaUnit || 'sq.ft'}</p>
                  </div>
                  {investment.pricePerUnit && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Price Per {investment.areaUnit || 'sq.ft'}</p>
                      <p className="text-lg font-semibold text-slate-800">₹{investment.pricePerUnit?.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">About This Investment</h3>
                <p className="text-slate-600 leading-relaxed">{investment.description}</p>
              </div>

              {/* Highlights */}
              {investment.highlights && investment.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Key Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {investment.highlights.map((h, i) => (
                      <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm border border-green-100 font-medium">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Places */}
              {investment.nearbyPlaces && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Nearby Places</h3>
                  <p className="text-slate-600">{investment.nearbyPlaces}</p>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href="tel:+919406650197"
                  className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors font-semibold text-center flex items-center justify-center gap-2"
                >
                  <HiPhone className="w-5 h-5" /> Call Now
                </a>
                <a
                  href="https://wa.me/919406650197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors font-semibold text-center"
                >
                  WhatsApp
                </a>
                <Link
                  to="/contact"
                  className="flex-1 border-2 border-blue-500 text-blue-600 py-3 px-6 rounded-xl hover:bg-blue-500 hover:text-white transition-colors font-semibold text-center"
                >
                  Inquire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetails;
