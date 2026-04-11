import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card fade-in-up">
      <div className="card-img-wrapper">
        <div className="status-badge" style={{ textTransform: 'capitalize' }}>
          {property.status || 'Available'}
        </div>
        <img 
          src={property.images && property.images.length > 0 ? property.images[0] : '/assets/images/property_1.png'} 
          alt={property.propertyName || property.title || 'Property'} 
          className="card-img" 
          onError={(e) => { e.target.src = '/assets/images/property_1.png' }}
        />
        <div className="price-tag">
          ₹ {property.price?.toLocaleString() || property.totalPrice?.toLocaleString() || 'Price on Request'}
        </div>
        
        {/* Transaction Type / Land Type */}
        {(property.transaction || property.landType) && (
          <div className="status-badge" style={{ top: '20px', left: 'auto', right: '20px', backgroundColor: 'var(--color-gold)' }}>
             {property.transaction ? `For ${property.transaction}` : `${property.landType} Land`}
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="line-clamp-1">{property.propertyName || property.title || `${property.bedroom || ''} BHK ${property.propertyType || ''}`}</h3>
        <p className="location line-clamp-1">
          <i className="fas fa-map-marker-alt"></i> {property.location}, {property.city}
        </p>
        
        <div className="card-amenities">
          {property.bedroom && (
            <span><i className="fas fa-bed"></i> {property.bedroom} Bed</span>
          )}
          {property.area && (
            <span><i className="fas fa-vector-square"></i> {property.area} {property.areaUnit || 'sq.ft'}</span>
          )}
          {property.furnishing && !property.area && (
             <span style={{ textTransform: 'capitalize' }}><i className="fas fa-couch"></i> {property.furnishing.replace('-', ' ')}</span>
          )}
        </div>
      </div>
      
      <div className="card-footer">
          <Link 
            to={`/${property.landType ? 'investment' : (property.type && !property.propertyType) ? 'project' : 'property'}/${property._id}`} 
            className="btn btn-outline-primary btn-full"
          >
            View Details
         </Link>
      </div>
    </div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertyCard;
