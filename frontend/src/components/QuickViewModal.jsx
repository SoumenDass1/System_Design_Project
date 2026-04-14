import React from 'react';
import { X, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../css/QuickViewModal.css';

const QuickViewModal = ({ product, onClose }) => {
    const { addToCart } = useCart();

    if (!product) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-grid">
                    <div className="modal-image">
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className="modal-info">
                        {product.badge && (
                            <span className={`badge badge-${product.badge} mb-2`}>
                                {product.badge}
                            </span>
                        )}

                        <h2>{product.name}</h2>

                        <div className="modal-rating">
                            <div className="stars">
                                {'★'.repeat(Math.floor(product.rating || 5))}
                                {'☆'.repeat(5 - Math.floor(product.rating || 5))}
                            </div>
                            <span className="text-muted">({product.rating || 5.0})</span>
                        </div>

                        <div className="modal-price">
                            <span className="current-price">${product.price}</span>
                            {product.originalPrice && (
                                <span className="original-price">${product.originalPrice}</span>
                            )}
                        </div>

                        <p className="modal-description">
                            Experience premium quality with our {product.name}.
                            Perfect for your daily needs and designed to last.
                        </p>

                        <div className="modal-actions">
                            <button
                                className="btn btn-primary w-full"
                                onClick={() => {
                                    addToCart(product);
                                    onClose();
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>

                        <div className="modal-features">
                            <div className="feature-item">
                                <Check size={16} className="text-green" />
                                <span>In Stock</span>
                            </div>
                            <div className="feature-item">
                                <Check size={16} className="text-green" />
                                <span>Free Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
