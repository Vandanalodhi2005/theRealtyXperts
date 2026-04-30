import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PhoneCall, Search, X } from 'lucide-react';

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Redirect to a global search or properties page with query
            window.location.href = `/properties?search=${encodeURIComponent(searchTerm.trim())}`;
        }
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
                    <Link to="/projects" className={isActive('/projects')}>Projects</Link>
                    <Link to="/gallery" className={isActive('/gallery')}>Gallery</Link>
                    <Link to="/services" className={isActive('/services')}>Services</Link>

                    <Link to="/contact" className="btn btn-nav-contact">
                        <PhoneCall size={18} />
                        <span>Contact Us</span>
                    </Link>
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        className="nav-search-trigger" 
                        onClick={() => setIsSearchOpen(true)}
                        aria-label="Search"
                    >
                        <Search size={22} />
                    </button>

                    <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                    </div>
                </div>
            </div>

            {/* Professional Search Overlay */}
            <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
                <div className="container search-overlay-content">
                    <form onSubmit={handleSearchSubmit} className="search-overlay-form">
                        <Search className="search-icon" size={24} />
                        <input 
                            type="text" 
                            placeholder="Search properties, projects, or locations..." 
                            className="search-overlay-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus={isSearchOpen}
                        />
                        <button type="button" className="search-close-btn" onClick={() => setIsSearchOpen(false)}>
                            <X size={24} />
                        </button>
                    </form>
                </div>
            </div>
        </header>
        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}></div>}
        </>
    );
}

export default Header;
