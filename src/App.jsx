import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import About from './pages/About';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Services from './pages/Services';
import Contact from './pages/Contact';

import Residential from './pages/Residential';
import Commercial from './pages/Commercial';
import Investment from './pages/Investment';
import FrontendProjects from './pages/FrontendProjects';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProperties from './admin/AdminProperties';
import AdminInvestments from './admin/AdminInvestments';
import AdminProjects from './admin/AdminProjects';
import AdminInquiries from './admin/AdminInquiries';
import AdminSubmissions from './admin/AdminSubmissions';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminSettings from './admin/AdminSettings';

import './index.css';

const PublicLayout = () => {
  return (
    <>
      <Header />
      <div style={{minHeight: '80vh'}}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="investments" element={<AdminInvestments />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<AdminDashboard />} />
        </Route>

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/residential" element={<Residential />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/projects" element={<FrontendProjects />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
