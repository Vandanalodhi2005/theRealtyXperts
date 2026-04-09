import { useNavigate } from 'react-router-dom';
import { HiHome, HiLocationMarker, HiCurrencyRupee } from 'react-icons/hi';
import PropTypes from 'prop-types';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 cursor-pointer flex flex-col"
      onClick={() => navigate(`/property/${property._id}`)}
    >
      <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.propertyName || 'Property'} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiHome className="w-16 h-16 text-slate-400" />
          </div>
        )}
        {/* Glassmorphic Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
            property.status === 'available' 
              ? 'bg-white/90 text-green-700' 
              : 'bg-white/90 text-red-700'
          }`}>
            {property.status.toUpperCase()}
          </span>
        </div>
        {/* Subtle bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {property.propertyName || `${property.bedroom || ''} BHK ${property.propertyType}`}
        </h3>
        <div className="flex items-center gap-1 text-slate-500 mb-3 text-sm">
          <HiLocationMarker className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="line-clamp-1">{property.location}, {property.city}</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600 font-bold text-2xl mb-3">
          <HiCurrencyRupee className="w-6 h-6" />
          <span>{property.price?.toLocaleString()}</span>
        </div>
        <p className="text-slate-600 text-sm mb-5 line-clamp-2 flex-1">
          {property.propertyDescription || `Premium ${property.propertyType} located in the heart of ${property.location}.`}
        </p>
        <button
          className="w-full bg-slate-900 text-white hover:bg-blue-500 py-3 px-4 rounded-xl transition-colors duration-300 font-semibold shadow-md flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/property/${property._id}`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertyCard;
