import React, { useState, useEffect } from 'react';
import { FileCheck, Clock, CheckCircle, XCircle, Download } from 'lucide-react';
import './admin.css';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('trx_submissions');
    if (saved) {
      setSubmissions(JSON.parse(saved));
    } else {
      const defaultData = [
        { 
          id: 1, title: '3BHK - Test', user: 'Satyam Kumar', email: 'satyamkumar2716@gmail.com', phone: '6203176139', 
          category: 'commercial', type: 'rent', price: '₹3,000', location: 'bhopal', bedrooms: '6', area: '10000', date: '3/20/2026', status: 'pending' 
        }
      ];
      setSubmissions(defaultData);
      localStorage.setItem('trx_submissions', JSON.stringify(defaultData));
    }
  }, []);

  const saveToStorage = (newData) => {
    setSubmissions(newData);
    localStorage.setItem('trx_submissions', JSON.stringify(newData));
  };

  const handleStatusChange = (id, newStatus) => {
    const newData = submissions.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub);
    saveToStorage(newData);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Title,User,Email,Phone,Category,Type,Price,Location,Bedrooms,Area,Date,Status'];
    const rows = submissions.map(sub => `${sub.id},"${sub.title}","${sub.user}","${sub.email}","${sub.phone}","${sub.category}","${sub.type}","${sub.price}","${sub.location}",${sub.bedrooms},${sub.area},"${sub.date}","${sub.status}"`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "property_submissions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  const stats = [
    { title: 'Total', value: submissions.length.toString(), icon: <FileCheck size={24} />, color: 'blue' },
    { title: 'Pending', value: pendingCount.toString(), icon: <Clock size={24} />, color: 'warning' },
    { title: 'Approved', value: approvedCount.toString(), icon: <CheckCircle size={24} />, color: 'success' },
    { title: 'Rejected', value: rejectedCount.toString(), icon: <XCircle size={24} />, color: 'danger' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Property Submissions</h2>
          <p className="admin-text-muted">{pendingCount} pending submissions to review</p>
        </div>
        <button className="admin-btn" style={{ backgroundColor: '#10b981', width: 'auto' }} onClick={handleExportCSV}>
          <Download size={18} style={{ marginRight: '8px' }} />
          Export to CSV
        </button>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`admin-stat-card ${stat.color} ${stat.title.toLowerCase()}`}>
            <div className="admin-stat-icon">
              {stat.icon}
            </div>
            <div className="admin-stat-details">
              <h3>{stat.title}</h3>
              <p className="admin-stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {submissions.length === 0 ? (
          <div className="admin-text-muted text-center" style={{padding: '2rem'}}>No submissions found.</div>
        ) : submissions.map(sub => (
          <div key={sub.id} className="admin-submission-card">
            <div className="admin-submission-header">
              <div>
                <h3 className="admin-submission-title">{sub.title}</h3>
                <div className="admin-submission-user">
                  <span>{sub.user}</span> &bull; 
                  <span>{sub.email}</span> &bull; 
                  <span>{sub.phone}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <select 
                  className={`admin-select ${sub.status === 'approved' ? 'admin-badge success' : sub.status === 'rejected' ? 'admin-badge danger' : 'admin-badge warning'}`} 
                  value={sub.status}
                  onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                  style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.75rem', fontWeight: 600, border: 'none' }}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            <div className="admin-submission-details">
              <div className="admin-detail-item">
                <span className="admin-detail-label">Category</span>
                <span className="admin-detail-value" style={{textTransform: 'capitalize'}}>{sub.category}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-label">Type</span>
                <span className="admin-detail-value" style={{textTransform: 'capitalize'}}>{sub.type}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-label">Price</span>
                <span className="admin-detail-value">{sub.price}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-label">Location</span>
                <span className="admin-detail-value">{sub.location}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-label">Bedrooms</span>
                <span className="admin-detail-value">{sub.bedrooms}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-label">Area</span>
                <span className="admin-detail-value">{sub.area} sq.ft</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-label">Submitted</span>
                <span className="admin-detail-value">{sub.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSubmissions;
