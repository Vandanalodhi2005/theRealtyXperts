import React from 'react';
import { Save, Shield } from 'lucide-react';
import './admin.css';

const AdminSettings = () => {
  return (
    <div className="admin-page" style={{ maxWidth: '800px' }}>
      <div className="admin-page-header">
        <div>
          <h2>Settings</h2>
          <p className="admin-text-muted">Manage your account and platform preferences</p>
        </div>
      </div>

      <div className="admin-tables-grid" style={{ gridTemplateColumns: '1fr' }}>
        
        {/* General Settings */}
        <div className="admin-dashboard-card">
          <div className="admin-card-header">
            <h2>General Settings</h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <form onSubmit={e => e.preventDefault()}>
              <div className="admin-form-group">
                <label>Company Name</label>
                <input type="text" className="admin-input" defaultValue="The Realty Xperts" />
              </div>
              <div className="admin-form-group">
                <label>Contact Email</label>
                <input type="email" className="admin-input" defaultValue="info@therealtyxperts.com" />
              </div>
              <div className="admin-form-group">
                <label>Phone Number</label>
                <input type="text" className="admin-input" defaultValue="+91-9826098008" />
              </div>
              <button className="admin-btn" style={{ width: 'auto' }}>
                <Save size={18} style={{ marginRight: '8px' }} />
                Save Changes
              </button>
            </form>
          </div>
        </div>

        {/* Security Settings */}
        <div className="admin-dashboard-card">
          <div className="admin-card-header">
            <h2>Security Settings</h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <form onSubmit={e => e.preventDefault()}>
              <div className="admin-form-group">
                <label>Current Password</label>
                <input type="password" className="admin-input" placeholder="Enter current password" />
              </div>
              <div className="admin-form-group">
                <label>New Password</label>
                <input type="password" className="admin-input" placeholder="Enter new password" />
              </div>
              <div className="admin-form-group">
                <label>Confirm New Password</label>
                <input type="password" className="admin-input" placeholder="Confirm new password" />
              </div>
              <button className="admin-btn" style={{ width: 'auto', backgroundColor: 'var(--admin-text-main)' }}>
                <Shield size={18} style={{ marginRight: '8px' }} />
                Update Password
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
