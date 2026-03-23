import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, X, UploadCloud } from 'lucide-react';
import './admin.css';

const AMENITIES_LIST = [
  "Water Softener", "Kids Play Area", "Volleyball Court", "Badminton Court", 
  "Cricket Pitch", "Wifi", "Dining Table", "Curtains", "Chimney", "Microwave", 
  "Stove", "Water Purifier", "Washing Machine", "Fans", "Lights", "Exhaust Fan", 
  "Sofa", "Wardrobe", "T.V", "Geysers", "Modular Kitchen", "Air Condition", 
  "Refrigerator", "Earthquake Resistant", "Landscaped Garden", "Indoor Games", 
  "Jogging park", "Yoga centre", "Amphitheatre", "Poolside Party Deck", 
  "Sklandscaping Party Lawns", "Sky Lounge", "Cabana cafe", "Astro deck", 
  "Herbal garden", "Sky Walkway", "Yoga Pads", "UPS", "Conference Room", 
  "Cafeteria", "Garden", "Terrace", "Lawn", "Intercom", "Reserved Park", 
  "CCTV", "PlayArea", "Balcony", "Servant Quarters", "Gym", "Internet Connection", 
  "Security", "Parking", "Swimming Pool", "Gas Connection", "Power Backup", 
  "Rain Water Harvesting", "Clubhouse", "Lift", "Vaastu", "Air Conditioning", 
  "Large Windows/Natural Light", "Stainless Steel Appliances", "Laundry"
];

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);

  const handlePreview = (prop) => {
    setPreviewData(prop);
    setIsPreviewOpen(true);
  };
  
  const initialForm = { 
    id: '', title: '', status: 'available', type: 'apartment', price: '', 
    area: '', plotArea: '', bedrooms: '', transaction: 'new', furnishing: 'unfurnished', age: '',
    flatNo: '', propertyName: '', buildingName: '', street: '', landmark: '', 
    pincode: '', address: '', city: '', location: '',
    highlights: '',
    description: '',
    detailedInfo: '',
    amenities: [],
    youtubeUrl: '', coverImage: ''
  };
  
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const saved = localStorage.getItem('trx_properties');
    if (saved) {
      setProperties(JSON.parse(saved));
    } else {
      // Default initial dummy data
      const defaultData = [
        { ...initialForm, id: 1, title: 'Flat', type: 'apartment', location: 'Hoshangabad road bhopal, Bhopal', price: '₹3,800,000', status: 'available', city: 'Bhopal', bedrooms: '2', area: '1200' },
        { ...initialForm, id: 2, title: 'Shiv Residency', type: 'commercial', location: 'Arera Colony, Bhopal', price: '₹6,500,000', status: 'available', city: 'Bhopal', area: '2500' },
      ];
      setProperties(defaultData);
      localStorage.setItem('trx_properties', JSON.stringify(defaultData));
    }
  }, []);

  const saveToStorage = (newData) => {
    setProperties(newData);
    localStorage.setItem('trx_properties', JSON.stringify(newData));
  };

  const handleOpenModal = (prop = null) => {
    if (prop) {
      setEditingProperty(prop);
      const editData = { ...initialForm, ...prop };
      if (Array.isArray(prop.highlights)) editData.highlights = prop.highlights.join(', ');
      setFormData(editData);
    } else {
      setEditingProperty(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      if (exists) {
        return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleImageSimulation = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Process Highlights into array
    const processedHighlights = formData.highlights 
      ? formData.highlights.split(',').map(h => h.trim()) 
      : [];
      
    // Use Property Name or Building Name as Title if Title is empty
    const finalTitle = formData.title || formData.propertyName || formData.buildingName || "Unnamed Property";
    const finalData = { 
      ...formData, 
      title: finalTitle,
      highlights: processedHighlights
    };

    let newData;
    if (editingProperty) {
      newData = properties.map(p => p.id === editingProperty.id ? { ...finalData, id: p.id } : p);
    } else {
      newData = [{ ...finalData, id: Date.now() }, ...properties];
    }
    saveToStorage(newData);
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      const newData = properties.filter(p => p.id !== id);
      saveToStorage(newData);
    }
  };

  // Section Styles
  const sectionGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' };
  const sectionTitleStyle = { fontSize: '1.1rem', fontWeight: 600, color: 'var(--admin-primary)', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '1.5rem' };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Properties Management</h2>
          <p className="admin-text-muted">Manage all property listings</p>
        </div>
        <button className="admin-btn" onClick={() => handleOpenModal()} style={{ width: 'auto' }}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add New Property
        </button>
      </div>

      <div className="admin-dashboard-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr><td colSpan="5" className="admin-text-muted" style={{textAlign: 'center', padding: '2rem'}}>No properties found. Add one!</td></tr>
              ) : properties.map(prop => (
                <tr key={prop.id}>
                  <td>
                    <div className="admin-prop-info">
                      <h4>{prop.title}</h4>
                      <span className="admin-badge" style={{ marginTop: '4px', backgroundColor: 'var(--admin-bg)' }}>{prop.type}</span>
                    </div>
                  </td>
                  <td><span className="admin-text-muted-table">{prop.location} {prop.city ? `, ${prop.city}` : ''}</span></td>
                  <td style={{ fontWeight: 600 }}>{prop.price || 'Price on Request'}</td>
                  <td>
                    <select 
                      className={`admin-select ${prop.status === 'available' ? 'admin-badge success' : prop.status === 'sold' ? 'admin-badge danger' : 'admin-badge warning'}`} 
                      value={prop.status}
                      onChange={(e) => {
                        const newData = properties.map(p => p.id === prop.id ? { ...p, status: e.target.value } : p);
                        setProperties(newData);
                        localStorage.setItem('trx_properties', JSON.stringify(newData));
                      }}
                      style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.75rem', fontWeight: 600, border: 'none', textTransform: 'capitalize' }}
                    >
                      <option value="available">Available</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                    </select>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" title="Quick Preview" onClick={() => handlePreview(prop)}>
                        <Eye size={16} />
                      </button>
                      <button className="admin-action-btn" title="Edit" onClick={() => handleOpenModal(prop)}><Edit size={16} /></button>
                      <button className="admin-action-btn danger" title="Delete" onClick={() => handleDelete(prop.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Massive Property Modal */}
      {isModalOpen && (
        // ... (existing modal remains same)
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
            {/* Form content */}
            <div className="admin-modal-header">
              <h3>{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
              <button className="admin-modal-close" onClick={closeModal}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* ... existing form fields ... */}
                <div className="admin-modal-body" style={{ padding: '0 1.5rem 1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                <h4 style={sectionTitleStyle}>Property Information</h4>
                <div style={sectionGridStyle}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Status *</label>
                    <select required className="admin-select" name="status" value={formData.status} onChange={handleChange}>
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Property Type *</label>
                    <select required className="admin-select" name="type" value={formData.type} onChange={handleChange}>
                      <option value="apartment">Apartment / Flat</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                      <option value="plot">Plot / Land</option>
                    </select>
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Price *</label>
                    <input required className="admin-input" type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Area (Sq.ft) *</label>
                    <input required className="admin-input" type="text" name="area" value={formData.area} onChange={handleChange} placeholder="Enter area" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Plot Area (Sq.ft)</label>
                    <input className="admin-input" type="text" name="plotArea" value={formData.plotArea} onChange={handleChange} placeholder="Enter plot area" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Bedroom</label>
                    <input className="admin-input" type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Number of bedrooms" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Transaction</label>
                    <select className="admin-select" name="transaction" value={formData.transaction} onChange={handleChange}>
                      <option value="new">New Property</option>
                      <option value="resale">Resale</option>
                      <option value="rent">Rent / Lease</option>
                    </select>
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Furnishing</label>
                    <select className="admin-select" name="furnishing" value={formData.furnishing} onChange={handleChange}>
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="fully-furnished">Fully Furnished</option>
                    </select>
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Property Age</label>
                    <input className="admin-input" type="text" name="age" value={formData.age} onChange={handleChange} placeholder="e.g., 2 years old" />
                  </div>
                </div>

                <h4 style={sectionTitleStyle}>Location Information</h4>
                <div style={sectionGridStyle}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Flat No./Unit No.</label>
                    <input className="admin-input" type="text" name="flatNo" value={formData.flatNo} onChange={handleChange} placeholder="Flat/Unit number" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Property Name</label>
                    <input className="admin-input" type="text" name="propertyName" value={formData.propertyName} onChange={handleChange} placeholder="Property name (e.g. Arista Luxe)" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Building Name</label>
                    <input className="admin-input" type="text" name="buildingName" value={formData.buildingName} onChange={handleChange} placeholder="Building name" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Street</label>
                    <input className="admin-input" type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street name" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Landmark</label>
                    <input className="admin-input" type="text" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Nearby landmark" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Pin Code</label>
                    <input className="admin-input" type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pin code" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>City *</label>
                    <input required className="admin-input" type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Location / Area *</label>
                    <input required className="admin-input" type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location/Area" />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginTop: '1rem' }}>
                  <label>Full Address</label>
                  <textarea className="admin-input" name="address" value={formData.address} onChange={handleChange} placeholder="Full address" rows="2"></textarea>
                </div>

                <h4 style={sectionTitleStyle}>Property Description & Highlights</h4>
                <div className="admin-form-group">
                  <label>Key Highlights (comma separated)</label>
                  <input className="admin-input" type="text" name="highlights" value={formData.highlights} onChange={handleChange} placeholder="e.g. Near Metro, Corner Plot, Park Facing" />
                </div>
                <div className="admin-form-group">
                  <label>Description (Short)</label>
                  <input className="admin-input" type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Brief summary" />
                </div>
                <div className="admin-form-group">
                  <label>Detailed Information</label>
                  <textarea className="admin-input" name="detailedInfo" value={formData.detailedInfo} onChange={handleChange} placeholder="Detailed property description..." rows="4"></textarea>
                </div>

                <h4 style={sectionTitleStyle}>Amenities</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {AMENITIES_LIST.map((amenity, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--admin-text-main)' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        style={{ accentColor: 'var(--admin-primary)', width: '16px', height: '16px' }}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>

                <h4 style={sectionTitleStyle}>Property Media</h4>
                <div style={sectionGridStyle}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>YouTube URL</label>
                    <input className="admin-input" type="url" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Property Image</label>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem', border: '1px dashed var(--admin-border)', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fafafa', color: 'var(--admin-text-muted)' }}>
                      <UploadCloud size={20} />
                      {formData.coverImage ? 'Image Selected' : 'Choose File'}
                      <input type="file" style={{ display: 'none' }} onChange={handleImageSimulation} accept="image/*" />
                    </label>
                    {formData.coverImage && (
                      <div style={{ marginTop: '10px', width: '100%', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                        <img src={formData.coverImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#eee' }} />
                      </div>
                    )}
                  </div>
                </div>
                </div>
                <div className="admin-modal-footer">
                  <button type="button" className="admin-btn secondary" onClick={closeModal} style={{ width: 'auto' }}>Cancel</button>
                  <button type="submit" className="admin-btn" style={{ width: 'auto' }}>{editingProperty ? 'Save Changes' : 'Add Property'}</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Preview Modal */}
      {isPreviewOpen && previewData && (
        <div className="admin-modal-overlay" onClick={() => setIsPreviewOpen(false)} style={{ zIndex: 9999 }}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%', padding: '0', borderRadius: '15px', overflow: 'hidden' }}>
            <div className="admin-modal-header" style={{ padding: '20px 30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>Property Details</h3>
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={24}/>
                </button>
            </div>
            
            <div className="admin-modal-body" style={{ maxHeight: '80vh', overflowY: 'auto', padding: '25px 30px' }}>
              {/* Dual Images at top */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '280px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <img src={previewData.coverImage || '/placeholder.jpg'} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '280px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <img src={previewData.coverImage || '/placeholder.jpg'} alt="Secondary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
                {/* Left Column: Basic Information */}
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#1e293b', fontWeight: 700 }}>Basic Information</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Property Title:', value: previewData.title || 'N/A' },
                      { label: 'Property Name:', value: previewData.propertyName || 'N/A' },
                      { label: 'Type:', value: previewData.type, transform: 'capitalize' },
                      { 
                        label: 'Status:', 
                        value: <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>{previewData.status || 'Available'}</span> 
                      },
                      { label: 'Price:', value: previewData.price, color: '#f59e0b', weight: 700 },
                      { label: 'Area:', value: previewData.area + ' sq.ft' },
                      { label: 'Plot Area:', value: (previewData.plotArea || 'N/A') + ' sq.ft' },
                      { label: 'Bedrooms:', value: previewData.bedrooms || 'N/A' },
                      { label: 'Transaction:', value: previewData.transaction, transform: 'capitalize' },
                      { label: 'Furnishing:', value: previewData.furnishing, transform: 'capitalize' },
                      { label: 'Quality / Age:', value: (previewData.age || 'New') + ' Years' },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <span style={{ color: '#64748b', fontSize: '0.95rem' }}>{row.label}</span>
                        <span style={{ 
                          color: row.color || '#1e293b', 
                          fontWeight: row.weight || 600, 
                          textTransform: row.transform || 'none',
                          fontSize: '0.95rem'
                        }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Location Details */}
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#1e293b', fontWeight: 700 }}>Location Details</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'City:', value: previewData.city || 'Bhopal' },
                      { label: 'Location:', value: previewData.location || 'N/A' },
                      { label: 'Street:', value: previewData.street || 'N/A' },
                      { label: 'Flat No:', value: previewData.flatNo || 'N/A' },
                      { label: 'Building:', value: previewData.buildingName || 'N/A' },
                      { label: 'Landmark:', value: previewData.landmark || 'N/A' },
                      { label: 'Pin Code:', value: previewData.pincode || 'N/A' },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <span style={{ color: '#64748b', fontSize: '0.95rem' }}>{row.label}</span>
                        <span style={{ color: '#1e293b', fontWeight: 600, textAlign: 'right', fontSize: '0.95rem' }}>{row.value}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: '10px' }}>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '5px' }}>Full Address:</p>
                        <p style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.5' }}>{previewData.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities & Highlights */}
              <div style={{ marginTop: '40px', borderTop: '2px dashed #f1f5f9', paddingTop: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
                    {/* Amenities */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#1e293b', fontWeight: 700 }}>Selected Amenities</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {previewData.amenities && previewData.amenities.length > 0 ? (
                                previewData.amenities.map((a, i) => (
                                    <span key={i} style={{ backgroundColor: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{a}</span>
                                ))
                            ) : (
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No amenities selected</span>
                            )}
                        </div>
                    </div>
                    {/* Highlights */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#1e293b', fontWeight: 700 }}>Property Highlights</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {(Array.isArray(previewData.highlights) ? previewData.highlights : (previewData.highlights || '').split(',')).map((h, i) => (
                                h && <span key={i} style={{ backgroundColor: '#fdfcf0', border: '1px solid #fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{typeof h === 'string' ? h.trim() : h}</span>
                            ))}
                        </div>
                    </div>
                </div>
              </div>

              {/* Extra Stuff (Description, Video) below the main grid */}
              <div style={{ marginTop: '40px', borderTop: '2px dashed #f1f5f9', paddingTop: '30px' }}>
                 <h4 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#1e293b', fontWeight: 700 }}>Additional Features & Description</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div>
                        <p style={{ color: '#445569', fontWeight: 600, fontSize: '0.85rem', marginBottom: '5px' }}>Short Summary:</p>
                        <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '15px' }}>{previewData.description || 'N/A'}</p>
                        
                        <p style={{ color: '#445569', fontWeight: 600, fontSize: '0.85rem', marginBottom: '5px' }}>Detailed Information:</p>
                        <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.95rem' }}>{previewData.detailedInfo || 'N/A'}</p>
                    </div>
                    {previewData.youtubeUrl && (
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: '0', borderRadius: '10px', overflow: 'hidden' }}>
                            <iframe 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                src={`https://www.youtube.com/embed/${previewData.youtubeUrl.split('v=')[1]?.split('&')[0] || previewData.youtubeUrl.split('/').pop()}`}
                                title="YouTube video" frameBorder="0" allowFullScreen
                            ></iframe>
                        </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
