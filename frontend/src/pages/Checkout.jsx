import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Edit2, Check, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import '../css/Checkout.css';

const Checkout = () => {
    const { cartItems, cartTotal, placeOrder } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        addressLine1: user?.addressLine1 || '',
        addressLine2: user?.addressLine2 || '',
        city: user?.city || '',
        zipCode: user?.zip || '',
    });

    // Redirect if cart is empty
    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <div className="container text-center section-padding">
                    <h2>Your cart is empty</h2>
                    <button onClick={() => navigate('/shop')} className="btn btn-primary mt-4">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [orderSuccess, setOrderSuccess] = useState(false);

    const handlePlaceOrder = async () => {
        if (!formData.addressLine1 || !formData.phone || !formData.city || !formData.zipCode) {
            toast.error('Please fill in all delivery details');
            setIsEditing(true);
            return;
        }

        // Call API
        const loadingToast = toast.loading('Processing your order...');

        try {
            await placeOrder(formData);
            toast.dismiss(loadingToast);
            setOrderSuccess(true);

            // Wait for animation before redirecting
            setTimeout(() => {
                navigate('/account/orders');
            }, 2000);
        } catch (error) {
            toast.dismiss(loadingToast);
            // Error handled in context
        }
    };

    const shipping = 0; // Free shipping logic can be added here
    const tax = cartTotal * 0.1; // 10% tax
    const total = cartTotal + shipping + tax;

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                {/* Left Column - User Details */}
                <div className="checkout-details">
                    <div className="checkout-section">
                        <div className="section-title">
                            <h3>Delivery Information</h3>
                            <button
                                className="edit-btn"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
                                {isEditing ? 'Save' : 'Edit'}
                            </button>
                        </div>

                        <form className="form-grid">
                            <div className="form-group full-width">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={true} // Email usually shouldn't change during checkout
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Address Line 1</label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                    placeholder="Street address, P.O. box, etc."
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Address Line 2 (Optional)</label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                    placeholder="Apartment, suite, unit, etc."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                    placeholder="City"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">ZIP Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                    placeholder="ZIP Code"
                                />
                            </div>
                        </form>
                    </div>

                    <div className="checkout-section">
                        <div className="section-title">
                            <h3>Payment Method</h3>
                            <Lock size={16} className="text-muted" />
                        </div>
                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                            <p className="text-sm text-gray-600">
                                Cash on Delivery (COD) is currently the only available payment method.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="order-summary">
                    <div className="checkout-section">
                        <div className="section-title">
                            <h3>Order Summary</h3>
                        </div>

                        <div className="summary-items">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="summary-item">
                                    <img src={item.image} alt={item.name} className="item-image" />
                                    <div className="item-details">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-meta">Size: {item.size} | Qty: {item.quantity}</p>
                                    </div>
                                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="total-row">
                                <span>Tax (10%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="total-row final">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            className="place-order-btn"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
            {orderSuccess && (
                <div className="order-success-overlay">
                    <div className="success-content">
                        <div className="checkmark-circle">
                            <div className="background"></div>
                            <div className="checkmark draw"></div>
                        </div>
                        <h2>Order Placed!</h2>
                        <p>Thank you for your purchase.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
