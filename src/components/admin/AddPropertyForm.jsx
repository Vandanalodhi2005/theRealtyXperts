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
    <div className="max-w-5xl mx-auto pb-20 fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#1e293b]">Add New Property</h2>
          <p className="text-slate-500 mt-1">Fill in the details to list a new property on Realty Xperts.</p>
        </div>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
        >
          <i className="fas fa-times"></i> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl font-semibold flex items-center gap-3 animate-shake">
            <i className="fas fa-exclamation-circle text-lg"></i>
            {error}
          </div>
        )}

        {/* Section 1: Core Information */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <h3 className="text-xl font-bold text-[#1e293b] mb-8 flex items-center gap-3">
             <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><i className="fas fa-info-circle"></i></span>
             Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Current Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                required
              >
                <option value="">Select Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Property Type *</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                required
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Market Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="Ex: 4500000"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Carpet Area (Sq.ft) *</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="Ex: 1250"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Bedrooms / Configuration</label>
              <input
                type="number"
                name="bedroom"
                value={formData.bedroom}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="Ex: 3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Furnishing Status</label>
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              >
                <option value="">Select Furnishing</option>
                <option value="furnished">Fully Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Location Details */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500"></div>
          <h3 className="text-xl font-bold text-[#1e293b] mb-8 flex items-center gap-3">
             <span className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"><i className="fas fa-map-marker-alt"></i></span>
             Location & Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Building / Project Name</label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                placeholder="Global Heritage, etc."
              />
            </div>
            
            <div className="space-y-2 text-slate-800">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                placeholder="Bhopal / Noida"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Sector / Locality *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                placeholder="Sector 62, Indrapuri"
                required
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                placeholder="Enter complete address details..."
              />
            </div>
          </div>
        </div>

        {/* Section 3: Media & Assets */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <h3 className="text-xl font-bold text-[#1e293b] mb-8 flex items-center gap-3">
             <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><i className="fas fa-camera"></i></span>
             Property Showcase
          </h3>

          <div className="space-y-8">
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-amber-400 hover:bg-amber-50/10 transition-all cursor-pointer group relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform group-hover:bg-amber-100 group-hover:text-amber-600">
                <i className="fas fa-cloud-upload-alt text-2xl"></i>
              </div>
              <h4 className="mt-4 text-lg font-bold text-[#1e293b]">Click to Upload Images</h4>
              <p className="text-slate-400 text-sm mt-1">High resolution images are recommended (PNG, JPG)</p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 pt-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Virtual Tour Link (YouTube/Vimeo)</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                    <i className="fab fa-youtube"></i>
                 </div>
                 <input
                   type="url"
                   name="youtubeUrl"
                   value={formData.youtubeUrl}
                   onChange={handleInputChange}
                   className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-medium"
                   placeholder="https://youtube.com/watch?v=..."
                 />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Amenities */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-[#1e293b] mb-8 flex items-center gap-3">
             <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><i className="fas fa-th-list"></i></span>
             Amenities & Facilities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {amenitiesList.map((amenity) => {
              const checked = formData.amenities.includes(amenity);
              return (
                <label 
                  key={amenity} 
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    checked 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm' 
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleAmenityChange(amenity)}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                    checked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'
                  }`}>
                    {checked && <i className="fas fa-check text-[10px]"></i>}
                  </div>
                  <span className="text-xs">{amenity}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-6 pt-10">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 bg-white text-slate-600 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Go Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 Processing...
              </span>
            ) : 'Publish Property Listing'}
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