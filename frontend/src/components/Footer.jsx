import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-col brand-col">
                        <Link to="/" className="footer-logo">TheBrand</Link>
                        <p className="footer-desc">
                            Your premier destination for luxury fashion, electronics, and lifestyle products.
                            Quality meets elegance in every item we curate.
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="footer-col">
                        <h3>Shop</h3>
                        <ul className="footer-links">
                            <li><Link to="/shop?category=New Arrivals">New Arrivals</Link></li>
                            <li><Link to="/shop?category=Best Sellers">Best Sellers</Link></li>
                            <li><Link to="/shop?category=Electronics">Electronics</Link></li>
                            <li><Link to="/shop?category=Fashion">Fashion</Link></li>
                            <li><Link to="/shop?category=Accessories">Accessories</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Customer Service</h3>
                        <ul className="footer-links">
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/shipping">Shipping & Returns</Link></li>
                            <li><Link to="/track-order">Track Order</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Contact</h3>
                        <ul className="contact-info">
                            <li>
                                <MapPin size={18} />
                                <span>123 Fashion Ave, NY 10001</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li>
                                <Mail size={18} />
                                <span>support@thebrand.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 TheBrand. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/terms">Terms</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/cookies">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
