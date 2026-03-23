import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer" id="contact">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="logo-container footer-logo">
                            <img src="/logo/logo.png" alt="TRX Emblem" className="logo-badge" />
                            {/* <div className="logo-text text-white">
                                <span className="trx">TRX</span> 
                                <span className="brand-name">The Realty Xperts</span>
                            </div> */}
                        </Link>
                        <p className="tagline">Where dreams meet addresses.</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/properties">Properties</Link></li>
                            <li><Link to="/services">Services</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h3>Contact Us</h3>
                        <ul className="contact-info">
                            <li><i className="fas fa-user text-gold"></i> Sameer Tiwari</li>
                            <li><i className="fas fa-phone-alt text-gold"></i> <a href="tel:9264175587">926-417-5587</a></li>
                            <li><i className="fas fa-envelope text-gold"></i> <a href="mailto:Emailtotre@gmail.com">Emailtotre@gmail.com</a></li>
                            <li><i className="fas fa-clock text-gold"></i> Est. 2016</li>
                            <li><Link to="/admin/login">admin</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 The Realty Xperts. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
