import React, { useState, useEffect } from 'react';
import { Download, MessageSquare, Mail, CornerDownRight } from 'lucide-react';
import './admin.css';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('trx_inquiries');
    if (saved) {
      setInquiries(JSON.parse(saved));
    } else {
      const defaultData = [
        { id: 1, name: 'Rahul Sharma', subject: 'Inquiry about Shiv Residency 3BHK flat price...', time: '2 hours ago', status: 'unread', initials: 'RS' },
        { id: 2, name: 'Sneha Patel', subject: 'Looking for a commercial plot in MP Nagar...', time: '5 hours ago', status: 'read', initials: 'SP' }
      ];
      setInquiries(defaultData);
      localStorage.setItem('trx_inquiries', JSON.stringify(defaultData));
    }
  }, []);

  const saveToStorage = (newData) => {
    setInquiries(newData);
    localStorage.setItem('trx_inquiries', JSON.stringify(newData));
  };

  const handleStatusChange = (id, newStatus) => {
    const newData = inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq);
    saveToStorage(newData);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Subject,Time,Status'];
    const rows = inquiries.map(inq => `${inq.id},"${inq.name}","${inq.subject}","${inq.time}","${inq.status}"`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customer_inquiries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      const newData = inquiries.filter(inq => inq.id !== id);
      saveToStorage(newData);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear ALL inquiries?")) {
      saveToStorage([]);
    }
  };

  const unreadCount = inquiries.filter(i => i.status === 'unread').length;
  const readCount = inquiries.filter(i => i.status === 'read').length;

  const stats = [
    { title: 'Total Leads', value: inquiries.length.toString(), icon: <MessageSquare size={24} />, color: 'blue' },
    { title: 'Unread', value: unreadCount.toString(), icon: <Mail size={24} />, color: 'red' },
    { title: 'Responded', value: readCount.toString(), icon: <CornerDownRight size={24} />, color: 'green' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Customer Leads & Inquiries</h2>
          <p className="admin-text-muted">Direct messages from Contact Us and Property Details forms</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="admin-btn" style={{ backgroundColor: '#ef4444', border: 'none' }} onClick={handleClearAll}>
            Clear All
          </button>
          <button className="admin-btn" style={{ backgroundColor: '#10b981', border: 'none' }} onClick={handleExportCSV}>
            <Download size={18} style={{ marginRight: '8px' }} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`admin-stat-card ${stat.color}`}>
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

      <div className="admin-dashboard-card">
        <div className="admin-card-header">
          <h2>Inbox</h2>
        </div>
        <div className="admin-inquiry-list" style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#eee' }}>
          {inquiries.length === 0 ? (
            <div className="admin-text-muted text-center" style={{padding: '3rem', backgroundColor: 'white'}}>No inquiries found yet.</div>
          ) : inquiries.map(inq => (
            <div key={inq.id} className="admin-inquiry-item" style={{ backgroundColor: 'white', padding: '20px', display: 'grid', gridTemplateColumns: '80px 1fr 150px', gap: '20px', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="admin-avatar" style={{ margin: '0', width: '50px', height: '50px', fontSize: '1.2rem' }}>{inq.initials}</div>
                  <span style={{ fontSize: '0.75rem', color: '#999', fontWeight: '500' }}>#{inq.id.toString().slice(-4)}</span>
              </div>
              
              <div className="admin-inquiry-content" style={{ padding: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{inq.name}</h4>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'var(--color-teal)' }}>
                        <span><i className="fas fa-envelope"></i> {inq.email}</span>
                        <span style={{ color: '#999' }}><i className="fas fa-clock"></i> {inq.time}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ margin: '12px 0', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '4px', borderLeft: '3px solid var(--color-gold)' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>Subject: {inq.subject}</div>
                    <p style={{ margin: '0', fontSize: '0.95rem', color: '#444', lineHeight: '1.5' }}>{inq.message}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select 
                  className={`admin-status-select ${inq.status}`} 
                  value={inq.status}
                  onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="unread">Unread</option>
                  <option value="read">Responded</option>
                </select>
                <button 
                  onClick={() => handleDelete(inq.id)}
                  style={{ padding: '8px', border: '1px solid #ffcccc', color: '#ef4444', borderRadius: '4px', backgroundColor: '#fff5f5', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminInquiries;
