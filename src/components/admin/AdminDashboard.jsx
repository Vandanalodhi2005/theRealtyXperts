import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  HiLogout,
  HiHome,
  HiOfficeBuilding,
  HiChartBar,
  HiCog,
  HiMail,
  HiDocumentText,
  HiPlus,
  HiEye,
  HiTrash,
  HiLocationMarker,
  HiTrendingUp,
  HiUser,
  HiGlobe,
  HiClipboardList,
  HiX,
  HiMenu,
  HiPhotograph,
} from 'react-icons/hi';
import AddPropertyForm from './AddPropertyForm';
import AddInvestmentForm from './AddInvestmentForm';
import AddProjectForm from './AddProjectForm';
import GalleryManagement from './GalleryManagement';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [showAddInvestment, setShowAddInvestment] = useState(false);
    const [showAddProject, setShowAddProject] = useState(false);
    const [properties, setProperties] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [projects, setProjects] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const [dashRes, propRes, contactRes, investRes, projectRes, subRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`, { headers }),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`, { headers }),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, { headers }),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investments`, { headers }),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, { headers }),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/submitted-properties`, { headers }),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gallery`, { headers })
            ]);

            if (dashRes.ok) setDashboardData((await dashRes.json()).data);
            if (propRes.ok) setProperties(await propRes.json());
            if (contactRes.ok) setContacts(await contactRes.json());
            if (investRes.ok) setInvestments(await investRes.json());
            if (projectRes.ok) setProjects(await projectRes.json());
            if (subRes.ok) setSubmissions(await subRes.json());
            if (galleryRes.ok) setGallery(await galleryRes.json());
            
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token || !isAuthenticated) {
            navigate('/admin/login');
            return;
        }
        fetchData();
        
        // Responsive sidebar initial state
        const handleResize = () => {
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [fetchData, isAuthenticated, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const handleDeleteProperty = async (id) => {
        if (!confirm('Permanently delete this property?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Property Deleted');
                fetchData();
            }
        } catch (e) { toast.error('Error deleting property'); }
    };

    const handleDeleteInvestment = async (id) => {
        if (!confirm('Permanently delete this investment?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Investment Deleted');
                fetchData();
            }
        } catch (e) { toast.error('Error deleting investment'); }
    };

    const handleDeleteProject = async (id) => {
        if (!confirm('Permanently delete this project?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Project Deleted');
                fetchData();
            }
        } catch (e) { toast.error('Error deleting project'); }
    };

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HiHome },
        { id: 'properties', label: 'Properties', icon: HiOfficeBuilding },
        { id: 'investments', label: 'Investments', icon: HiGlobe },
        { id: 'projects', label: 'Projects', icon: HiClipboardList },
        { id: 'inquiries', label: 'Inquiries', icon: HiMail },
        { id: 'submissions', label: 'Submissions', icon: HiDocumentText },
        { id: 'analytics', label: 'Analytics', icon: HiChartBar },
        { id: 'settings', label: 'Settings', icon: HiCog },
        { id: 'gallery', label: 'Gallery', icon: HiPhotograph },
    ];

    const renderDashboard = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div style={statCardStyle('var(--color-gold)')}>
                    <div style={{ flex: 1 }}><p style={statTitleStyle}>Total Properties</p><h3 style={statValueStyle}>{properties.length}</h3><p style={{ color: '#4CAF50', fontSize: '11px', fontWeight: 'bold', marginTop: '10px' }}>↗ Live Listings</p></div>
                    <div style={statIconBoxStyle('#FFF8E1', 'var(--color-gold)')}><HiOfficeBuilding size={20} /></div>
                </div>
                <div style={statCardStyle('#2196F3')}>
                    <div style={{ flex: 1 }}><p style={statTitleStyle}>Available Properties</p><h3 style={statValueStyle}>{properties.filter(p => p.status === 'available').length}</h3><p style={{ color: '#2196F3', fontSize: '11px', fontWeight: 'bold', marginTop: '10px' }}>↗ Ready for sale</p></div>
                    <div style={statIconBoxStyle('#E3F2FD', '#2196F3')}><HiHome size={20} /></div>
                </div>
                <div style={statCardStyle('#4CAF50')}>
                    <div style={{ flex: 1 }}><p style={statTitleStyle}>Total Inquiries</p><h3 style={statValueStyle}>{contacts.length}</h3><p style={{ color: '#F44336', fontSize: '11px', fontWeight: 'bold', marginTop: '10px' }}>↗ {contacts.filter(c => c.status === 'unread').length} unread</p></div>
                    <div style={statIconBoxStyle('#E8F5E9', '#4CAF50')}><HiMail size={20} /></div>
                </div>
                <div style={statCardStyle('#9C27B0')}>
                    <div style={{ flex: 1 }}><p style={statTitleStyle}>Total Projects</p><h3 style={statValueStyle}>{projects.length}</h3><p style={{ color: '#9C27B0', fontSize: '11px', fontWeight: 'bold', marginTop: '10px' }}>↗ Signature Ventures</p></div>
                    <div style={statIconBoxStyle('#F3E5F5', '#9C27B0')}><HiClipboardList size={20} /></div>
                </div>
                <div style={statCardStyle('#E91E63')}>
                    <div style={{ flex: 1 }}><p style={statTitleStyle}>Land Investments</p><h3 style={statValueStyle}>{investments.length}</h3><p style={{ color: '#E91E63', fontSize: '11px', fontWeight: 'bold', marginTop: '10px' }}>↗ Portfolio Assets</p></div>
                    <div style={statIconBoxStyle('#FCE4EC', '#E91E63')}><HiGlobe size={20} /></div>
                </div>
                <div style={statCardStyle('#FF9800')}>
                    <div style={{ flex: 1 }}><p style={statTitleStyle}>Gallery Assets</p><h3 style={statValueStyle}>{gallery.length}</h3><p style={{ color: '#FF9800', fontSize: '11px', fontWeight: 'bold', marginTop: '10px' }}>↗ Visual Media</p></div>
                    <div style={statIconBoxStyle('#FFF3E0', '#FF9800')}><HiPhotograph size={20} /></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                 <div style={mainCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)', fontWeight: '700' }}>Recent Properties</h4>
                        <span style={{ fontSize: '10px', backgroundColor: '#F8F9FA', padding: '4px 8px', borderRadius: '4px', color: '#666' }}>Last 5</span>
                    </div>
                    <div style={{ padding: '10px 0' }}>
                        {properties.length === 0 ? <p style={{ color: '#90A4AE', fontSize: '14px', textAlign: 'center' }}>No properties found</p> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {properties.slice(0, 5).map(p => (
                                    <div key={p._id} style={{ display: 'flex', gap: '15px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F8F9FA' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {p.images?.[0] ? <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <HiOfficeBuilding color="var(--color-navy)" />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: '700', fontSize: '13px', color: 'var(--color-navy)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.propertyName}</p>
                                            <p style={{ fontSize: '11px', color: '#607D8B', margin: '2px 0 0' }}>{p.location}</p>
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-gold)' }}>₹{p.price?.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setActiveTab('properties')} style={{ ...actionButtonStyle, backgroundColor: 'var(--color-navy)', marginTop: '10px' }}>Manage Properties</button>
                 </div>
                 
                 <div style={mainCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)', fontWeight: '700' }}>Recent Inquiries</h4>
                        <span style={{ fontSize: '10px', backgroundColor: '#FFEBEE', padding: '4px 8px', borderRadius: '4px', color: '#F44336', fontWeight: 'bold' }}>{contacts.filter(c => c.status === 'unread').length} New</span>
                    </div>
                    <div style={{ padding: '10px 0' }}>
                        {contacts.length === 0 ? <p style={{ color: '#90A4AE', fontSize: '14px', textAlign: 'center' }}>No inquiries yet</p> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {contacts.slice(0, 5).map(contact => (
                                    <div key={contact._id} style={{ display: 'flex', gap: '15px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F8F9FA' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ECEFF1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><HiUser color="#90A4AE" /></div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <p style={{ fontWeight: '700', fontSize: '13px', color: 'var(--color-navy)', margin: 0 }}>{contact.name}</p>
                                                <span style={{ fontSize: '9px', color: '#90A4AE' }}>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p style={{ fontSize: '11px', color: '#607D8B', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setActiveTab('inquiries')} style={{ ...actionButtonStyle, backgroundColor: '#4A90E2', marginTop: '10px' }}>View All Inquiries</button>
                 </div>
            </div>
        </div>
    );

    const renderProperties = () => {
        if (showAddProperty) return <AddPropertyForm onCancel={() => setShowAddProperty(false)} onSuccess={() => { setShowAddProperty(false); fetchData(); }} />;
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Property Management</h2>
                    <button 
                        onClick={() => setShowAddProperty(true)}
                        style={{ backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(243, 156, 18, 0.2)' }}
                    >
                        <HiPlus /> Add New Property
                    </button>
                </div>

                <div style={mainCardStyle}>
                    <div style={{ borderBottom: '1px solid #E6E9EF', paddingBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)' }}>All Properties</h4>
                    </div>
                    
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8F9FA' }}>
                                    <th style={tableHeaderStyle}>PROPERTY</th>
                                    <th style={tableHeaderStyle}>LOCATION</th>
                                    <th style={tableHeaderStyle}>PRICE</th>
                                    <th style={tableHeaderStyle}>STATUS</th>
                                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '80px 20px', textAlign: 'center', color: '#90A4AE', fontSize: '14px' }}>
                                            No properties found. Add your first property!
                                        </td>
                                    </tr>
                                ) : properties.map(p => (
                                    <tr key={p._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {p.images?.[0] ? <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <HiOfficeBuilding color="#90A4AE" />}
                                                </div>
                                                <span style={{ fontWeight: '600' }}>{p.propertyName || 'Unnamed Listing'}</span>
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>{p.location}, {p.city}</td>
                                        <td style={{ ...tableCellStyle, fontWeight: '700', color: 'var(--color-gold)' }}>₹{p.price?.toLocaleString()}</td>
                                        <td style={tableCellStyle}>
                                            <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', backgroundColor: p.status === 'available' ? '#E8F5E9' : '#FFEBEE', color: p.status === 'available' ? '#4CAF50' : '#F44336', textTransform: 'uppercase' }}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button style={{ border: 'none', background: '#F0F4F8', color: '#607D8B', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><HiEye /></button>
                                                <button onClick={() => handleDeleteProperty(p._id)} style={{ border: 'none', background: '#FFEBEE', color: '#F44336', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><HiTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderInvestments = () => {
        if (showAddInvestment) return <AddInvestmentForm onCancel={() => setShowAddInvestment(false)} onSuccess={() => { setShowAddInvestment(false); fetchData(); }} />;
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Land Investments</h2>
                    <button 
                        onClick={() => setShowAddInvestment(true)}
                        style={{ backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(243, 156, 18, 0.2)' }}
                    >
                        <HiPlus /> Add Investment
                    </button>
                </div>

                <div style={mainCardStyle}>
                    <div style={{ borderBottom: '1px solid #E6E9EF', paddingBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)' }}>All Investments</h4>
                    </div>
                    
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8F9FA' }}>
                                    <th style={tableHeaderStyle}>TITLE</th>
                                    <th style={tableHeaderStyle}>LOCATION</th>
                                    <th style={tableHeaderStyle}>TYPE</th>
                                    <th style={tableHeaderStyle}>PRICE</th>
                                    <th style={tableHeaderStyle}>STATUS</th>
                                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {investments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '80px 20px', textAlign: 'center', color: '#90A4AE', fontSize: '14px' }}>
                                            No investments found. Add your first investment!
                                        </td>
                                    </tr>
                                ) : investments.map(i => (
                                    <tr key={i._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {i.images?.[0] ? <img src={i.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <HiGlobe color="#90A4AE" />}
                                                </div>
                                                <span style={{ fontWeight: '600' }}>{i.title}</span>
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>{i.location}, {i.city}</td>
                                        <td style={{ ...tableCellStyle, textTransform: 'capitalize' }}>{i.landType}</td>
                                        <td style={{ ...tableCellStyle, fontWeight: '700', color: 'var(--color-gold)' }}>₹{i.totalPrice?.toLocaleString()}</td>
                                        <td style={tableCellStyle}>
                                            <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', backgroundColor: i.status === 'available' ? '#E8F5E9' : i.status === 'upcoming' ? '#E3F2FD' : '#FFEBEE', color: i.status === 'available' ? '#4CAF50' : i.status === 'upcoming' ? '#2196F3' : '#F44336', textTransform: 'uppercase' }}>
                                                {i.status}
                                            </span>
                                        </td>
                                        <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button style={{ border: 'none', background: '#F0F4F8', color: '#607D8B', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><HiEye /></button>
                                                <button onClick={() => handleDeleteInvestment(i._id)} style={{ border: 'none', background: '#FFEBEE', color: '#F44336', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><HiTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderProjects = () => {
        if (showAddProject) return <AddProjectForm onCancel={() => setShowAddProject(false)} onSuccess={() => { setShowAddProject(false); fetchData(); }} />;
        
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Projects Management</h2>
                    <button 
                        onClick={() => setShowAddProject(true)}
                        style={{ backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(243, 156, 18, 0.2)' }}
                    >
                        <HiPlus /> Add Project
                    </button>
                </div>

                <div style={mainCardStyle}>
                    <div style={{ borderBottom: '1px solid #E6E9EF', paddingBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)' }}>All Projects</h4>
                    </div>
                    
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8F9FA' }}>
                                    <th style={tableHeaderStyle}>TITLE</th>
                                    <th style={tableHeaderStyle}>LOCATION</th>
                                    <th style={tableHeaderStyle}>TYPE</th>
                                    <th style={tableHeaderStyle}>PRICE</th>
                                    <th style={tableHeaderStyle}>STATUS</th>
                                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '80px 20px', textAlign: 'center', color: '#90A4AE', fontSize: '14px' }}>
                                            No projects found. Add your first project!
                                        </td>
                                    </tr>
                                ) : projects.map(p => (
                                    <tr key={p._id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {p.images?.[0] ? <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <HiClipboardList color="#90A4AE" />}
                                                </div>
                                                <span style={{ fontWeight: '600' }}>{p.title}</span>
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>{p.location}, {p.city}</td>
                                        <td style={{ ...tableCellStyle, textTransform: 'capitalize' }}>{p.type}</td>
                                        <td style={{ ...tableCellStyle, fontWeight: '700', color: 'var(--color-gold)' }}>{p.price}</td>
                                        <td style={tableCellStyle}>
                                            <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', backgroundColor: p.status === 'completed' ? '#E8F5E9' : p.status === 'under-construction' ? '#FFF3E0' : '#E3F2FD', color: p.status === 'completed' ? '#4CAF50' : p.status === 'under-construction' ? '#EF6C00' : '#2196F3', textTransform: 'uppercase' }}>
                                                {p.status?.replace(/-/g, ' ')}
                                            </span>
                                        </td>
                                        <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button style={{ border: 'none', background: '#F0F4F8', color: '#607D8B', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><HiEye /></button>
                                                <button onClick={() => handleDeleteProject(p._id)} style={{ border: 'none', background: '#FFEBEE', color: '#F44336', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><HiTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderInquiries = () => {
        const total = contacts.length;
        const unread = contacts.filter(c => c.status === 'unread').length;
        const responded = contacts.filter(c => c.status === 'responded').length;
        const read = total - unread - responded;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Customer Inquiries</h2>
                    <button style={{ backgroundColor: '#F8F9FA', border: '1px solid #E6E9EF', padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--color-navy)', cursor: 'pointer' }}>Export</button>
                </div>

                {/* Inquiry Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={statCardStyle('var(--color-navy)')}>
                        <div style={{ flex: 1 }}><p style={statTitleStyle}>Total Inquiries</p><h3 style={statValueStyle}>{total}</h3></div>
                    </div>
                    <div style={statCardStyle('#F44336')}>
                        <div style={{ flex: 1 }}><p style={statTitleStyle}>Unread</p><h3 style={statValueStyle}>{unread}</h3></div>
                    </div>
                    <div style={statCardStyle('#4CAF50')}>
                        <div style={{ flex: 1 }}><p style={statTitleStyle}>Responded</p><h3 style={statValueStyle}>{responded}</h3></div>
                    </div>
                </div>

                {/* Simple Chart Section */}
                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Inquiry Distribution</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '40px', height: '200px', padding: '20px 0', borderBottom: '1px solid #EEE' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: `${(unread/total)*100 || 0}%`, backgroundColor: '#F44336', borderRadius: '4px 4px 0 0', minHeight: '5px' }}></div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Unread</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: `${(read/total)*100 || 0}%`, backgroundColor: '#2196F3', borderRadius: '4px 4px 0 0', minHeight: '5px' }}></div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Read</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: `${(responded/total)*100 || 0}%`, backgroundColor: '#4CAF50', borderRadius: '4px 4px 0 0', minHeight: '5px' }}></div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Responded</span>
                        </div>
                    </div>
                </div>

                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Recent Inquiries</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {contacts.length === 0 ? <p style={{ textAlign: 'center', color: '#90A4AE', padding: '40px' }}>No inquiries found.</p> : contacts.map(contact => (
                            <div key={contact._id} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '12px', border: '1px solid #E6E9EF' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h5 style={{ margin: 0, fontSize: '16px', color: 'var(--color-navy)', fontWeight: '800' }}>{contact.name}</h5>
                                        <p style={{ margin: '5px 0', fontSize: '13px', color: '#607D8B' }}>{contact.email} • {contact.phone}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: contact.status === 'unread' ? '#FFEBEE' : contact.status === 'responded' ? '#E8F5E9' : '#E3F2FD', color: contact.status === 'unread' ? '#F44336' : contact.status === 'responded' ? '#4CAF50' : '#2196F3' }}>{contact.status}</span>
                                        <span style={{ fontSize: '12px', color: '#90A4AE', fontWeight: '500' }}>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px', borderLeft: '4px solid var(--color-gold)' }}>
                                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#455A64' }}>{contact.message}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button style={{ backgroundColor: 'white', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderSubmissions = () => {
        const total = submissions.length;
        const pending = submissions.filter(s => s.status === 'pending').length;
        const approved = submissions.filter(s => s.status === 'approved').length;
        const rejected = submissions.filter(s => s.status === 'rejected').length;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Property Submissions</h2>
                        <span style={{ backgroundColor: '#FFF3E0', color: '#EF6C00', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{pending} pending</span>
                    </div>
                </div>

                {/* Submission Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                    <div style={statCardStyle('var(--color-navy)')}><div style={{ flex: 1 }}><p style={statTitleStyle}>Total</p><h3 style={statValueStyle}>{total}</h3></div></div>
                    <div style={statCardStyle('#EF6C00')}><div style={{ flex: 1 }}><p style={statTitleStyle}>Pending</p><h3 style={statValueStyle}>{pending}</h3></div></div>
                    <div style={statCardStyle('#4CAF50')}><div style={{ flex: 1 }}><p style={statTitleStyle}>Approved</p><h3 style={statValueStyle}>{approved}</h3></div></div>
                    <div style={statCardStyle('#F44336')}><div style={{ flex: 1 }}><p style={statTitleStyle}>Rejected</p><h3 style={statValueStyle}>{rejected}</h3></div></div>
                </div>

                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Recent Submissions</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {submissions.length === 0 ? <p style={{ textAlign: 'center', color: '#90A4AE', padding: '40px' }}>No submissions found.</p> : submissions.map(sub => (
                            <div key={sub._id} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '25px', backgroundColor: '#F8F9FA', borderRadius: '15px', border: '1px solid #E6E9EF' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                                    <div>
                                        <h5 style={{ margin: 0, fontSize: '18px', color: 'var(--color-navy)', fontWeight: '800' }}>{sub.title}</h5>
                                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#607D8B' }}>{sub.contactName} • {sub.contactEmail} • {sub.contactPhone}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                        <span style={{ padding: '6px 15px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: sub.status === 'pending' ? '#FFF3E0' : sub.status === 'approved' ? '#E8F5E9' : sub.status === 'rejected' ? '#FFEBEE' : '#E3F2FD', color: sub.status === 'pending' ? '#EF6C00' : sub.status === 'approved' ? '#4CAF50' : sub.status === 'rejected' ? '#F44336' : '#2196F3' }}>
                                            {sub.status}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#90A4AE' }}>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '10px' }}>
                                    <div><p style={{ fontSize: '10px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Category</p><p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)', textTransform: 'capitalize' }}>{sub.category}</p></div>
                                    <div><p style={{ fontSize: '10px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Type</p><p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)', textTransform: 'capitalize' }}>{sub.type}</p></div>
                                    <div><p style={{ fontSize: '10px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Price</p><p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-gold)' }}>₹{sub.price?.toLocaleString()}</p></div>
                                    <div><p style={{ fontSize: '10px', color: '#90A4AE', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Location</p><p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)' }}>{sub.location}</p></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button style={{ backgroundColor: 'white', border: '1px solid var(--color-navy)', color: 'var(--color-navy)', padding: '10px 25px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}>View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderAnalytics = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>Analytics & Reports</h2>

                {/* Website Traffic */}
                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Website Traffic</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#F0F4F8', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#607D8B', textTransform: 'uppercase' }}>Recent Listings</p>
                            <h3 style={{ margin: '10px 0 0', fontSize: '24px', color: 'var(--color-navy)', fontWeight: '800' }}>{dashboardData?.recentProperties || 0}</h3>
                        </div>
                        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#E3F2FD', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#2196F3', textTransform: 'uppercase' }}>Active Inquiries</p>
                            <h3 style={{ margin: '10px 0 0', fontSize: '24px', color: '#2196F3', fontWeight: '800' }}>{dashboardData?.unreadContacts || 0}</h3>
                        </div>
                        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#E8F5E9', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#4CAF50', textTransform: 'uppercase' }}>Total Data Points</p>
                            <h3 style={{ margin: '10px 0 0', fontSize: '24px', color: '#4CAF50', fontWeight: '800' }}>{properties.length + investments.length + projects.length}</h3>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {/* Popular Properties */}
                    <div style={mainCardStyle}>
                        <h4 style={cardHeaderStyle}>Popular Properties</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {properties.slice(0, 3).map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: '#F8F9FA', borderRadius: '10px' }}>
                                    <div style={{ width: '8px', height: '35px', backgroundColor: idx === 0 ? 'var(--color-gold)' : idx === 1 ? '#2196F3' : '#9C27B0', borderRadius: '4px' }}></div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-navy)' }}>{item.propertyName}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#607D8B' }}>{item.location}</p>
                                    </div>
                                    <HiTrendingUp color={idx === 0 ? 'var(--color-gold)' : idx === 1 ? '#2196F3' : '#9C27B0'} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lead Sources */}
                    <div style={mainCardStyle}>
                        <h4 style={cardHeaderStyle}>Lead Sources</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { name: 'Residential', value: Math.round((properties.length / (properties.length + investments.length + projects.length || 1)) * 100), color: 'var(--color-navy)' },
                                { name: 'Land/Plot', value: Math.round((investments.length / (properties.length + investments.length + projects.length || 1)) * 100), color: 'var(--color-gold)' },
                                { name: 'Commercial', value: Math.round((projects.length / (properties.length + investments.length + projects.length || 1)) * 100), color: '#4CAF50' }
                            ].map((source, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#455A64' }}>{source.name}</span>
                                        <span style={{ fontSize: '12px', fontWeight: '800', color: source.color }}>{source.value}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#ECEFF1', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${source.value}%`, height: '100%', backgroundColor: source.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Performance Chart */}
                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Monthly Performance</h4>
                    <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '20px 0', overflowX: 'auto' }}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
                            const height = [40, 60, 45, 80, 95, 75, 85, 90, 70, 85, 95, 100][idx];
                            return (
                                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', minWidth: '40px' }}>
                                    <div style={{ width: '100%', height: `${height}%`, backgroundColor: month === 'Dec' ? 'var(--color-gold)' : 'var(--color-navy)', borderRadius: '6px 6px 0 0', opacity: 0.8, transition: 'all 0.3s' }}></div>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#90A4AE' }}>{month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderSettings = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <h2 style={{ color: 'var(--color-navy)', fontSize: '24px', fontWeight: 'bold' }}>System Settings</h2>

                {/* General Settings */}
                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>General Settings</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>Company Name</label>
                            <input type="text" defaultValue="The realty Xperts" style={{ ...tableCellStyle, border: '1px solid #E6E9EF', borderRadius: '10px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>Contact Email</label>
                            <input type="email" defaultValue="emailtotrx@gmail.com" style={{ ...tableCellStyle, border: '1px solid #E6E9EF', borderRadius: '10px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>Phone Number</label>
                            <input type="text" defaultValue="+91-926-417-5587" style={{ ...tableCellStyle, border: '1px solid #E6E9EF', borderRadius: '10px' }} />
                        </div>
                    </div>
                    <button style={{ ...actionButtonStyle, maxWidth: '200px', backgroundColor: 'var(--color-gold)' }}>Save Changes</button>
                </div>

                {/* Security Settings */}
                <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Security Settings</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>Current Password</label>
                            <input type="password" placeholder="••••••••" style={{ ...tableCellStyle, border: '1px solid #E6E9EF', borderRadius: '10px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>New Password</label>
                            <input type="password" placeholder="Enter new password" style={{ ...tableCellStyle, border: '1px solid #E6E9EF', borderRadius: '10px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#607D8B' }}>Confirm New Password</label>
                            <input type="password" placeholder="Confirm new password" style={{ ...tableCellStyle, border: '1px solid #E6E9EF', borderRadius: '10px' }} />
                        </div>
                    </div>
                    <button style={{ ...actionButtonStyle, maxWidth: '200px', backgroundColor: 'var(--color-navy)' }}>Update Password</button>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#90A4AE' }}>Loading System Data...</div>;
        if (activeTab === 'dashboard') return renderDashboard();
        if (activeTab === 'properties') return renderProperties();
        if (activeTab === 'investments') return renderInvestments();
        if (activeTab === 'projects') return renderProjects();
        if (activeTab === 'inquiries') return renderInquiries();
        if (activeTab === 'submissions') return renderSubmissions();
        if (activeTab === 'analytics') return renderAnalytics();
        if (activeTab === 'settings') return renderSettings();
        if (activeTab === 'gallery') return <GalleryManagement />;
        return (
            <div style={mainCardStyle}>
                <h2 style={cardHeaderStyle}>{activeTab.toUpperCase()} SECTION</h2>
                <div style={{ padding: '50px', textAlign: 'center', color: '#90A4AE' }}>Functional implementation in progress for {activeTab}.</div>
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FB', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ height: '70px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #E6E9EF', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        className="md-hidden"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#607D8B' }}
                    >
                        <HiMenu size={24} />
                    </button>
                    <span style={{ fontWeight: '800', color: 'var(--color-navy)', fontSize: '18px', letterSpacing: '-0.5px' }}>THE REALTY XPERTS</span>
                    <span className="lg-visible" style={{ color: '#90A4AE', fontSize: '13px', marginLeft: '10px', paddingLeft: '10px', borderLeft: '1px solid #EEE' }}>Admin Portal</span>
                </div>
                <button 
                    onClick={handleLogout}
                    style={{ backgroundColor: '#F44336', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                    <HiLogout /> <span className="lg-visible">Logout</span>
                </button>
            </header>

            <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
                {/* Responsive Sidebar Overlay for Mobile */}
                {!isSidebarOpen && window.innerWidth < 1024 ? null : (
                    <aside style={{ 
                        width: '260px', 
                        backgroundColor: 'white', 
                        height: 'calc(100vh - 70px)', 
                        position: window.innerWidth < 1024 ? 'fixed' : 'sticky', 
                        top: '70px', 
                        left: 0, 
                        zIndex: 900, 
                        padding: '25px 15px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '5px', 
                        boxShadow: '4px 0 12px rgba(0,0,0,0.03)',
                        transition: 'transform 0.3s'
                    }}>
                        {sidebarItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', border: 'none', borderRadius: '12px',
                                    backgroundColor: activeTab === item.id ? '#FFF8E1' : 'transparent',
                                    color: activeTab === item.id ? 'var(--color-gold)' : '#666',
                                    fontWeight: activeTab === item.id ? '700' : '500', 
                                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', fontSize: '14px'
                                }}
                            >
                                <item.icon size={18} style={{ color: activeTab === item.id ? 'var(--color-gold)' : '#90A4AE' }} />
                                {item.label}
                            </button>
                        ))}
                    </aside>
                )}

                {/* Main Content Area */}
                <main style={{ flex: 1, padding: window.innerWidth < 768 ? '20px' : '40px', backgroundColor: '#F8F9FB' }}>
                    {renderContent()}
                </main>
            </div>

            {/* In-File CSS for responsiveness */}
            <style>{`
                @media (max-width: 1023px) {
                    .lg-visible { display: none !important; }
                }
                @media (min-width: 1024px) {
                    .md-hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
};

const statCardStyle = (color) => ({
    backgroundColor: 'white', borderRadius: '15px', padding: '25px', display: 'flex', alignItems: 'flex-start',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: `5px solid ${color}`
});

const statTitleStyle = { color: '#90A4AE', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' };
const statValueStyle = { color: 'var(--color-navy)', fontSize: '32px', fontWeight: '800', lineHeight: 1 };
const statIconBoxStyle = (bg, color) => ({ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color });

const mainCardStyle = { backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' };
const cardHeaderStyle = { color: 'var(--color-navy)', fontSize: '16px', fontWeight: '700', marginBottom: '20px' };
const actionButtonStyle = { width: '100%', padding: '12px', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', marginTop: '15px' };

const tableHeaderStyle = { textAlign: 'left', padding: '12px 15px', fontSize: '10px', color: '#90A4AE', fontWeight: '800', letterSpacing: '1px' };
const tableCellStyle = { padding: '15px', fontSize: '13px', color: '#455A64' };

export default AdminDashboard;