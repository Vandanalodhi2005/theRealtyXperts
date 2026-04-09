import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  HiClipboardList
} from 'react-icons/hi';
import sunriseLogo from '../../assets/sunrise_logo.png';
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

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      } else {
        localStorage.removeItem('adminToken');
        navigate(`/admin/login`);
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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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

  const updateContactStatus = async (contactId, status) => {
    console.log('updateContactStatus called with:', { contactId, status, type: typeof contactId });

    if (!contactId) {
      toast.error('Invalid inquiry ID');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      console.log('Token from localStorage:', token);

      if (!token) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/admin/login');
        return;
      }

      // console.log('Making API call to:', `/api/contact/${contactId}/status`);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact/${contactId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const updatedContact = await response.json();
        console.log('Inquiry updated successfully:', updatedContact);
        // Update local state
        setContacts(contacts.map(contact =>
          contact._id === contactId ? { ...contact, status } : contact
        ));
        toast.success('Inquiry status updated successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Failed to update inquiry status:', response.status, errorData);
        toast.error(`Failed to update inquiry status: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast.error('Error updating inquiry status: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Property deleted successfully!');
        fetchProperties(); // Refresh the list
        fetchDashboardData(); // Update dashboard stats
      } else {
        toast.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowEditProperty(true);
  };

  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact/${contactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success('Contact status updated');
        fetchContacts(); // Refresh the list
        fetchDashboardData(); // Update dashboard stats
      } else {
        toast.error('Failed to update contact status');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error('Error updating contact status');
    }
  };

  const handleDeleteInvestment = async (id) => {
    if (!confirm('Are you sure you want to delete this investment?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success('Investment deleted successfully!');
        fetchInvestments();
        fetchDashboardData();
      } else {
        toast.error('Failed to delete investment');
      }
    } catch (error) {
      console.error('Error deleting investment:', error);
      toast.error('Error deleting investment');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success('Project deleted successfully!');
        fetchProjectsList();
        fetchDashboardData();
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project');
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/submitted-properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success('Submission deleted successfully!');
        fetchSubmissions();
        fetchDashboardData();
      } else {
        toast.error('Failed to delete submission');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Error deleting submission');
    }
  };

  const handleUpdateSubmissionStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/submitted-properties/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        toast.success('Submission status updated');
        fetchSubmissions();
      } else {
        toast.error('Failed to update submission status');
      }
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast.error('Error updating submission status');
    }
  };

  const handleAddInvestment = async (formDataToSend) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/investments`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
      });
      if (response.ok) {
        toast.success('Investment added successfully!');
        setShowAddInvestment(false);
        fetchInvestments();
        fetchDashboardData();
      } else {
        toast.error('Failed to add investment');
      }
    } catch (error) {
      console.error('Error adding investment:', error);
      toast.error('Error adding investment');
    }
  };

  const handleAddProject = async (formDataToSend) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
      });
      if (response.ok) {
        toast.success('Project added successfully!');
        setShowAddProject(false);
        fetchProjectsList();
        fetchDashboardData();
      } else {
        toast.error('Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Error adding project');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: HiHome },
    { id: 'properties', label: 'Properties', icon: HiOfficeBuilding },
    { id: 'investments', label: 'Investments', icon: HiGlobe },
    { id: 'projects', label: 'Projects', icon: HiClipboardList },
    { id: 'inquiries', label: 'Inquiries', icon: HiMail },
    { id: 'submissions', label: 'Submissions', icon: HiDocumentText },
    { id: 'analytics', label: 'Analytics', icon: HiChartBar },
    { id: 'settings', label: 'Settings', icon: HiCog },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Properties</p>
                    <p className="text-3xl font-bold text-slate-900">{dashboardData?.totalProperties || 0}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <HiOfficeBuilding className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <HiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">{dashboardData?.recentProperties || 0} added this month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Available Properties</p>
                    <p className="text-3xl font-bold text-slate-900">{dashboardData?.availableProperties || 0}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <HiOfficeBuilding className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <HiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">Ready for sale/rent</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Inquiries</p>
                    <p className="text-3xl font-bold text-slate-900">{dashboardData?.totalContacts || 0}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <HiMail className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <HiTrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-600">{dashboardData?.unreadContacts || 0} unread</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Land Investments</p>
                    <p className="text-3xl font-bold text-slate-900">{dashboardData?.totalInvestments || 0}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <HiGlobe className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Projects</p>
                    <p className="text-3xl font-bold text-slate-900">{dashboardData?.totalProjects || 0}</p>
                  </div>
                  <div className="p-3 rounded-full bg-indigo-100">
                    <HiClipboardList className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Submissions</p>
                    <p className="text-3xl font-bold text-slate-900">{dashboardData?.totalSubmissions || 0}</p>
                  </div>
                  <div className="p-3 rounded-full bg-red-100">
                    <HiDocumentText className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-blue-600">{dashboardData?.pendingSubmissions || 0} pending review</span>
                </div>
              </div>

            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Properties</h3>
                <div className="space-y-4">
                  {properties.slice(0, 3).map((property) => (
                    <div key={property._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                        <HiOfficeBuilding className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {property.propertyName || `${property.bedroom || ''} BHK ${property.propertyType}`}
                        </p>
                        <p className="text-xs text-slate-500">
                          Added {new Date(property.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowPropertyModal(true);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <HiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProperty(property);
                            setShowEditProperty(true);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <HiPencil className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {properties.length === 0 && !propertiesLoading && (
                    <p className="text-center text-slate-500 py-4">No properties found</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('properties')}
                  className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View All Properties
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Inquiries</h3>
                <div className="space-y-4">
                  {contacts.slice(0, 3).map((contact) => (
                    <div key={contact._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50">
                      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                        <HiUser className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                        <p className="text-xs text-slate-500">
                          {contact.message.length > 30 ? `${contact.message.substring(0, 30)}...` : contact.message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <select
                          value={contact.status || 'unread'}
                          onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                          className={`px-2 py-1 text-xs rounded-full border-0 ${
                            contact.status === 'read' ? 'bg-green-100 text-green-800' :
                            contact.status === 'responded' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="responded">Replied</option>
                        </select>
                        <span className="text-xs text-slate-400">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {contacts.length === 0 && !contactsLoading && (
                    <p className="text-center text-slate-500 py-4">No inquiries found</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View All Inquiries
                </button>
              </div>
            </div>
          </div>
        );

      case 'properties':
        if (showAddProperty) {
          return <AddPropertyForm onCancel={() => setShowAddProperty(false)} onSuccess={() => {
            setShowAddProperty(false);
            fetchProperties(); // Refresh the properties list
            fetchDashboardData(); // Update dashboard stats
          }} />;
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Property Management</h2>
              <button 
                onClick={() => setShowAddProperty(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <HiPlus className="w-4 h-4" />
                Add New Property
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">All Properties</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {propertiesLoading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-slate-500">
                          Loading properties...
                        </td>
                      </tr>
                    ) : properties.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-slate-500">
                          No properties found. Add your first property!
                        </td>
                      </tr>
                    ) : (
                      properties.map((property) => (
                        <tr key={property._id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center mr-3">
                                {property.images && property.images.length > 0 ? (
                                  <img
                                    src={property.images[0]}
                                    alt={property.propertyName || 'Property'}
                                    className="w-10 h-10 object-cover rounded-lg"
                                  />
                                ) : (
                                  <HiOfficeBuilding className="w-5 h-5 text-slate-600" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-900">
                                  {property.propertyName || `${property.bedroom || ''} BHK ${property.propertyType || 'Property'}`}
                                </div>
                                <div className="text-sm text-slate-500">{property.propertyType}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-slate-900">
                              <HiLocationMarker className="w-4 h-4 mr-1 text-slate-400" />
                              {property.location}, {property.city}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            ₹{property.price?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              property.status === 'available'
                                ? 'bg-green-100 text-green-800'
                                : property.status === 'sold'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {property.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewProperty(property)}
                                className="text-blue-600 hover:text-blue-900"
                                title="View Details"
                              >
                                <HiEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditProperty(property)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit Property"
                              >
                                <HiPencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Property"
                              >
                                <HiTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'inquiries':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Customer Inquiries</h2>
              <div className="flex gap-2">
                <button className="bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">
                  Export
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Inquiries</p>
                    <p className="text-2xl font-bold text-slate-900">{contacts.length}</p>
                  </div>
                  <HiMail className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Unread</p>
                    <p className="text-2xl font-bold text-slate-900">{contacts.filter(c => c.status === 'unread').length}</p>
                  </div>
                  <HiCalendar className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Responded</p>
                    <p className="text-2xl font-bold text-slate-900">{contacts.filter(c => c.status === 'responded').length}</p>
                  </div>
                  <HiDocumentText className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Recent Inquiries</h3>
              </div>
              <div className="divide-y divide-slate-200">
                {contactsLoading ? (
                  <div className="px-6 py-4 text-center text-slate-500">Loading inquiries...</div>
                ) : contacts.length === 0 ? (
                  <div className="px-6 py-4 text-center text-slate-500">No inquiries found</div>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact._id} className="px-6 py-4 hover:bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                            <HiUser className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                            <p className="text-sm text-slate-500">{contact.email} • {contact.phone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <select
                            value={contact.status}
                            onChange={(e) => handleUpdateContactStatus(contact._id, e.target.value)}
                            className={`px-2 py-1 text-xs rounded-full border-0 mb-1 block ${
                              contact.status === 'unread'
                                ? 'bg-red-100 text-red-800'
                                : contact.status === 'read'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="responded">Responded</option>
                          </select>
                          <p className="text-xs text-slate-500">{new Date(contact.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-slate-700">{contact.message}</p>
                      </div>
                      <div className="mt-3 flex justify-end space-x-2">
                        <button
                          onClick={() => alert(`Full Details:\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nMessage: ${contact.message}\nDate: ${new Date(contact.createdAt).toLocaleString()}`)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'investments':
        if (showAddInvestment) {
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Add New Investment</h2>
                <button onClick={() => setShowAddInvestment(false)} className="bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                handleAddInvestment(fd);
              }} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                    <input type="text" name="title" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Land Title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Land Type *</label>
                    <select name="landType" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Type</option>
                      <option value="agricultural">Agricultural</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                    <select name="status" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Price (₹) *</label>
                    <input type="number" name="totalPrice" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Total Price" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Area *</label>
                    <input type="number" name="area" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Area" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Area Unit</label>
                    <select name="areaUnit" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="sq.ft">Sq.ft</option>
                      <option value="sq.yard">Sq.yard</option>
                      <option value="acre">Acre</option>
                      <option value="hectare">Hectare</option>
                      <option value="bigha">Bigha</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price Per Unit (₹)</label>
                    <input type="number" name="pricePerUnit" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Price per unit" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                    <input type="text" name="location" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Location/Area" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                    <input type="text" name="city" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="City" defaultValue="Bhopal" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                  <textarea name="description" required rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Land description" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Highlights (comma separated)</label>
                  <input type="text" name="highlights" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Near highway, RERA approved, Clear title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nearby Places</label>
                  <input type="text" name="nearbyPlaces" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Schools, Hospitals, Markets" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Map URL</label>
                  <input type="url" name="mapUrl" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Google Maps URL" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Images</label>
                  <input type="file" name="images" multiple accept="image/*" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowAddInvestment(false)} className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Add Investment</button>
                </div>
              </form>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Land Investments</h2>
              <button onClick={() => setShowAddInvestment(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                <HiPlus className="w-4 h-4" /> Add Investment
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {investmentsLoading ? (
                      <tr><td colSpan="6" className="px-6 py-4 text-center text-slate-500">Loading investments...</td></tr>
                    ) : investments.length === 0 ? (
                      <tr><td colSpan="6" className="px-6 py-4 text-center text-slate-500">No investments found. Add your first investment!</td></tr>
                    ) : (
                      investments.map((inv) => (
                        <tr key={inv._id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{inv.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{inv.location}, {inv.city}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">{inv.landType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">₹{inv.totalPrice?.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              inv.status === 'available' ? 'bg-green-100 text-green-800' :
                              inv.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>{inv.status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleDeleteInvestment(inv._id)} className="text-red-600 hover:text-red-900" title="Delete">
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'projects':
        if (showAddProject) {
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Add New Project</h2>
                <button onClick={() => setShowAddProject(false)} className="bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                handleAddProject(fd);
              }} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                    <input type="text" name="title" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Project Title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                    <select name="type" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                    <select name="status" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="upcoming">Upcoming</option>
                      <option value="under-construction">Under Construction</option>
                      <option value="ready-to-move">Ready to Move</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (Starting from) *</label>
                    <input type="text" name="price" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="₹45,00,000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                    <input type="text" name="location" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Location/Area" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                    <input type="text" name="city" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="City" defaultValue="Bhopal" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                  <textarea name="description" required rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Project description" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Highlights (comma separated)</label>
                  <input type="text" name="highlights" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Green campus, Gated community, Smart homes" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amenities (comma separated)</label>
                  <input type="text" name="amenities" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Swimming Pool, Gym, Clubhouse" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL</label>
                  <input type="url" name="youtubeUrl" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://youtube.com/watch?v=..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Images</label>
                  <input type="file" name="images" multiple accept="image/*" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowAddProject(false)} className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Add Project</button>
                </div>
              </form>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Projects Management</h2>
              <button onClick={() => setShowAddProject(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                <HiPlus className="w-4 h-4" /> Add Project
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {projectsLoading ? (
                      <tr><td colSpan="6" className="px-6 py-4 text-center text-slate-500">Loading projects...</td></tr>
                    ) : projects.length === 0 ? (
                      <tr><td colSpan="6" className="px-6 py-4 text-center text-slate-500">No projects found. Add your first project!</td></tr>
                    ) : (
                      projects.map((proj) => (
                        <tr key={proj._id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{proj.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{proj.location}, {proj.city}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">{proj.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{proj.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              proj.status === 'ready-to-move' ? 'bg-green-100 text-green-800' :
                              proj.status === 'under-construction' ? 'bg-yellow-100 text-yellow-800' :
                              proj.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>{proj.status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleDeleteProject(proj._id)} className="text-red-600 hover:text-red-900" title="Delete">
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'submissions':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Property Submissions</h2>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-slate-600">{submissions.filter(s => s.status === 'pending').length} pending</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold text-slate-900">{submissions.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4">
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{submissions.filter(s => s.status === 'pending').length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4">
                <p className="text-sm text-slate-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{submissions.filter(s => s.status === 'approved').length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4">
                <p className="text-sm text-slate-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{submissions.filter(s => s.status === 'rejected').length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="divide-y divide-slate-200">
                {submissionsLoading ? (
                  <div className="px-6 py-4 text-center text-slate-500">Loading submissions...</div>
                ) : submissions.length === 0 ? (
                  <div className="px-6 py-4 text-center text-slate-500">No property submissions yet</div>
                ) : (
                  submissions.map((sub) => (
                    <div key={sub._id} className="px-6 py-4 hover:bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{sub.title}</h4>
                          <p className="text-xs text-slate-500">{sub.contactName} • {sub.contactEmail} • {sub.contactPhone}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={sub.status}
                            onChange={(e) => handleUpdateSubmissionStatus(sub._id, e.target.value)}
                            className={`px-2 py-1 text-xs rounded-full border-0 ${
                              sub.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                              sub.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                              sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button onClick={() => handleDeleteSubmission(sub._id)} className="text-red-500 hover:text-red-700">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600 mt-2">
                        <span><strong>Category:</strong> {sub.category}</span>
                        <span><strong>Type:</strong> {sub.type}</span>
                        <span><strong>Price:</strong> ₹{sub.price?.toLocaleString()}</span>
                        <span><strong>Location:</strong> {sub.location}</span>
                        {sub.bedrooms && <span><strong>Bedrooms:</strong> {sub.bedrooms}</span>}
                        {sub.area && <span><strong>Area:</strong> {sub.area} sq.ft</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{sub.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Submitted: {new Date(sub.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Analytics & Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Website Traffic</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Today</span>
                    <span className="text-sm font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">This Week</span>
                    <span className="text-sm font-medium">8,654</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">This Month</span>
                    <span className="text-sm font-medium">32,456</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Popular Properties</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">3 BHK Apartment</span>
                    <span className="text-sm font-medium">234 views</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Commercial Space</span>
                    <span className="text-sm font-medium">189 views</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Villa</span>
                    <span className="text-sm font-medium">156 views</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Lead Sources</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Direct</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Google</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Social Media</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Performance</h3>
              <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      defaultValue="SunRise Properties"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="info@sunriseproperties.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+91-9826098008"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  Save Changes
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src={'/logo/logo.png'} alt="RealityEx Properties" className="h-10 w-auto" />
              <div>
                <p className="text-sm text-slate-500">Admin Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <HiLogout size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-500'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Contact Details from Footer */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 border-b pb-2">Admin Support</h3>
              <ul className="text-xs text-slate-600 space-y-3">
                  <li className="flex items-center gap-2">
                      <i className="fas fa-user text-blue-500 w-4"></i> Sameer Tiwari
                  </li>
                  <li className="flex items-center gap-2">
                      <i className="fas fa-phone-alt text-blue-500 w-4"></i> 926-417-5587
                  </li>
                  <li className="flex items-center gap-2">
                      <i className="fas fa-envelope text-blue-500 w-4"></i> Emailtotre@gmail.com
                  </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Property Details Modal */}
      {showPropertyModal && selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => {
            setShowPropertyModal(false);
            setSelectedProperty(null);
          }}
        />
      )}

      {/* Edit Property Modal */}
      {showEditProperty && editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onClose={() => {
            setShowEditProperty(false);
            setEditingProperty(null);
          }}
          onSuccess={() => {
            setShowEditProperty(false);
            setEditingProperty(null);
            fetchProperties();
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};

// Property Details Modal Component
const PropertyDetailsModal = ({ property, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Property Details</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Property Images */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.images && property.images.length > 0 ? (
                <>
                  <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt="Main property"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {property.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Property ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                  <HiHome className="w-16 h-16 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Property Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Property Name:</span>
                  <span className="font-medium">{property.propertyName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-medium capitalize">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={`font-medium capitalize px-2 py-1 rounded text-sm ${
                    property.status === 'available' ? 'bg-green-100 text-green-800' :
                    property.status === 'sold' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Price:</span>
                  <span className="font-medium text-blue-600">₹{property.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Area:</span>
                  <span className="font-medium">{property.area} sq.ft</span>
                </div>
                {property.plotArea && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Plot Area:</span>
                    <span className="font-medium">{property.plotArea} sq.ft</span>
                  </div>
                )}
                {property.bedroom && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Bedrooms:</span>
                    <span className="font-medium">{property.bedroom}</span>
                  </div>
                )}
                {property.transaction && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Transaction:</span>
                    <span className="font-medium capitalize">{property.transaction}</span>
                  </div>
                )}
                {property.furnishing && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Furnishing:</span>
                    <span className="font-medium capitalize">{property.furnishing}</span>
                  </div>
                )}
                {property.propertyAge && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Property Age:</span>
                    <span className="font-medium">{property.propertyAge}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Location Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">City:</span>
                  <span className="font-medium">{property.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Location:</span>
                  <span className="font-medium">{property.location}</span>
                </div>
                {property.flatNo && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Flat No:</span>
                    <span className="font-medium">{property.flatNo}</span>
                  </div>
                )}
                {property.buildingName && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Building:</span>
                    <span className="font-medium">{property.buildingName}</span>
                  </div>
                )}
                {property.street && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Street:</span>
                    <span className="font-medium">{property.street}</span>
                  </div>
                )}
                {property.landmark && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Landmark:</span>
                    <span className="font-medium">{property.landmark}</span>
                  </div>
                )}
                {property.pinCode && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Pin Code:</span>
                    <span className="font-medium">{property.pinCode}</span>
                  </div>
                )}
                {property.address && (
                  <div>
                    <span className="text-slate-600 block mb-1">Full Address:</span>
                    <span className="font-medium">{property.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {property.propertyDescription && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Description</h3>
              <p className="text-slate-700 leading-relaxed">{property.propertyDescription}</p>
            </div>
          )}

          {/* Detailed Information */}
          {property.detailedInformation && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Detailed Information</h3>
              <p className="text-slate-700 leading-relaxed">{property.detailedInformation}</p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* YouTube URL */}
          {property.youtubeUrl && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Video</h3>
              <a
                href={property.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View Property Video
              </a>
            </div>
          )}

          {/* Property Metadata */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <span className="font-medium">Property ID:</span> {property._id?.slice(-8)}
              </div>
              <div>
                <span className="font-medium">Listed:</span> {new Date(property.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Property Modal Component
const EditPropertyModal = ({ property, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    status: property.status || 'available',
    propertyType: property.propertyType || 'apartment',
    price: property.price || '',
    area: property.area || '',
    plotArea: property.plotArea || '',
    bedroom: property.bedroom || '',
    transaction: property.transaction || '',
    furnishing: property.furnishing || '',
    propertyAge: property.propertyAge || '',
    flatNo: property.flatNo || '',
    propertyName: property.propertyName || '',
    buildingName: property.buildingName || '',
    street: property.street || '',
    landmark: property.landmark || '',
    pinCode: property.pinCode || '',
    address: property.address || '',
    city: property.city || '',
    location: property.location || '',
    propertyDescription: property.propertyDescription || '',
    detailedInformation: property.detailedInformation || '',
    amenities: property.amenities || [],
    youtubeUrl: property.youtubeUrl || '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

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
        toast.success('Property updated successfully!');
        onSuccess();
      } else {
        toast.error('Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Error updating property');
    } finally {
      setLoading(false);
    }
  };

  const amenitiesList = [
    'Water Softener', 'Kids Play Area', 'Volleyball Court', 'Badminton Court', 'Cricket Pitch', 'Wifi',
    'Dining Table', 'Curtains', 'Chimney', 'Microwave', 'Stove', 'Water Purifier', 'Washing Machine',
    'Fans', 'Lights', 'Exhaust Fan', 'Sofa', 'Wardrobe', 'T.V', 'Geysers', 'Modular Kitchen', 'Air Condition',
    'Refrigerator', 'Earthquake Resistant', 'Landscaped Garden', 'Indoor Games', 'Jogging park', 'Yoga centre',
    'Amphitheatre', 'Poolside Party Deck', 'Sklandscaping Party Lawns', 'Sky Lounge', 'Cabana cafe', 'Astro deck',
    'Herbal garden', 'Sky Walkway', 'Yoga Pads', 'UPS', 'Conference Room', 'Cafeteria', 'Garden', 'Terrace',
    'Lawn', 'Intercom', 'Reserved Park', 'CCTV', 'PlayArea', 'Balcony', 'Servant Quarters', 'Gym', 'Internet Connection',
    'Security', 'Parking', 'Swimming Pool', 'Gas Connection', 'Power Backup', 'Rain Water Harvesting', 'Clubhouse',
    'Lift', 'Vaastu', 'Air Conditioning', 'Large Windows/Natural Light', 'Stainless Steel Appliances', 'Laundry'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Edit Property</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Property Type *</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Area (Sq.ft) *</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter area"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Plot Area (Sq.ft)</label>
                  <input
                    type="number"
                    name="plotArea"
                    value={formData.plotArea}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter plot area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bedroom</label>
                  <input
                    type="number"
                    name="bedroom"
                    value={formData.bedroom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Number of bedrooms"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Transaction</label>
                  <select
                    name="transaction"
                    value={formData.transaction}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Transaction</option>
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Furnishing</label>
                  <select
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Furnishing</option>
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Property Age</label>
                  <input
                    type="text"
                    name="propertyAge"
                    value={formData.propertyAge}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2 years old"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Location Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Flat No./Unit No.</label>
                  <input
                    type="text"
                    name="flatNo"
                    value={formData.flatNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Flat/Unit number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Property Name</label>
                  <input
                    type="text"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Property name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Building Name</label>
                  <input
                    type="text"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Building name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nearby landmark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pin code"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Location/Area"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Description</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    name="propertyDescription"
                    value={formData.propertyDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed property description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Information</label>
                  <textarea
                    name="detailedInformation"
                    value={formData.detailedInformation}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional detailed information"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* YouTube URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">YouTube URL</label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating Property...' : 'Update Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;