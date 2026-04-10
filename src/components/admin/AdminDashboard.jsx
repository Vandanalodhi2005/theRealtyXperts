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
} from 'react-icons/hi';
import AddPropertyForm from './AddPropertyForm';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [properties, setProperties] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const [dashRes, propRes, contactRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`, { headers }),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`, { headers }),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, { headers })
            ]);

            if (dashRes.ok) setDashboardData((await dashRes.json()).data);
            if (propRes.ok) setProperties(await propRes.json());
            if (contactRes.ok) setContacts(await contactRes.json());
            
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

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HiHome },
        { id: 'properties', label: 'Properties', icon: HiOfficeBuilding },
        { id: 'investments', label: 'Investments', icon: HiGlobe },
        { id: 'projects', label: 'Projects', icon: HiClipboardList },
        { id: 'inquiries', label: 'Inquiries', icon: HiMail },
        { id: 'submissions', label: 'Submissions', icon: HiDocumentText },
        { id: 'analytics', label: 'Analytics', icon: HiChartBar },
        { id: 'settings', label: 'Settings', icon: HiCog },
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
                    <div style={{ flex: 1 }}><p style={statTitleStyle}>Land Investments</p><h3 style={statValueStyle}>{dashboardData?.totalInvestments || 0}</h3><p style={{ color: '#9C27B0', fontSize: '11px', fontWeight: 'bold', marginTop: '10px' }}>↗ Strategy Portfolio</p></div>
                    <div style={statIconBoxStyle('#F3E5F5', '#9C27B0')}><HiGlobe size={20} /></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                 <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Recent Properties</h4>
                    <div style={{ padding: '20px 0' }}>
                        {properties.length === 0 ? <p style={{ color: '#90A4AE', fontSize: '14px', textAlign: 'center' }}>No properties found</p> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {properties.slice(0, 3).map(p => (
                                    <div key={p._id} style={{ display: 'flex', gap: '15px', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #F0F0F0' }}>
                                        <div style={{ width: '35px', height: '35px', borderRadius: '8px', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiOfficeBuilding color="var(--color-navy)" /></div>
                                        <div style={{ flex: 1 }}><p style={{ fontWeight: '700', fontSize: '13px', color: 'var(--color-navy)' }}>{p.propertyName}</p><p style={{ fontSize: '11px', color: '#607D8B' }}>{p.location}</p></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => setActiveTab('properties')} style={{ ...actionButtonStyle, backgroundColor: '#F39C12' }}>View All Properties</button>
                 </div>
                 <div style={mainCardStyle}>
                    <h4 style={cardHeaderStyle}>Recent Inquiries</h4>
                    <div style={{ padding: '20px 0' }}>
                        {contacts.slice(0, 3).map(contact => (
                            <div key={contact._id} style={{ display: 'flex', gap: '15px', alignItems: 'center', paddingBottom: '10px', marginBottom: '10px' }}>
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#ECEFF1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiUser color="#90A4AE" /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><p style={{ fontWeight: '700', fontSize: '13px', color: 'var(--color-navy)' }}>{contact.name}</p>{contact.status === 'unread' && <span style={{ fontSize: '9px', padding: '1px 8px', borderRadius: '4px', backgroundColor: '#FFEBEE', color: '#F44336', fontWeight: 'bold' }}>Unread</span>}</div>
                                    <p style={{ fontSize: '11px', color: '#607D8B' }}>{contact.message.slice(0, 25)}...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setActiveTab('inquiries')} style={{ ...actionButtonStyle, backgroundColor: '#4A90E2' }}>View All Inquiries</button>
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

    const renderContent = () => {
        if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#90A4AE' }}>Loading System Data...</div>;
        if (activeTab === 'dashboard') return renderDashboard();
        if (activeTab === 'properties') return renderProperties();
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