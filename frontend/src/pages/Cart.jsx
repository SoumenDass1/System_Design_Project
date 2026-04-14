import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../css/Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const tax = cartTotal * 0.1;
    const shipping = cartTotal > 100 ? 0 : 15;
    const total = cartTotal + tax + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-icon">
                            <ShoppingBag size={64} />
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/shop" className="btn btn-primary btn-lg">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p className="text-muted">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>

                                <div className="item-details">
                                    <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                                    {item.size && (
                                        <p className="item-variant">Size: {item.size}</p>
                                    )}
                                    <p className="item-price-mobile">${item.price}</p>
                                </div>

                                <div className="item-price">
                                    ${item.price}
                                </div>

                                <div className="item-quantity">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="quantity-btn"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="quantity-btn"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="item-total">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="item-remove"
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>Order Summary</h3>

                        <div className="summary-line">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <div className="summary-line">
                            <span>Tax (10%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>

                        <div className="summary-line">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                        </div>

                        {cartTotal < 100 && (
                            <div className="shipping-notice">
                                <Tag size={16} />
                                <span>Add ${(100 - cartTotal).toFixed(2)} more for free shipping!</span>
                            </div>
                        )}

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <Link to="/checkout" className="btn btn-primary w-full checkout-btn">
                            Proceed to Checkout <ArrowRight size={20} />
                        </Link>

                        <Link to="/shop" className="continue-shopping">
                            Continue Shopping
                        </Link>

                        <div className="trust-badges">
                            <div className="badge-item">
                                <span>✓</span> Secure Checkout
                            </div>
                            <div className="badge-item">
                                <span>✓</span> Free Returns
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
