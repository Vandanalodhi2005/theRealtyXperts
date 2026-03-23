import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="admin-body">
      <div className="admin-auth-container">
        <div className="admin-auth-card">
          <div className="admin-auth-header">
            <h1>Admin Sign In</h1>
            <p>Welcome back! Please enter your details.</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="admin-form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="admin-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="admin-btn">
              Sign In to Dashboard
            </button>
          </form>
          <div className="admin-demo-creds">
            <strong>Demo Credentials:</strong><br />
            Username: admin<br />
            Password: admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
