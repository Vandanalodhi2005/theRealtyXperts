import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MessageSquare, 
  Eye, 
  Edit,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';
import './admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [recentProperties, setRecentProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [propertiesTotal, setPropertiesTotal] = useState(0);
  const [projectsTotal, setProjectsTotal] = useState(0);
  const [submissionsTotal, setSubmissionsTotal] = useState(0);

  useEffect(() => {
    // Properties
    const savedProps = localStorage.getItem('trx_properties');
    if (savedProps) {
      const parsed = JSON.parse(savedProps);
      setPropertiesTotal(parsed.length);
      setRecentProperties(parsed.slice(0, 5));
    }

    // Inquiries
    const savedInquiries = localStorage.getItem('trx_inquiries');
    if (savedInquiries) {
      setInquiries(JSON.parse(savedInquiries));
    } else {
      setInquiries([]);
    }

    // Projects
    const savedProj = localStorage.getItem('trx_projects');
    if (savedProj) setProjectsTotal(JSON.parse(savedProj).length);

    // Submissions
    const savedSubs = localStorage.getItem('trx_submissions');
    if (savedSubs) setSubmissionsTotal(JSON.parse(savedSubs).filter(s => s.status === 'pending').length);

  }, []);

  const unreadInquiries = inquiries.filter(i => i.status === 'unread').length;

  const stats = [
    { title: 'Total Properties', value: propertiesTotal.toString(), subtext: 'Updated live', icon: <Building2 size={24} />, color: 'blue' },
    { title: 'Active Inquiries', value: inquiries.length.toString(), subtext: `${unreadInquiries} unread`, icon: <MessageSquare size={24} />, color: 'red' },
    { title: 'New Leads', value: unreadInquiries.toString(), subtext: 'Needs response', icon: <Users size={24} />, color: 'indigo' },
    { title: 'Active Projects', value: projectsTotal.toString(), subtext: 'Currently listed', icon: <TrendingUp size={24} />, color: 'admin-primary' },
    { title: 'Pending Submissions', value: submissionsTotal.toString(), subtext: 'Awaiting review', icon: <Clock size={24} />, color: 'blue' },
  ];

  const handleInquiryStatusChange = (id, newStatus) => {
    const newData = inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq);
    setInquiries(newData);
    localStorage.setItem('trx_inquiries', JSON.stringify(newData));
  };

  return (
    <div>
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`admin-stat-card ${stat.color}`}>
            <div className="admin-stat-icon">
              {stat.icon}
            </div>
            <div className="admin-stat-details">
              <h3>{stat.title}</h3>
              <p className="admin-stat-value">{stat.value}</p>
              <p className="admin-stat-subtext">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-tables-grid">
        {/* Recent Properties Table */}
        <div className="admin-dashboard-card">
          <div className="admin-card-header">
            <h2>Recent Properties</h2>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentProperties.length === 0 ? (
                <tr><td colSpan="4" className="admin-text-muted text-center" style={{padding: '1rem'}}>No recent properties.</td></tr>
              ) : recentProperties.map((prop, idx) => (
                <tr key={prop.id || idx}>
                  <td>
                    <div className="admin-prop-cell">
                      <div className="admin-prop-icon">
                        <Building2 size={20} />
                      </div>
                      <div className="admin-prop-info">
                        <h4>{prop.title}</h4>
                        <p style={{textTransform: 'capitalize'}}>{prop.type}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-muted" style={{fontSize: '0.875rem', color: 'var(--admin-text-main)', fontWeight: 600}}>{prop.price || 'Contact for price'}</span></td>
                  <td>
                    <select 
                      className={`admin-select ${prop.status === 'available' ? 'admin-badge success' : prop.status === 'sold' ? 'admin-badge danger' : 'admin-badge warning'}`} 
                      value={prop.status}
                      onChange={(e) => {
                        const savedProps = JSON.parse(localStorage.getItem('trx_properties') || '[]');
                        const newData = savedProps.map(p => p.id === prop.id ? { ...p, status: e.target.value } : p);
                        localStorage.setItem('trx_properties', JSON.stringify(newData));
                        setRecentProperties(newData.slice(0, 5));
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
                      <button className="admin-action-btn" title="View Details" onClick={() => window.open(`/properties/${prop.id}`, '_blank')}>
                        <Eye size={16} />
                      </button>
                      <button className="admin-action-btn" title="Edit" onClick={() => navigate('/admin/properties')}>
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Inquiries List */}
        <div className="admin-dashboard-card">
          <div className="admin-card-header">
            <h2>Recent Inquiries</h2>
          </div>
          <div className="admin-inquiry-list">
            {inquiries.slice(0, 4).map(inq => (
              <div key={inq.id} className="admin-inquiry-item">
                <div className="admin-avatar">{inq.initials || inq.name.charAt(0)}</div>
                <div className="admin-inquiry-content">
                  <div className="admin-inquiry-header">
                    <h4>{inq.name}</h4>
                    <span className="admin-inquiry-time">{inq.time}</span>
                  </div>
                  <p>{inq.subject}</p>
                  <select 
                    className={`admin-status-select ${inq.status}`} 
                    value={inq.status}
                    onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
