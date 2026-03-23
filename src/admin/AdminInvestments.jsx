import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, X, UploadCloud } from 'lucide-react';
import './admin.css';

const AdminInvestments = () => {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('trx_investments');
    if (saved) {
      setInvestments(JSON.parse(saved));
    } else {
      const defaultData = [
        { id: 1, title: 'Test', type: 'agricultural', location: 'bhopal, Bhopal', price: '₹10,000,000', status: 'available' },
      ];
      setInvestments(defaultData);
      localStorage.setItem('trx_investments', JSON.stringify(defaultData));
    }
  }, []);

  const saveToStorage = (newData) => {
    setInvestments(newData);
    localStorage.setItem('trx_investments', JSON.stringify(newData));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [editingInvestment, setEditingInvestment] = useState(null);

  const handlePreview = (inv) => {
    setPreviewData(inv);
    setIsPreviewOpen(true);
  };
  
  const initialForm = { 
    title: '', 
    type: 'agricultural', 
    location: '', 
    city: 'Bhopal',
    price: '', 
    status: 'available', 
    description: '', 
    highlights: '', 
    amenities: '', 
    youtubeUrl: '', 
    coverImage: '' 
  };
  const [formData, setFormData] = useState(initialForm);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (inv = null) => {
    if (inv) {
      setEditingInvestment(inv);
      const editData = { ...inv };
      if (Array.isArray(inv.highlights)) editData.highlights = inv.highlights.join(', ');
      if (Array.isArray(inv.amenities)) editData.amenities = inv.amenities.join(', ');
      setFormData(editData);
    } else {
      setEditingInvestment(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Process comma separated fields into arrays
    const formattedData = {
      ...formData,
      highlights: formData.highlights ? formData.highlights.split(',').map(item => item.trim()) : [],
      amenities: formData.amenities ? formData.amenities.split(',').map(item => item.trim()) : []
    };

    let newData;
    if (editingInvestment) {
      newData = investments.map(p => p.id === editingInvestment.id ? { ...formattedData, id: p.id } : p);
    } else {
      newData = [{ ...formattedData, id: Date.now() }, ...investments];
    }
    saveToStorage(newData);
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this investment?")) {
      const newData = investments.filter(p => p.id !== id);
      saveToStorage(newData);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Land Investments</h2>
          <p className="admin-text-muted">Manage land investment opportunities</p>
        </div>
        <button className="admin-btn" onClick={() => handleOpenModal()} style={{ width: 'auto' }}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add Investment
        </button>
      </div>

      <div className="admin-dashboard-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.length === 0 ? (
                <tr><td colSpan="6" className="admin-text-muted text-center" style={{padding: '2rem'}}>No investments found. Add one!</td></tr>
              ) : investments.map(inv => (
                <tr key={inv.id}>
                  <td><h4 style={{ margin: 0 }}>{inv.title}</h4></td>
                  <td><span className="admin-text-muted-table">{inv.location}</span></td>
                  <td><span className="admin-badge" style={{ backgroundColor: 'var(--admin-bg)' }}>{inv.type}</span></td>
                  <td style={{ fontWeight: 600 }}>{inv.price}</td>
                  <td>
                    <select 
                      className={`admin-select ${inv.status === 'available' ? 'admin-badge success' : inv.status === 'sold' ? 'admin-badge danger' : 'admin-badge warning'}`} 
                      value={inv.status}
                      onChange={(e) => {
                        const newData = investments.map(p => p.id === inv.id ? { ...p, status: e.target.value } : p);
                        setInvestments(newData);
                        localStorage.setItem('trx_investments', JSON.stringify(newData));
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
                      <button className="admin-action-btn" title="Quick Preview" onClick={() => handlePreview(inv)}>
                        <Eye size={16} />
                      </button>
                      <button className="admin-action-btn" title="Edit" onClick={() => handleOpenModal(inv)}><Edit size={16} /></button>
                      <button className="admin-action-btn danger" title="Delete" onClick={() => handleDelete(inv.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>      {/* Investment Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingInvestment ? 'Edit Investment' : 'Add New Investment'}</h3>
              <button className="admin-modal-close" onClick={closeModal}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="admin-form-group">
                  <label>Title *</label>
                  <input required className="admin-input" type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Investment Title" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="admin-form-group">
                    <label>Type *</label>
                    <select className="admin-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="agricultural">Agricultural Land</option>
                      <option value="commercial">Commercial Land</option>
                      <option value="residential">Residential Land</option>
                      <option value="industrial">Industrial Land</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Status *</label>
                    <select className="admin-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="pending">Pending / Booked</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="admin-form-group">
                    <label>Price *</label>
                    <input required className="admin-input" type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. ₹1.5 Cr" />
                  </div>
                  <div className="admin-form-group">
                    <label>City *</label>
                    <input required className="admin-input" type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Bhopal" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Location / Area *</label>
                  <input required className="admin-input" type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Sehore Road" />
                </div>
                <div className="admin-form-group">
                  <label>Description *</label>
                  <textarea required className="admin-input" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed investment summary..." style={{ resize: 'vertical' }}></textarea>
                </div>
                <div className="admin-form-group">
                  <label>Highlights (comma separated)</label>
                  <input className="admin-input" type="text" value={formData.highlights} onChange={e => setFormData({...formData, highlights: e.target.value})} placeholder="e.g. Road facing, Clear title" />
                </div>
                <div className="admin-form-group">
                  <label>Amenities / Features (comma separated)</label>
                  <input className="admin-input" type="text" value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} placeholder="e.g. Borewell, Fencing" />
                </div>
                <div className="admin-form-group">
                  <label>YouTube URL</label>
                  <input className="admin-input" type="text" value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
                </div>
                <div className="admin-form-group">
                  <label>Investment Image</label>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem', border: '1px dashed var(--admin-border)', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fafafa', color: 'var(--admin-text-muted)' }}>
                    <UploadCloud size={20} />
                    {formData.coverImage ? 'Image Selected' : 'Choose File'}
                    <input type="file" style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" />
                  </label>
                  {formData.coverImage && (
                    <div style={{ marginTop: '10px', width: '100%', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                      <img src={formData.coverImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#eee' }} />
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn secondary" onClick={closeModal} style={{ width: 'auto' }}>Cancel</button>
                <button type="submit" className="admin-btn" style={{ width: 'auto' }}>{editingInvestment ? 'Save Changes' : 'Add Investment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Investment Preview Modal */}
      {isPreviewOpen && previewData && (
        <div className="admin-modal-overlay" onClick={() => setIsPreviewOpen(false)} style={{ zIndex: 9999 }}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%', padding: '0', borderRadius: '15px', overflow: 'hidden' }}>
            <div className="admin-modal-header" style={{ padding: '20px 30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>Investment Details</h3>
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
                {/* Left Column: Investment Information */}
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#1e293b', fontWeight: 700 }}>Investment Overview</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Investment Title:', value: previewData.title || 'N/A' },
                      { label: 'Land Category:', value: previewData.type, transform: 'capitalize' },
                      { 
                        label: 'Current Status:', 
                        value: <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>{previewData.status || 'Available'}</span> 
                      },
                      { label: 'Investment Value:', value: previewData.price, color: '#b45309', weight: 700 },
                      { label: 'City:', value: previewData.city || 'Bhopal' },
                      { label: 'Land Location:', value: previewData.location || 'N/A' },
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

                {/* Right Column: Highlights & Features */}
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#1e293b', fontWeight: 700 }}>Land Highlights</h4>
                  <div style={{ marginBottom: '25px' }}>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Key Selling Points</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(Array.isArray(previewData.highlights) ? previewData.highlights : (previewData.highlights || '').split(',')).map((h, i) => (
                            <span key={i} style={{ backgroundColor: '#ecfdf5', border: '1px solid #d1fae5', color: '#065f46', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                                {typeof h === 'string' ? h.trim() : h}
                            </span>
                        ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Utility Features</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(Array.isArray(previewData.amenities) ? previewData.amenities : (previewData.amenities || '').split(',')).map((a, i) => (
                            <span key={i} style={{ backgroundColor: '#eef2ff', border: '1px solid #e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                                {typeof a === 'string' ? a.trim() : a}
                            </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Stuff */}
              <div style={{ marginTop: '40px', borderTop: '2px dashed #f1f5f9', paddingTop: '30px' }}>
                 <h4 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#1e293b', fontWeight: 700 }}>Detailed Analysis & Site Visit</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div>
                        <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.95rem' }}>{previewData.description || 'No description provided.'}</p>
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

export default AdminInvestments;
