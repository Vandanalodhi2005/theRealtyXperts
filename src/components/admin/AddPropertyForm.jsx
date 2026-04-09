import { useState } from 'react';
import PropTypes from 'prop-types';

const AddPropertyForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    status: '',
    propertyType: '',
    price: '',
    area: '',
    plotArea: '',
    bedroom: '',
    transaction: '',
    furnishing: '',
    propertyAge: '',
    flatNo: '',
    propertyName: '',
    buildingName: '',
    street: '',
    landmark: '',
    pinCode: '',
    address: '',
    city: '',
    location: '',
    propertyDescription: '',
    detailedInformation: '',
    amenities: [],
    youtubeUrl: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          formDataToSend.append(key, formData[key].join(','));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add property');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const amenitiesList = [
    'Water Softener', 'Kids Play Area', 'Volleyball Court', 'Badminton Court', 'Cricket Pitch', 'Wifi',
    'Dining Table', 'Curtains', 'Chimney', 'Microwave', 'Stove', 'Water Purifier', 'Washing Machine',
    'Fans', 'Lights', 'Exhaust Fan', 'Sofa', 'Wardrobe', 'T.V', 'Geysers', 'Modular Kitchen', 'Air Condition',
    'Refrigerator', 'Earthquake Resistant', 'Landscaped Garden', 'Indoor Games', 'Jogging park', 'Yoga centre',
    'Amphitheatre', 'Poolside Party Deck', 'Sklandscaping Party Lawns', 'Sky Lounge', 'Cabana cafe', 'Astro deck',
    'Herbal garden', 'Sky Walkway', 'Yoga Pads', 'UPS', 'Conference Room', 'Cafeteria', 'Garden', 'Terrace',
    'Lawn', 'Intercom', 'Reserved Park', 'CCTV', 'PlayArea', 'Balcony', 'Servant Quarters', 'Gym', 'Internet Connection',
    'Security', 'Parking', 'Swimming Pool', 'Gas Connection', 'Power Backup', 'Rain Water Harvesting', 'Clubhouse',
    'Lift', 'Vaastu', 'Air Conditioning', 'Large Windows/Natural Light', 'Stainless Steel Appliances', 'Laundry'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Add New Property</h2>
        <button
          onClick={onCancel}
          className="bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Property Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Property Type *</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter price"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Area (Sq.ft) *</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter area"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plot Area (Sq.ft)</label>
              <input
                type="number"
                name="plotArea"
                value={formData.plotArea}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter plot area"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bedroom</label>
              <input
                type="number"
                name="bedroom"
                value={formData.bedroom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Number of bedrooms"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Transaction</label>
              <select
                name="transaction"
                value={formData.transaction}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Transaction</option>
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Furnishing</label>
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Furnishing</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Property Age</label>
              <input
                type="text"
                name="propertyAge"
                value={formData.propertyAge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2 years old"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Location Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Flat No./Unit No.</label>
              <input
                type="text"
                name="flatNo"
                value={formData.flatNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Flat/Unit number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Property Name</label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Property name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Building Name</label>
              <input
                type="text"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Building name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Street</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nearby landmark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Pin code"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Location/Area"
                required
              />
            </div>
          </div>
        </div>

        {/* Property Description */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Description</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                name="propertyDescription"
                value={formData.propertyDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed property description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Information</label>
              <textarea
                name="detailedInformation"
                value={formData.detailedInformation}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional detailed information"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* YouTube URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL</label>
          <input
            type="url"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Property Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Property...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

AddPropertyForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddPropertyForm;