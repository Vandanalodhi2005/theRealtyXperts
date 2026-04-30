import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { HiPlus, HiCloudUpload, HiX } from 'react-icons/hi';

const AddProjectForm = ({ onCancel, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || '',
    status: initialData?.status || 'upcoming',
    price: initialData?.price || '',
    location: initialData?.location || '',
    city: initialData?.city || 'Bhopal',
    description: initialData?.description || '',
    highlights: initialData?.highlights || '',
    amenities: initialData?.amenities || '',
    youtubeUrl: initialData?.youtubeUrl || '',
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const url = initialData 
        ? `${import.meta.env.VITE_BACKEND_URL}/api/projects/${initialData._id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/projects`;

      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success(`Project ${initialData ? 'updated' : 'added'} successfully!`);
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || 'Error processing request');
      }
    } catch (err) {
      setError('System connection error');
    } finally {
      setLoading(false);
    }
  };

  const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
  const labelStyle = { fontSize: '13px', fontWeight: '700', color: 'var(--color-navy)' };
  const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #E6E9EF', backgroundColor: '#F8F9FA', fontSize: '14px', outline: 'none' };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-navy)' }}>Add New Project</h2>
        <div style={{ height: '4px', width: '60px', backgroundColor: 'var(--color-gold)', borderRadius: '2px' }}></div>
      </div>

      <form onSubmit={handleSubmit} className="modal-content" style={cardStyle}>
        {error && <div style={{ background: '#FFEBEE', color: '#F44336', padding: '15px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px' }}>{error}</div>}

        <div className="form-grid" style={formGridStyle}>
          {/* Title */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} style={inputStyle} placeholder="Project Title" required />
          </div>

          {/* Type */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Type *</label>
            <select name="type" value={formData.type} onChange={handleInputChange} style={inputStyle} required>
              <option value="">Select Type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="investment">Investment</option>
              <option value="mixed">Mixed-use</option>
              <option value="plot">Plot</option>
            </select>
          </div>

          {/* Status */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Status *</label>
            <select name="status" value={formData.status} onChange={handleInputChange} style={inputStyle} required>
              <option value="upcoming">Upcoming</option>
              <option value="under-construction">Under Construction</option>
              <option value="ready-to-move">Ready to Move</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Price */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Price (Starting from) *</label>
            <input type="text" name="price" value={formData.price} onChange={handleInputChange} style={inputStyle} placeholder="₹45,00,000" required />
          </div>

          {/* Location */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Location *</label>
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} style={inputStyle} placeholder="Location/Area" required />
          </div>

          {/* City */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>City *</label>
            <input type="text" name="city" value={formData.city} onChange={handleInputChange} style={inputStyle} placeholder="Bhopal" required />
          </div>
        </div>

        {/* Description */}
        <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
          <label style={labelStyle}>Description *</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '100px' }} placeholder="Project description" required />
        </div>

        {/* Highlights */}
        <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
          <label style={labelStyle}>Highlights (comma separated)</label>
          <textarea name="highlights" value={formData.highlights} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '60px' }} placeholder="Green campus, Gated community, Smart homes" />
        </div>

        {/* Amenities */}
        <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
          <label style={labelStyle}>Amenities (comma separated)</label>
          <textarea name="amenities" value={formData.amenities} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '60px' }} placeholder="Swimming Pool, Gym, Clubhouse" />
        </div>

        {/* YouTube URL */}
        <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
          <label style={labelStyle}>YouTube URL</label>
          <input type="url" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleInputChange} style={inputStyle} placeholder="https://youtube.com/watch?v=..." />
        </div>

        {/* Images */}
        <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
          <label style={labelStyle}>Images</label>
          <div style={uploadBoxStyle}>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} style={hiddenFileInputStyle} id="fileInput" />
            <label htmlFor="fileInput" style={uploadLabelStyle}>
              <HiCloudUpload size={30} />
              <span>{images.length > 0 ? `${images.length} files selected` : 'Drag & drop or click to upload images'}</span>
            </label>
          </div>
          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginTop: '15px' }}>
              {images.map((img, idx) => (
                <div key={idx} style={previewBoxStyle}>
                  <img src={URL.createObjectURL(img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                  <button type="button" onClick={() => removeImage(idx)} style={removeImageButtonStyle}><HiX /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #E6E9EF', background: 'white', fontWeight: 'bold', cursor: 'pointer', color: '#666' }}>Cancel</button>
          <button disabled={loading} type="submit" style={{ flex: 2, padding: '14px', borderRadius: '10px', background: 'var(--color-gold)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(243, 156, 18, 0.2)' }}>
            {loading ? 'Processing...' : 'Add Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Styles
const cardStyle = { backgroundColor: 'white', borderRadius: '15px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '30px' };
const formGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' };
const uploadBoxStyle = { border: '2px dashed #E6E9EF', borderRadius: '12px', backgroundColor: '#F8F9FA', padding: '30px', textAlign: 'center', cursor: 'pointer', position: 'relative' };
const hiddenFileInputStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' };
const uploadLabelStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#90A4AE', fontSize: '14px', fontWeight: '600' };
const previewBoxStyle = { position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E6E9EF' };
const removeImageButtonStyle = { position: 'absolute', top: '5px', right: '5px', background: '#F44336', color: 'white', border: 'none', borderRadius: '4px', padding: '2px', cursor: 'pointer' };

AddProjectForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AddProjectForm;
