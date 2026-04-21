import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PhoneCall } from 'lucide-react';

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const isActive = (path) => {
        return location.pathname === path ? 'active-link' : '';
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
        <div style={{ height: '80px' }}></div>
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo-container" onClick={() => setMobileMenuOpen(false)}>
                    <img src="/logo/logo.png" alt="TRX Emblem" className="logo-badge" />
                </Link>
                <nav className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/about" className={isActive('/about')}>About Us</Link>
                    <Link to="/residential" className={isActive('/residential')}>Residential</Link>
                    <Link to="/commercial" className={isActive('/commercial')}>Commercial</Link>
                    <Link to="/investment" className={isActive('/investment')}>Investment</Link>
                    
                    <div className="dropdown">
                        <Link to="/projects" className={`dropdown-toggle ${isActive('/projects')}`}>Projects</Link>
                        <div className="dropdown-menu">
                            <Link to="/projects/residential">Residential Projects</Link>
                            <Link to="/projects/commercial">Commercial Projects</Link>
                            <Link to="/projects/investment">Investment Projects</Link>
                        </div>
                    </div>
                    <Link to="/gallery" className={isActive('/gallery')}>Gallery</Link>
                    <Link to="/services" className={isActive('/services')}>Services</Link>
                    <Link to="/contact" className="btn btn-nav-contact">
                        <PhoneCall size={18} />
                        <span>Contact Us</span>
                    </Link>
                </nav>
                <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                </div>
            </div>
        </header>
        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}></div>}
        </>
    );
}

export default Header;
