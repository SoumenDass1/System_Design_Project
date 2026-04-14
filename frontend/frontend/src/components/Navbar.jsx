import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Package, LogOut, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../css/Navbar.css';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const location = useLocation();
    const { cartCount } = useCart();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setAccountMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">TheBrand</Link>

                <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
                    <Link to="/" className={isActive('/') ? 'active' : ''}>
                        Home
                    </Link>
                    <Link to="/shop" className={isActive('/shop') ? 'active' : ''}>
                        Shop
                    </Link>
                    <Link to="/cart" className={isActive('/cart') ? 'active' : ''}>
                        <div className="cart-icon-wrapper">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </div>
                    </Link>

                    {/* Account Dropdown */}
                    <div className="account-dropdown">
                        <button
                            className="account-btn"
                            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                        >
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="nav-avatar" />
                            ) : (
                                <User size={20} />
                            )}
                        </button>

                        {accountMenuOpen && (
                            <div className="dropdown-menu">
                                {user ? (
                                    <>
                                        <div className="dropdown-header">
                                            <p className="user-name">{user.name || 'User'}</p>
                                            <p className="user-email">{user.email || 'user@example.com'}</p>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link
                                            to="/account/orders"
                                            className="dropdown-item"
                                            onClick={() => setAccountMenuOpen(false)}
                                        >
                                            <Package size={18} />
                                            <span>My Orders</span>
                                        </Link>
                                        <Link
                                            to="/account/settings"
                                            className="dropdown-item"
                                            onClick={() => setAccountMenuOpen(false)}
                                        >
                                            <Settings size={18} />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            className="dropdown-item logout"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="dropdown-item"
                                            onClick={() => setAccountMenuOpen(false)}
                                        >
                                            <User size={18} />
                                            <span>Login</span>
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="dropdown-item"
                                            onClick={() => setAccountMenuOpen(false)}
                                        >
                                            <User size={18} />
                                            <span>Sign Up</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    className="mobile-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop for dropdown */}
            {accountMenuOpen && (
                <div
                    className="dropdown-backdrop"
                    onClick={() => setAccountMenuOpen(false)}
                ></div>
            )}
        </nav>
    );
};

export default Navbar;
