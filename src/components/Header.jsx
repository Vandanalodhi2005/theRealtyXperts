import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PhoneCall } from 'lucide-react';

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => {
        return location.pathname === path ? 'active-link' : '';
    };

    return (
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo-container">
                    <img src="/logo/logo.png" alt="TRX Emblem" className="logo-badge" />
                    <div className="logo-text">
                        <span className="trx">TRX</span> 
                        <span className="brand-name">The Realty Xperts</span>
                    </div>
                </Link>
                <nav className="nav-links">
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/about" className={isActive('/about')}>About Us</Link>
                    <Link to="/residential" className={isActive('/residential')}>Residential</Link>
                    <Link to="/commercial" className={isActive('/commercial')}>Commercial</Link>
                    <Link to="/investment" className={isActive('/investment')}>Investment</Link>
                    <Link to="/projects" className={isActive('/projects')}>Projects</Link>
                    <Link to="/services" className={isActive('/services')}>Services</Link>
                    <Link to="/contact" className="btn btn-nav-contact">
                        <PhoneCall size={18} />
                        <span>Contact Us</span>
                    </Link>
                </nav>
                <div className="mobile-menu-toggle">
                    <i className="fas fa-bars"></i>
                </div>
            </div>
        </header>
    );
}

export default Header;
