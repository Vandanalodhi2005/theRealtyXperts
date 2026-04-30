import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Properties from './components/Properties';
import Projects from './components/Projects';
import SubmitProperty from './components/SubmitProperty';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookiePolicy from './components/CookiePolicy';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import PropertyDetails from './components/PropertyDetails';
import HeroSlider from './components/HeroSlider';
import Home from './components/Home';
import Investment from './components/Investment';
import InvestmentDetails from './components/InvestmentDetails';
import ProjectDetails from './components/ProjectDetails';
import Gallery from './components/Gallery';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';

// User Layout Component
const UserLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', width: '100%' }} className="bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <Header />
    <main style={{ flexGrow: 1, width: '100%', overflowX: 'hidden' }}>
      {children}
    </main>
    <Footer />
  </div>
);

UserLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

// Admin Layout Component
const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    {children}
  </div>
);

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        {/* User Routes with Header/Footer */}
        <Route path="/" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/about" element={<UserLayout><AboutUs /></UserLayout>} />
        <Route path="/services" element={<UserLayout><Services /></UserLayout>} />
        <Route path="/properties" element={<UserLayout><Properties category="all" /></UserLayout>} />
        <Route path="/residential" element={<UserLayout><Properties category="residential" /></UserLayout>} />
        <Route path="/commercial" element={<UserLayout><Properties category="commercial" /></UserLayout>} />
        <Route path="/investment" element={<UserLayout><Investment /></UserLayout>} />
        <Route path="/investment/:id" element={<UserLayout><InvestmentDetails /></UserLayout>} />
        <Route path="/property/:id" element={<UserLayout><PropertyDetails /></UserLayout>} />
        <Route path="/projects" element={<UserLayout><Projects type="all" /></UserLayout>} />
        <Route path="/projects/residential" element={<UserLayout><Projects type="residential" /></UserLayout>} />
        <Route path="/projects/commercial" element={<UserLayout><Projects type="commercial" /></UserLayout>} />
        <Route path="/projects/investment" element={<UserLayout><Projects type="investment" /></UserLayout>} />
        <Route path="/project/:id" element={<UserLayout><ProjectDetails /></UserLayout>} />
        <Route path="/gallery" element={<UserLayout><Gallery /></UserLayout>} />
        <Route path="/submit-property" element={<UserLayout><SubmitProperty /></UserLayout>} />
        <Route path="/contact" element={<UserLayout><ContactUs /></UserLayout>} />
        <Route path="/terms" element={<UserLayout><TermsAndConditions /></UserLayout>} />
        <Route path="/privacy" element={<UserLayout><PrivacyPolicy /></UserLayout>} />
        <Route path="/cookie-policy" element={<UserLayout><CookiePolicy /></UserLayout>} />

        {/* Admin Routes without Header/Footer */}
        <Route path="/admin/login" element={<AdminLayout><AdminLogin /></AdminLayout>} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      </Routes>
    </>
  );
}

export default App;
