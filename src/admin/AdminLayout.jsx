import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  TrendingUp, 
  Briefcase, 
  MessageSquare, 
  FileCheck, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import './admin.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Properties', path: '/admin/properties', icon: <Building2 size={20} /> },
    { name: 'Investments', path: '/admin/investments', icon: <TrendingUp size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <Briefcase size={20} /> },
    { name: 'Inquiries', path: '/admin/inquiries', icon: <MessageSquare size={20} /> },
    { name: 'Submissions', path: '/admin/submissions', icon: <FileCheck size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-body">
      <div className="admin-layout">
        
        {/* Mobile Sidebar Overlay */}
        <div 
          className={`admin-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-header">
            <a href="/" className="admin-sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <img src="/logo/logo.png" alt="TRX Emblem" style={{ height: '36px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ color: 'var(--color-navy, #0A1C3A)', fontSize: '1.2rem', fontWeight: 800 }}>TRX</span>
                <span style={{ color: 'var(--color-teal, #008080)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>The Realty Xperts</span>
              </div>
            </a>
            {isSidebarOpen && (
              <button className="admin-mobile-toggle" onClick={() => setIsSidebarOpen(false)}>
                <X size={24} />
              </button>
            )}
          </div>
          <nav className="admin-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => 
                  `admin-nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Topbar */}
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <button className="admin-mobile-toggle" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
              <h1 className="admin-topbar-title">Admin Dashboard</h1>
            </div>
            <button onClick={handleLogout} className="admin-logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </header>

          {/* Page Content */}
          <div className="admin-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
