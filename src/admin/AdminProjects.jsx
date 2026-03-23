import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, X, UploadCloud } from 'lucide-react';
import './admin.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('trx_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      const defaultData = [
        { id: 1, title: 'Test', type: 'residential', location: 'bhopal, Bhopal', price: '₹4,500,000', status: 'under-construction' },
      ];
      setProjects(defaultData);
      localStorage.setItem('trx_projects', JSON.stringify(defaultData));
    }
  }, []);

  const saveToStorage = (newData) => {
    setProjects(newData);
    localStorage.setItem('trx_projects', JSON.stringify(newData));
  };  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const handlePreview = (proj) => {
    setPreviewData(proj);
    setIsPreviewOpen(true);
  };

  const initialForm = { 
    title: '', 
    type: 'residential', 
    location: '', 
    city: 'Bhopal', 
    price: '', 
    status: 'planned', 
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

  const handleOpenModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      // For editing, we might need to join arrays back to comma strings if they were saved as arrays
      const editData = { ...proj };
      if (Array.isArray(proj.highlights)) editData.highlights = proj.highlights.join(', ');
      if (Array.isArray(proj.amenities)) editData.amenities = proj.amenities.join(', ');
      setFormData(editData);
    } else {
      setEditingProject(null);
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
    if (editingProject) {
      newData = projects.map(p => p.id === editingProject.id ? { ...formattedData, id: p.id } : p);
    } else {
      newData = [{ ...formattedData, id: Date.now() }, ...projects];
    }
    saveToStorage(newData);
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const newData = projects.filter(p => p.id !== id);
      saveToStorage(newData);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Projects Management</h2>
          <p className="admin-text-muted">Manage developmental projects</p>
        </div>
        <button className="admin-btn" onClick={() => handleOpenModal()} style={{ width: 'auto' }}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add Project
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
              {projects.length === 0 ? (
                <tr><td colSpan="6" className="admin-text-muted text-center" style={{padding: '2rem'}}>No projects found. Add one!</td></tr>
              ) : projects.map(proj => (
                <tr key={proj.id}>
                  <td><h4 style={{ margin: 0 }}>{proj.title}</h4></td>
                  <td><span className="admin-text-muted-table">{proj.location}</span></td>
                  <td><span className="admin-badge" style={{ backgroundColor: 'var(--admin-bg)' }}>{proj.type}</span></td>
                  <td style={{ fontWeight: 600 }}>{proj.price}</td>
                  <td>
                    <select 
                      className={`admin-select ${proj.status === 'completed' ? 'admin-badge success' : proj.status === 'planned' ? 'admin-badge info' : 'admin-badge warning'}`} 
                      value={proj.status}
                      onChange={(e) => {
                        const newData = projects.map(p => p.id === proj.id ? { ...p, status: e.target.value } : p);
                        setProjects(newData);
                        localStorage.setItem('trx_projects', JSON.stringify(newData));
                      }}
                      style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.75rem', fontWeight: 600, border: 'none', textTransform: 'capitalize' }}
                    >
                      <option value="planned">Planned</option>
                      <option value="under-construction">Under Construction</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" title="Quick Preview" onClick={() => handlePreview(proj)}>
                        <Eye size={16} />
                      </button>
                      <button className="admin-action-btn" title="Edit" onClick={() => handleOpenModal(proj)}><Edit size={16} /></button>
                      <button className="admin-action-btn danger" title="Delete" onClick={() => handleDelete(proj.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="admin-modal-close" onClick={closeModal}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="admin-form-group">
                  <label>Title *</label>
                  <input required className="admin-input" type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Project Title" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="admin-form-group">
                    <label>Type *</label>
                    <select className="admin-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="investment">Investment</option>
                      <option value="mixed-use">Mixed Use</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Status *</label>
                    <select className="admin-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="planned">Upcoming / Planned</option>
                      <option value="under-construction">Under Construction</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="admin-form-group">
                    <label>Price (Starting from) *</label>
                    <input required className="admin-input" type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. ₹45,00,000" />
                  </div>
                  <div className="admin-form-group">
                    <label>City *</label>
                    <input required className="admin-input" type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Bhopal" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Location / Area *</label>
                  <input required className="admin-input" type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. MP Nagar" />
                </div>
                <div className="admin-form-group">
                  <label>Description *</label>
                  <textarea required className="admin-input" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed project description..." style={{ resize: 'vertical' }}></textarea>
                </div>
                <div className="admin-form-group">
                  <label>Highlights (comma separated)</label>
                  <input className="admin-input" type="text" value={formData.highlights} onChange={e => setFormData({...formData, highlights: e.target.value})} placeholder="e.g. Green campus, Gated community" />
                </div>
                <div className="admin-form-group">
                  <label>Amenities (comma separated)</label>
                  <input className="admin-input" type="text" value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} placeholder="e.g. Swimming Pool, Gym" />
                </div>
                <div className="admin-form-group">
                  <label>YouTube Video URL</label>
                  <input className="admin-input" type="text" value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
                </div>
                <div className="admin-form-group">
                  <label>Project Image</label>
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
                <button type="submit" className="admin-btn" style={{ width: 'auto' }}>{editingProject ? 'Save Changes' : 'Add Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Preview Modal */}
      {isPreviewOpen && previewData && (
        <div className="admin-modal-overlay" onClick={() => setIsPreviewOpen(false)} style={{ zIndex: 9999 }}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%', padding: '0', borderRadius: '15px', overflow: 'hidden' }}>
            <div className="admin-modal-header" style={{ padding: '20px 30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>Project Details</h3>
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
                {/* Left Column: Project Overview */}
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#1e293b', fontWeight: 700 }}>Project Information</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Project Title:', value: previewData.title || 'N/A' },
                      { label: 'Project Type:', value: previewData.type, transform: 'capitalize' },
                      { 
                        label: 'Current Status:', 
                        value: <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>{previewData.status || 'Upcoming'}</span> 
                      },
                      { label: 'Starting Price:', value: previewData.price, color: '#10b981', weight: 700 },
                      { label: 'City:', value: previewData.city || 'Bhopal' },
                      { label: 'Location:', value: previewData.location || 'N/A' },
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

                {/* Right Column: Highlights & Amenities */}
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#1e293b', fontWeight: 700 }}>Highlights & Features</h4>
                  <div style={{ marginBottom: '25px' }}>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Key Highlights</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(Array.isArray(previewData.highlights) ? previewData.highlights : (previewData.highlights || '').split(',')).map((h, i) => (
                            <span key={i} style={{ backgroundColor: '#fdfcf0', border: '1px solid #fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                                {typeof h === 'string' ? h.trim() : h}
                            </span>
                        ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Amenities</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(Array.isArray(previewData.amenities) ? previewData.amenities : (previewData.amenities || '').split(',')).map((a, i) => (
                            <span key={i} style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                                {typeof a === 'string' ? a.trim() : a}
                            </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Stuff */}
              <div style={{ marginTop: '40px', borderTop: '2px dashed #f1f5f9', paddingTop: '30px' }}>
                 <h4 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#1e293b', fontWeight: 700 }}>Description & Video</h4>
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

export default AdminProjects;
