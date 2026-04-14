import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import QuickViewModal from './QuickViewModal';
import '../css/ProductCard.css';

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const openQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickView(true);
    };

    return (
        <>
            <article className="product-card group">
                <div className="product-image-wrapper">
                    {product.badge && (
                        <span className={`product-badge badge-${product.badge}`}>
                            {product.badge}
                        </span>
                    )}
                    <div className="product-actions">
                        <button
                            className={`action-btn ${isWishlisted ? 'active' : ''}`}
                            aria-label="Add to wishlist"
                            onClick={toggleWishlist}
                        >
                            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                        <button
                            className="action-btn"
                            aria-label="Quick view"
                            onClick={openQuickView}
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                    <div className="product-image-container">
                        <img src={product.image} alt={product.name} loading="lazy" />
                    </div>
                </div>

                <div className="product-info">
                    <h3>{product.name}</h3>

                    {product.rating && (
                        <div className="product-rating">
                            <span className="stars">★★★★★</span>
                            <span className="rating-value">({product.rating})</span>
                        </div>
                    )}

                    <div className="product-price">
                        <span className="price">${product.price}</span>
                        {product.originalPrice && (
                            <span className="original-price">${product.originalPrice}</span>
                        )}
                    </div>

                    <Link to={`/product/${product.id}`} className="btn btn-primary w-full">
                        View Details
                    </Link>
                </div>
            </article>

            {showQuickView && (
                <QuickViewModal
                    product={product}
                    onClose={() => setShowQuickView(false)}
                />
            )}
        </>
    );
};

export default ProductCard;
