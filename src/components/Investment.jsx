import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiLocationMarker, HiCurrencyRupee } from 'react-icons/hi';

const Investment = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investments`);
      if (response.ok) {
        const data = await response.json();
        setInvestments(data);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Land Investment Opportunities
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Invest in <span className="text-blue-500">Premium Land</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Secure your future with prime land investments in Bhopal. Agricultural, residential, and commercial plots at the best locations.
            </p>
          </div>

          {/* Investment Grid */}
          {investments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {investments.map((investment) => (
                <div
                  key={investment._id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 flex flex-col cursor-pointer"
                  onClick={() => navigate(`/investment/${investment._id}`)}
                >
                  <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
                    {investment.images && investment.images.length > 0 ? (
                      <img
                        src={investment.images[0]}
                        alt={investment.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200">
                        <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                        investment.status === 'available'
                          ? 'bg-white/90 text-green-700'
                          : investment.status === 'upcoming'
                          ? 'bg-white/90 text-blue-700'
                          : 'bg-white/90 text-red-700'
                      }`}>
                        {investment.status?.toUpperCase()}
                      </span>
                    </div>
                    {/* Land Type Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900/70 text-white backdrop-blur-md capitalize">
                        {investment.landType} Land
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {investment.title}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 mb-2 text-sm">
                      <HiLocationMarker className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="line-clamp-1">{investment.location}, {investment.city}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-blue-600 font-bold text-xl">
                        <HiCurrencyRupee className="w-5 h-5" />
                        <span>{investment.totalPrice?.toLocaleString()}</span>
                      </div>
                      <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                        {investment.area} {investment.areaUnit || 'sq.ft'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                      {investment.description}
                    </p>

                    {/* Highlights */}
                    {investment.highlights && investment.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {investment.highlights.slice(0, 3).map((highlight, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/investment/${investment._id}`);
                      }}
                      className="w-full bg-slate-900 text-white hover:bg-blue-500 py-3 px-4 rounded-xl transition-colors duration-300 font-semibold shadow-md flex items-center justify-center"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-20 h-20 text-slate-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-2xl font-bold text-slate-700 mb-3">No Investment Opportunities Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">We&apos;re adding new land investment opportunities soon. Check back later or contact us for personalized options.</p>
              <Link
                to="/contact"
                className="inline-block mt-6 bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl -mr-32 -mt-32 opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl -ml-32 -mb-32 opacity-20 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Looking for Custom Land Investment?</h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
                Our real estate experts can help you find the perfect land investment matching your budget and goals.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-blue-500 text-white px-10 py-4 rounded-xl hover:bg-blue-600 transition-all duration-300 font-bold shadow-lg shadow-blue-500/30 transform hover:-translate-y-1"
              >
                Get Expert Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investment;
