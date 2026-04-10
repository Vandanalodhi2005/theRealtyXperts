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
  HiPencil,
  HiTrash,
  HiLocationMarker,
  HiCurrencyRupee,
  HiCalendar,
  HiTrendingUp,
  HiUser,
  HiGlobe,
  HiClipboardList,
  HiX,
  HiViewGrid,
  HiCheckCircle,
  HiAdjustments,
  HiLockClosed,
  HiQuestionMarkCircle,
  HiDownload
} from 'react-icons/hi';
import AddPropertyForm from './AddPropertyForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showEditProperty, setShowEditProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [investmentsLoading, setInvestmentsLoading] = useState(false);
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Fetch functions are consolidated here for clarity and reliability
  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchProperties = useCallback(async () => {
    try {
      setPropertiesLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      setContactsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setContactsLoading(false);
    }
  }, []);

  const fetchInvestments = useCallback(async () => {
    try {
      setInvestmentsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investments`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setInvestments(data);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setInvestmentsLoading(false);
    }
  }, []);

  const fetchProjectsList = useCallback(async () => {
    try {
      setProjectsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    try {
      setSubmissionsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/submitted-properties`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setSubmissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token || !isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
    fetchProperties();
    fetchContacts();
    fetchInvestments();
    fetchProjectsList();
    fetchSubmissions();
  }, [fetchDashboardData, fetchProperties, fetchContacts, fetchInvestments, fetchProjectsList, fetchSubmissions, navigate, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact/${contactId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        toast.success('Inquiry updated successfully!');
        fetchContacts();
      } else {
        toast.error('Failed to update inquiry status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('System error during update');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success('Property removed successfully!');
        fetchProperties();
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: HiHome },
    { id: 'properties', label: 'Inventory', icon: HiOfficeBuilding },
    { id: 'investments', label: 'Land Bank', icon: HiGlobe },
    { id: 'projects', label: 'New Ventures', icon: HiClipboardList },
    { id: 'inquiries', label: 'Leads Inbox', icon: HiMail },
    { id: 'submissions', label: 'Pending Apps', icon: HiDocumentText },
    { id: 'analytics', label: 'System Intel', icon: HiChartBar },
    { id: 'settings', label: 'Parameters', icon: HiCog },
  ];

  const renderContent = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Decrypting Workspace...</p>
      </div>
    );

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Executive Control</h2>
                <p className="text-slate-500 mt-1 font-medium italic">Synchronized overview of all real estate operations.</p>
              </div>
              <div className="hidden md:flex gap-3">
                <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Live</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Listings', value: dashboardData?.totalProperties || 0, icon: HiOfficeBuilding, color: 'blue', trend: '+12% this week' },
                { label: 'Inquiry Pipeline', value: dashboardData?.totalContacts || 0, icon: HiMail, color: 'teal', trend: 'Response Required' },
                { label: 'Land Assets', value: dashboardData?.totalInvestments || 0, icon: HiGlobe, color: 'amber', trend: 'Expanding' },
                { label: 'Project Queue', value: projects.length, icon: HiTrendingUp, color: 'indigo', trend: 'On Schedule' }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                   <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700`}></div>
                   <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all`}>
                        <stat.icon size={28} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-3">
                         <h3 className="text-4xl font-black text-[#1e293b]">{stat.value}</h3>
                         <span className={`text-[10px] font-bold text-${stat.color}-500 bg-${stat.color}-50 px-2 py-0.5 rounded-lg`}>{stat.trend}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Quick Table */}
               <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="text-xl font-black text-[#1e293b]">Recent Acquisitions</h3>
                     <button onClick={() => setActiveTab('properties')} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Full Database</button>
                  </div>
                  <div className="flex-1 overflow-x-auto">
                     <table className="w-full">
                        <thead className="bg-slate-50/50">
                           <tr>
                              <th className="px-10 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Entity</th>
                              <th className="px-10 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Location</th>
                              <th className="px-10 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Valuation</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {properties.slice(0, 5).map(prop => (
                             <tr key={prop._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-10 py-5">
                                   <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                         {prop.images?.[0] ? <img src={prop.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><HiHome /></div>}
                                      </div>
                                      <span className="text-sm font-black text-slate-800">{prop.propertyName || 'Unnamed Asset'}</span>
                                   </div>
                                </td>
                                <td className="px-10 py-5 text-center">
                                   <span className="text-xs font-bold text-slate-500 italic">{prop.location}</span>
                                </td>
                                <td className="px-10 py-5 text-right font-black text-blue-600 text-sm">
                                   ₹{prop.price?.toLocaleString()}
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Activity Feed */}
               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 flex flex-col">
                  <h3 className="text-xl font-black text-[#1e293b] mb-8">Inbound Activity</h3>
                  <div className="space-y-8 flex-1">
                     {contacts.slice(0, 4).map(contact => (
                       <div key={contact._id} className="flex gap-4 relative">
                          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 font-black border border-teal-100">
                             {contact.name[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start">
                                <p className="text-sm font-black text-slate-800 truncate">{contact.name}</p>
                                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{new Date(contact.createdAt).toLocaleDateString()}</span>
                             </div>
                             <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic font-medium">"{contact.message}"</p>
                             <div className={`inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                contact.status === 'unread' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                             }`}>
                                {contact.status}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
                  <button onClick={() => setActiveTab('inquiries')} className="mt-10 py-4 w-full bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Access Communication HUB</button>
               </div>
            </div>
          </div>
        );

      case 'properties':
        if (showAddProperty) return <AddPropertyForm onClose={(success) => { setShowAddProperty(false); if (success) fetchProperties(); }} />;
        return (
          <div className="space-y-8 animate-fade-in text-[#1e293b]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Inventory Engine</h2>
                <p className="text-slate-500 mt-1 font-medium italic">High-precision management of all listed assets.</p>
              </div>
              <button onClick={() => setShowAddProperty(true)} className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-[1.5rem] font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all flex items-center gap-3">
                <HiPlus size={20} />
                <span className="uppercase tracking-widest text-xs">Append New Listing</span>
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center text-[#1e293b]">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Total Synchronized: {properties.length}</h3>
                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors"><HiAdjustments /></div>
                  </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-slate-50/20">
                       <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                       <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Geographical Node</th>
                       <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Valuation</th>
                       <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">State</th>
                       <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Commands</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {propertiesLoading ? (
                       <tr><td colSpan="5" className="px-10 py-24 text-center">
                          <div className="flex flex-col items-center gap-4">
                             <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
                             <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase italic">Streaming Data...</span>
                          </div>
                       </td></tr>
                     ) : properties.map(prop => (
                       <tr key={prop._id} className="hover:bg-blue-50/20 transition-all group">
                         <td className="px-10 py-6">
                           <div className="flex items-center gap-5">
                             <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                               {prop.images?.[0] ? <img src={prop.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><HiOfficeBuilding size={24} /></div>}
                             </div>
                             <div>
                               <div className="text-sm font-black text-slate-800 leading-tight mb-1">{prop.propertyName || `${prop.bedroom || 'N/A'} BHK ${prop.propertyType}`}</div>
                               <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-70">{prop.propertyType}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-10 py-6 text-center">
                           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600">
                             <HiLocationMarker className="text-slate-400" />
                             {prop.location}, {prop.city}
                           </div>
                         </td>
                         <td className="px-10 py-6 text-center font-black text-slate-900 text-sm">
                           ₹{prop.price?.toLocaleString()}
                         </td>
                         <td className="px-10 py-6 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                             prop.status === 'available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                             prop.status === 'sold' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                             'bg-amber-50 text-amber-600 border-amber-100'
                           }`}>
                             {prop.status}
                           </span>
                         </td>
                         <td className="px-10 py-6">
                           <div className="flex justify-end gap-3">
                             <button onClick={() => { setSelectedProperty(prop); setShowPropertyModal(true); }} className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"><HiEye /></button>
                             <button onClick={() => { setEditingProperty(prop); setShowEditProperty(true); }} className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center shadow-sm"><HiPencil /></button>
                             <button onClick={() => handleDeleteProperty(prop._id)} className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center shadow-sm"><HiTrash /></button>
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

      case 'inquiries':
        return (
          <div className="space-y-8 animate-fade-in text-[#1e293b]">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Communication HUB</h2>
                <p className="text-slate-500 mt-1 font-medium italic">Centralized inquiry processing and response queue.</p>
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
               {contacts.length === 0 ? (
                 <div className="py-32 text-center text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] italic">Protocol: No Pending Data Found</div>
               ) : contacts.map(contact => (
                 <div key={contact._id} className="p-10 hover:bg-slate-50/50 transition-all group">
                    <div className="flex items-start justify-between">
                       <div className="flex items-start gap-6">
                          <div className="w-16 h-16 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center text-slate-400 shadow-inner border border-white group-hover:scale-110 transition-transform">
                             <HiUser size={32} />
                          </div>
                          <div>
                             <div className="flex items-center gap-4">
                                <h4 className="text-xl font-black text-[#1e293b]">{contact.name}</h4>
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                  contact.status === 'unread' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                  contact.status === 'read' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                  'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}>
                                  {contact.status}
                                </span>
                             </div>
                             <p className="text-sm font-bold text-blue-600 mt-1 flex items-center gap-4">
                                <span>{contact.email}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                <span>{contact.phone}</span>
                             </p>
                             <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">Received: {new Date(contact.createdAt).toLocaleString()}</p>
                          </div>
                       </div>
                       <select 
                         value={contact.status} 
                         onChange={(e) => handleUpdateContactStatus(contact._id, e.target.value)}
                         className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-blue-500/10 outline-none cursor-pointer hover:border-blue-400 transition-all"
                       >
                         <option value="unread">Pending Review</option>
                         <option value="read">Archived State</option>
                         <option value="responded">Execution Done</option>
                       </select>
                    </div>
                    <div className="mt-8 bg-slate-50 rounded-[2rem] p-8 border border-slate-100 italic text-slate-600 text-sm leading-relaxed relative overflow-hidden group-hover:bg-white group-hover:shadow-md transition-all">
                       <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/10"></div>
                       "{contact.message}"
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'investments':
        return (
          <div className="space-y-8 animate-fade-in text-[#1e293b]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Land Portfolio</h2>
                <p className="text-slate-500 mt-1 font-medium italic">Agricultural and high-yield land bank monitoring.</p>
              </div>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-blue-500/20">
                <HiPlus /> New Listing
              </button>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400">Asset Title</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 text-center">Land Type</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 text-center">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {investments.map(inv => (
                      <tr key={inv._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6 font-black text-slate-800">{inv.title}</td>
                        <td className="px-10 py-6 text-center text-xs font-bold text-slate-500 uppercase italic">{inv.landType}</td>
                        <td className="px-10 py-6 text-center">
                           <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase">{inv.status}</span>
                        </td>
                        <td className="px-10 py-6 text-right font-black text-sm text-[#1e293b]">₹{inv.totalPrice?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-8 animate-fade-in text-[#1e293b]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Strategic Projects</h2>
                <p className="text-slate-500 mt-1 font-medium italic">Ongoing and upcoming urban development ventures.</p>
              </div>
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">Launch Venture</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {projects.map(proj => (
                 <div key={proj._id} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-full aspect-video bg-slate-100 rounded-2xl mb-6 overflow-hidden relative">
                       {proj.images?.[0] ? <img src={proj.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><HiGlobe size={40} /></div>}
                       <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">{proj.status}</div>
                    </div>
                    <h4 className="text-lg font-black text-[#1e293b] mb-2">{proj.title}</h4>
                    <p className="text-xs text-slate-400 font-bold flex items-center gap-2 mb-6 uppercase tracking-wider line-clamp-1"><HiLocationMarker /> {proj.location}, {proj.city}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                       <span className="text-sm font-black text-indigo-600">{proj.price}</span>
                       <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"><HiArrowRight /></button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'submissions':
        return (
          <div className="space-y-8 animate-fade-in text-[#1e293b]">
            <div>
              <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Review Pipeline</h2>
              <p className="text-slate-500 mt-1 font-medium italic">Validating incoming user property applications.</p>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
               {submissions.length === 0 ? (
                 <div className="py-32 text-center text-slate-400 font-black tracking-widest text-[10px] uppercase">Zero Pending Assets</div>
               ) : submissions.map(sub => (
                 <div key={sub._id} className="p-10 flex flex-col md:flex-row gap-8 items-start group">
                    <div className="w-full md:w-64 aspect-[4/3] bg-slate-100 rounded-3xl flex-shrink-0 overflow-hidden shadow-inner flex items-center justify-center text-slate-300">
                       {/* Images usually not available for user submissions unless stored */}
                       <HiClipboardList size={48} />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="text-xl font-black text-[#1e293b]">{sub.title || 'Untitled Submission'}</h4>
                             <p className="text-sm font-bold text-blue-600 flex items-center gap-2 mt-1 italic"><HiLocationMarker /> {sub.location}</p>
                          </div>
                          <span className="px-4 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[9px] font-black uppercase tracking-widest">{sub.status}</span>
                       </div>
                       <p className="text-sm text-slate-500 mt-6 leading-relaxed line-clamp-3">"{sub.description}"</p>
                       <div className="mt-8 flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><HiUser /></div>
                             <div>
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Submitter</p>
                                <p className="text-xs font-black text-slate-700">{sub.contactName}</p>
                             </div>
                          </div>
                          <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all ml-auto">Initiate Approval</button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8 animate-fade-in text-[#1e293b]">
            <div>
              <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Market Intelligence</h2>
              <p className="text-slate-500 mt-1 font-medium italic">Statistical analysis and performance analytics.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 aspect-[21/9] bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col items-center justify-center text-slate-400 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                     <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
                        {Array.from({length: 100}).map((_, i) => <div key={i} className="border border-slate-900/10"></div>)}
                     </div>
                  </div>
                  <HiChartBar size={64} className="mb-4 opacity-50" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Rendering Dynamic Visualizations...</p>
               </div>
               <div className="bg-[#1e293b] text-white rounded-[2.5rem] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">System Health</h3>
                    <div className="space-y-6">
                       {[
                         { l: 'Server Latency', v: '24ms', c: 'teal' },
                         { l: 'Database Sync', v: '99.9%', c: 'teal' },
                         { l: 'Network Load', v: 'Low', c: 'amber' },
                         { l: 'Asset Security', v: 'Optimal', c: 'teal' }
                       ].map((n, i) => (
                         <div key={i} className="flex justify-between items-center group">
                            <span className="text-xs font-bold text-slate-500">{n.l}</span>
                            <span className={`text-xs font-black text-${n.c}-400 group-hover:scale-110 transition-transform`}>{n.v}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="mt-12 p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Build Identifier</p>
                     <p className="text-xs font-mono text-teal-400 truncate">v1.2.0-STABLE.XPERTS</p>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8 animate-fade-in text-[#1e293b]">
            <div>
              <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Security & Parameters</h2>
              <p className="text-slate-500 mt-1 font-medium italic">Global configuration and administrative preferences.</p>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 max-w-2xl shadow-sm">
               <div className="space-y-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Administrative Profile</label>
                     <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">A</div>
                        <div>
                           <p className="text-sm font-black text-slate-800">Global Administrator</p>
                           <p className="text-xs font-bold text-slate-400">master_admin_xperts</p>
                        </div>
                        <button className="ml-auto px-5 py-2 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:shadow-md transition-all">Modify</button>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Authentication Persistence</label>
                     <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                        <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                           <span className="text-xs font-black text-slate-700">Two-Factor Encryption</span>
                           <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full ml-auto"></div></div>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-black text-slate-700">Session Auto-Expiry (24h)</span>
                           <div className="w-12 h-6 bg-slate-300 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full"></div></div>
                        </div>
                     </div>
                  </div>
                  <button className="w-full py-5 bg-[#1e293b] text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 active:scale-95 transition-all">Commit Global Parameters</button>
               </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900">
      {/* Sidebar Layout */}
      <aside className="w-72 bg-[#001529] text-white flex-shrink-0 relative z-20 shadow-2xl flex flex-col hidden md:flex">
         <div className="p-10 border-b border-white/5">
            <Link to="/" className="flex items-center group">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-blue-600 transition-colors">
                  <HiOfficeBuilding size={24} className="text-blue-400 group-hover:text-white" />
               </div>
               <div>
                  <h1 className="text-sm font-black tracking-widest uppercase">The Realty</h1>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Xperts Admin</p>
               </div>
            </Link>
         </div>

         <nav className="flex-1 px-6 py-10 space-y-3 overflow-y-auto">
            {menuItems.map((item) => {
               const Icon = item.icon;
               const isActive = activeTab === item.id;
               return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-5 px-6 py-4 rounded-3xl text-left transition-all duration-300 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/20' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                     <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
                     <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                     {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse"></div>}
                  </button>
               );
            })}
         </nav>

         <div className="p-8 mt-auto">
            <button
               onClick={handleLogout}
               className="w-full flex items-center justify-center gap-3 bg-rose-500/10 text-rose-400 border border-rose-500/10 py-4 rounded-3xl hover:bg-rose-500 hover:text-white transition-all duration-500 font-black text-[10px] uppercase tracking-widest"
            >
               <HiLogout size={18} />
               Terminate Session
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
         <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-12 flex-shrink-0 z-10 sticky top-0">
            <div className="flex items-center gap-4">
               <div className="md:hidden w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800">
                  <HiViewGrid />
               </div>
               <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-400 tracking-widest">Portal</span>
                  <HiX className="text-slate-300 rotate-45" size={10} />
                  <span className="text-sm font-black text-slate-900 capitalize tracking-tight">{activeTab}</span>
               </div>
            </div>

            <div className="flex items-center gap-8">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 tracking-tight">Executive Admin</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Clearance</p>
               </div>
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-white shadow-inner flex items-center justify-center text-slate-400 relative group cursor-pointer hover:shadow-xl transition-all">
                  <HiUser size={28} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
               </div>
            </div>
         </header>

         <section className="flex-1 overflow-y-auto p-12 bg-[#f8fafc]/50">
            <div className="max-w-7xl mx-auto">
               {renderContent()}
            </div>
         </section>
      </main>

      {/* Modals Container */}
      {showPropertyModal && selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => { setShowPropertyModal(false); setSelectedProperty(null); }}
        />
      )}

      {showEditProperty && editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onClose={() => { setShowEditProperty(false); setEditingProperty(null); }}
          onSuccess={() => { setShowEditProperty(false); setEditingProperty(null); fetchProperties(); fetchDashboardData(); }}
        />
      )}
    </div>
  );
};

/* --- SUB-COMPONENTS (MODALS) --- */

const PropertyDetailsModal = ({ property, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#001529]/60 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-fade-in">
      <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-4">
               <h2 className="text-4xl font-black text-[#1e293b] tracking-tighter">{property.propertyName || 'Technical Analysis'}</h2>
               <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                  property.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
               }`}>{property.status}</span>
            </div>
            <p className="text-slate-400 font-bold mt-2 flex items-center gap-2 text-sm italic"><HiLocationMarker /> {property.location}, {property.city}</p>
          </div>
          <button onClick={onClose} className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center text-2xl shadow-sm">
            <HiX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 aspect-[16/9] bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl group relative">
               {property.images?.[0] ? (
                 <img src={property.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Main" />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                   <HiHome size={80} className="mb-4 opacity-50" />
                   <div className="text-[10px] font-black uppercase tracking-[0.5em] italic">Visual Asset Cryptographic Failure</div>
                 </div>
               )}
            </div>
            <div className="grid grid-cols-2 gap-6 h-full">
               {[1, 2, 3, 4].map(idx => (
                 <div key={idx} className="bg-slate-50 rounded-[2rem] overflow-hidden shadow-sm aspect-square border border-slate-100 group relative">
                    {property.images?.[idx] ? (
                       <img src={property.images[idx]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`View ${idx}`} />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-slate-200 opacity-30"><HiOfficeBuilding size={32} /></div>
                    )}
                 </div>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
             {[
                { i: HiHome, l: 'Category', v: property.propertyType, c: 'blue' },
                { i: HiCurrencyRupee, l: 'Valuation', v: `₹${property.price?.toLocaleString()}`, c: 'emerald' },
                { i: HiViewGrid, l: 'Area', v: `${property.area} sq.ft`, c: 'indigo' },
                { i: HiUserGroup, l: 'Configuration', v: property.bedroom ? `${property.bedroom} BHK` : 'Studio', c: 'teal' }
             ].map((s, i) => (
               <div key={i} className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-100 transition-all group">
                  <div className={`w-12 h-12 rounded-2xl bg-${s.c}-50 text-${s.c}-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-${s.c}-600 group-hover:text-white transition-all`}><s.i size={24} /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.l}</p>
                  <p className="text-xl font-black text-[#1e293b] capitalize">{s.v}</p>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 space-y-12">
                <div className="bg-white rounded-[3rem] p-12 border border-slate-50 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-2 h-full bg-blue-600/50"></div>
                   <h3 className="text-xl font-black text-[#1e293b] mb-6 tracking-tight">Conceptual Narrative</h3>
                   <p className="text-slate-500 leading-[2.2] text-sm font-medium">{property.propertyDescription || 'Internal documentation pending for this acquisition.'}</p>
                </div>

                <div>
                   <h3 className="text-xl font-black text-[#1e293b] mb-8">Infrastructure Stack</h3>
                   <div className="flex flex-wrap gap-4">
                      {property.amenities?.map((am, i) => (
                        <div key={i} className="px-6 py-4 bg-slate-50 text-slate-600 rounded-3xl text-[10px] font-black uppercase tracking-widest border border-slate-100 flex items-center gap-3 hover:bg-white hover:shadow-xl transition-all h-14">
                           <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                           {am}
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="bg-[#1e293b] text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10">Technical Schematics</h4>
                   <div className="space-y-8">
                      {[
                        { label: 'Furnishing', val: property.furnishing || 'Standard' },
                        { label: 'Transaction', val: property.transaction || 'Direct' },
                        { label: 'Age', val: property.propertyAge || 'Fresh' },
                        { label: 'Log ID', val: property.flatNo || 'RE-X-99' }
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center pb-6 border-b border-white/5 last:border-0 last:pb-0">
                           <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{row.label}</span>
                           <span className="font-black text-sm capitalize text-white">{row.val}</span>
                        </div>
                      ))}
                   </div>
                </div>
                {property.youtubeUrl && (
                  <a href={property.youtubeUrl} target="_blank" rel="noreferrer" className="block w-full py-6 bg-rose-50 text-rose-600 rounded-[2rem] text-center font-black uppercase tracking-widest text-[10px] border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-lg shadow-rose-500/10">
                    Visual Deployment Ready
                  </a>
                )}
             </div>
          </div>
        </div>

        <div className="px-12 py-10 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center backdrop-blur-md">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter italic">Authorized Access Only • System Entropy: Low • {new Date(property.createdAt).toLocaleString()}</p>
           <button onClick={onClose} className="px-12 py-5 bg-[#1e293b] text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Dismiss Parameters</button>
        </div>
      </div>
    </div>
  );
};

const EditPropertyModal = ({ property, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ ...property });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties/${property._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('Core state updated!');
        onSuccess();
      } else {
        toast.error('Sync failure');
      }
    } catch (e) { toast.error('System error'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-[#001529]/60 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-fade-in shadow-2xl">
      <div className="bg-white rounded-[3.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-center bg-white/80 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h2 className="text-3xl font-black text-[#1e293b] tracking-tighter">Modification Protocol</h2>
            <p className="text-slate-400 font-black uppercase text-[9px] tracking-[0.5em] mt-2">Target Node: {property._id?.slice(-12).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="w-16 h-16 rounded-[2rem] bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center shadow-sm">
            <HiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Decommissioned (Sold)</option>
                    <option value="rented">Leased State</option>
                  </select>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Alias</label>
                  <input 
                    type="text" 
                    value={formData.propertyName} 
                    onChange={e => setFormData({ ...formData, propertyName: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-sm outline-none focus:bg-white transition-all"
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Market Valuation</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-sm outline-none focus:bg-white transition-all"
                  />
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Geographical Parameters</label>
               <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Location Sector" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-sm outline-none" />
                  <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="City Node" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-sm outline-none" />
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Deep Description</label>
               <textarea 
                  value={formData.propertyDescription} 
                  onChange={e => setFormData({ ...formData, propertyDescription: e.target.value })}
                  rows={6}
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] font-medium text-sm outline-none focus:bg-white transition-all leading-relaxed"
               />
            </div>
        </form>

        <div className="px-12 py-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-6 items-center">
           <button type="button" onClick={onClose} className="px-10 py-5 bg-white text-slate-500 rounded-3xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-100 transition-all">Discard Changes</button>
           <button onClick={handleSubmit} disabled={loading} className="px-14 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-4">
              {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Commit modifications'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;