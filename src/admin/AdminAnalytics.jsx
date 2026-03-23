import React, { useState, useEffect } from 'react';
import { Users, MousePointerClick, TrendingUp, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './admin.css';

const AdminAnalytics = () => {
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    setProperties(JSON.parse(localStorage.getItem('trx_properties') || '[]'));
    setInquiries(JSON.parse(localStorage.getItem('trx_inquiries') || '[]'));
    setSubmissions(JSON.parse(localStorage.getItem('trx_submissions') || '[]'));
  }, []);

  // Compute total value by parsing prices
  const totalValue = properties.reduce((acc, prop) => {
    const val = parseInt((prop.price || '0').replace(/[^0-9]/g, ''), 10);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount === 0) return '₹0';
    return `₹${amount.toLocaleString()}`;
  };

  const interactions = inquiries.length + submissions.length;

  const trafficStats = [
    { title: 'Total Portfolio Value', value: formatCurrency(totalValue), icon: <TrendingUp size={24} />, color: 'green' },
    { title: 'Total Listings', value: properties.length.toString(), icon: <BarChartIcon size={24} />, color: 'blue' },
    { title: 'Platform Interactions', value: interactions.toString(), icon: <Users size={24} />, color: 'indigo' },
  ];

  // Property types breakdown
  const typeCount = properties.reduce((acc, p) => {
    const type = p.type || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const popularProperties = Object.keys(typeCount).map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    views: typeCount[type]
  })).sort((a, b) => b.views - a.views);

  // Highest Value Properties
  const topProperties = [...properties].sort((a, b) => {
    const valA = parseInt((a.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
    const valB = parseInt((b.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return valB - valA;
  }).slice(0, 4);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Analytics & Reports</h2>
          <p className="admin-text-muted">Track your actual portfolio value and listings</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        {trafficStats.map((stat, index) => (
          <div key={index} className={`admin-stat-card ${stat.color}`}>
            <div className="admin-stat-icon">
              {stat.icon}
            </div>
            <div className="admin-stat-details">
              <h3 style={{fontSize: '0.85rem'}}>{stat.title}</h3>
              <p className="admin-stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Analysis Graph Area */}
      <div className="admin-dashboard-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)' }}>Listings Distribution by Type</h3>
        <div style={{ width: '100%', height: 300 }}>
          {popularProperties.length === 0 ? (
             <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="admin-text-muted">No data to chart</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularProperties} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{fill: 'var(--admin-text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{fill: 'var(--admin-text-muted)'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'var(--admin-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)'}} />
                <Bar dataKey="views" name="Total Properties" fill="var(--admin-primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="admin-tables-grid">
        <div className="admin-dashboard-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)' }}>Highest Value Listings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topProperties.length === 0 ? (
              <p className="admin-text-muted">No properties found.</p>
            ) : topProperties.map((prop, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem', 
                backgroundColor: 'var(--admin-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--admin-border)'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--admin-text-main)' }}>{prop.title}</h4>
                  <span className="admin-text-muted" style={{ fontSize: '0.875rem' }}>{prop.location}</span>
                </div>
                <span className="admin-badge success">{prop.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-dashboard-card">
            <div className="admin-card-header">
              <h2 style={{ fontSize: '1rem' }}>Listings by Property Type</h2>
            </div>
            <div style={{ padding: '0 1.5rem' }}>
              {popularProperties.length === 0 ? (
                 <div style={{ padding: '1rem 0' }} className="admin-text-muted">No data available</div>
              ) : popularProperties.map((prop, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: idx !== popularProperties.length - 1 ? '1px solid var(--admin-border)' : 'none' }}>
                  <span style={{ fontWeight: 500, color: 'var(--admin-text-main)', textTransform: 'capitalize' }}>{prop.name}</span>
                  <span className="admin-badge blue">{prop.views} Listings</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-dashboard-card">
            <div className="admin-card-header">
              <h2 style={{ fontSize: '1rem' }}>Recent Platform Activity</h2>
            </div>
            <div style={{ padding: '0 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--admin-border)' }}>
                <span style={{ fontWeight: 500, color: 'var(--admin-text-main)' }}>New Submissions</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{submissions.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
                <span style={{ fontWeight: 500, color: 'var(--admin-text-main)' }}>Customer Inquiries</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{inquiries.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
