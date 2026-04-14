import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, Minus, Plus, Heart, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import '../css/ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch product from API
    useEffect(() => {
        setQuantity(1);
        setActiveImage(0);
        setActiveTab('description');
        setSelectedSize('M');
        window.scrollTo(0, 0);

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);

                // Fetch related products by category
                const relRes = await api.get(`/products?category=${data.category}&limit=5`);
                setRelatedProducts(
                    (relRes.data.products || []).filter(p => p.id !== data.id).slice(0, 4)
                );
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="product-details-page">
                <div className="container text-center section-padding">
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-details-page">
                <div className="container text-center section-padding">
                    <h2>Product not found</h2>
                    <Link to="/shop" className="btn btn-primary mt-4">Back to Shop</Link>
                </div>
            </div>
        );
    }

    // Normalize image array (API products may not have images[])
    const images = product.images?.length ? product.images : [product.image];
    const rating = product.rating || 4.5;
    const reviews = product.reviews || product.ratingsTotal || 0;
    const sizes = product.sizes || ['S', 'M', 'L', 'XL'];
    const sku = product.sku || `SKU-${product.id}`;

    const handleAddToCart = () => {
        addToCart({ ...product, size: selectedSize, images }, quantity);
    };

    return (
        <div className="product-details-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/shop">Shop</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>

                {/* Main Product Section */}
                <div className="product-main">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img src={images[activeImage]} alt={product.name} />
                        </div>
                        <div className="thumbnail-list">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImage(idx)}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-section">
                        <h1>{product.name}</h1>

                        <div className="product-meta">
                            <div className="rating">
                                <div className="stars">
                                    {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
                                </div>
                                <span className="rating-text">
                                    {rating.toFixed(1)} {reviews > 0 ? `(${reviews} reviews)` : ''}
                                </span>
                            </div>
                            <span className="divider">|</span>
                            <span className="stock-status in-stock">
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <span className="divider">|</span>
                            <span className="sku">SKU: {sku}</span>
                        </div>

                        <div className="price-section">
                            <div className="prices">
                                <span className="current-price">₹{product.price}</span>
                                {product.originalPrice && (
                                    <>
                                        <span className="original-price">₹{product.originalPrice}</span>
                                        <span className="savings">Save ₹{product.originalPrice - product.price}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <p className="product-description">{product.description}</p>

                        {/* Size Selector */}
                        <div className="option-group">
                            <label>Size</label>
                            <div className="size-options">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="option-group">
                            <label>Quantity</label>
                            <div className="quantity-selector">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="quantity-btn"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="quantity">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="quantity-btn"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <span className="stock-info">{product.stock} items available</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button onClick={handleAddToCart} className="btn btn-primary btn-lg add-to-cart">
                                Add to Cart
                            </button>
                            <button className="btn btn-outline icon-btn">
                                <Heart size={20} />
                            </button>
                            <button className="btn btn-outline icon-btn">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="product-features">
                            <div className="feature">
                                <Truck size={20} />
                                <div>
                                    <strong>Free Delivery</strong>
                                    <p>On orders over ₹499</p>
                                </div>
                            </div>
                            <div className="feature">
                                <Shield size={20} />
                                <div>
                                    <strong>Genuine Product</strong>
                                    <p>Sourced from Amazon.in</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="product-tabs">
                    <div className="tabs-header">
                        {['description', 'specifications', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="tab-panel">
                                <h3>Product Description</h3>
                                <p>{product.description}</p>
                                <p>This premium product is designed with attention to every detail, ensuring both style and functionality.</p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="tab-panel">
                                <h3>Specifications</h3>
                                <table className="specs-table">
                                    <tbody>
                                        <tr><td>SKU</td><td>{sku}</td></tr>
                                        <tr><td>Stock</td><td>{product.stock} units</td></tr>
                                        <tr><td>Category</td><td>{product.category}</td></tr>
                                        <tr><td>Gender</td><td>{product.gender || 'Unisex'}</td></tr>
                                        <tr><td>Rating</td><td>{rating}/5.0</td></tr>
                                        <tr><td>Warranty</td><td>1 Year</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="tab-panel">
                                <h3>Customer Reviews</h3>
                                <p className="text-muted">No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="related-products">
                        <h2>You May Also Like</h2>
                        <div className="products-grid">
                            {relatedProducts.map((prod) => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
