import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import '../css/Home.css';

import { products } from '../data/products';

const heroSlides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1950&q=80',
        badge: 'New Arrivals 2025',
        title: "Discover Products You'll Love",
        subtitle: "Shop the latest trends in electronics, fashion, and accessories. Quality products, unbeatable prices.",
        cta: "Shop Now"
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1950&q=80',
        badge: 'Fashion Week',
        title: "Elevate Your Style Game",
        subtitle: "Explore our curated collection of premium clothing and accessories for the modern individual.",
        cta: "View Collection"
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1950&q=80',
        badge: 'Limited Edition',
        title: "Exclusive Designer Pieces",
        subtitle: "Stand out from the crowd with our unique, limited-time designer collaborations.",
        cta: "Shop Exclusive"
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1950&q=80',
        badge: 'Winter Collection',
        title: "Cozy & Chic Essentials",
        subtitle: "Stay warm in style with our premium winter wear collection.",
        cta: "Shop Winter"
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1950&q=80',
        badge: 'Travel Gear',
        title: "Adventure Awaits",
        subtitle: "Durable and stylish travel accessories for your next journey.",
        cta: "Explore Gear"
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1950&q=80',
        badge: 'Tech Deals',
        title: "Smart Living",
        subtitle: "Upgrade your lifestyle with the latest smart home gadgets.",
        cta: "Shop Tech"
    }
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [email, setEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle, success, error

    // Auto-change background every 5 seconds
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setNewsletterStatus('error');
            return;
        }
        // Simulate API call
        setTimeout(() => {
            setNewsletterStatus('success');
            setEmail('');
        }, 1000);
    };

    const featuredProducts = products.slice(0, 8);

    const categories = [
        { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80', count: '120+ Products' },
        { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80', count: '85+ Products' },
        { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80', count: '200+ Products' },
    ];

    return (
        <div className="home-page">
            {/* Hero Section with Carousel */}
            <section
                className="hero"
                style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content fade-in-up" key={currentSlide}>
                        <span className="badge badge-new mb-4">{heroSlides[currentSlide].badge}</span>
                        <h1 className="hero-title">
                            {heroSlides[currentSlide].title}
                        </h1>
                        <p className="hero-subtitle">
                            {heroSlides[currentSlide].subtitle}
                        </p>
                        <div className="hero-actions">
                            <Link to="/shop" className="btn btn-primary btn-lg">
                                {heroSlides[currentSlide].cta} <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Slider Controls */}
                <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous slide">
                    <ChevronLeft size={32} />
                </button>
                <button className="slider-arrow next" onClick={nextSlide} aria-label="Next slide">
                    <ChevronRight size={32} />
                </button>

                {/* Slider Indicators */}
                <div className="slider-indicators">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${currentSlide === index ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Trust Badges */}
            <section className="trust-section">
                <div className="container">
                    <div className="trust-grid grid grid-3">
                        <div className="trust-item">
                            <div className="trust-icon">
                                <Truck size={28} />
                            </div>
                            <h4>Free Shipping</h4>
                            <p className="text-muted">On orders over $50</p>
                        </div>
                        <div className="trust-item">
                            <RefreshCw size={28} />
                            <h4>Easy Returns</h4>
                            <p className="text-muted">30-day money back</p>
                        </div>
                        <div className="trust-item">
                            <ShieldCheck size={28} />
                            <h4>Secure Payment</h4>
                            <p className="text-muted">100% protected</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Products Grid */}
            <section className="section-padding">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="mb-2">Trending Products</h2>
                            <p className="text-muted">Handpicked items just for you</p>
                        </div>
                        <Link to="/shop" className="btn btn-outline">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-4 product-grid">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section-padding" style={{ background: 'var(--gray-50)' }}>
                <div className="container">
                    <div className="section-header text-center mb-12">
                        <h2 className="mb-2">Shop by Category</h2>
                        <p className="text-muted">Explore our wide range of collections</p>
                    </div>

                    <div className="grid grid-3">
                        {categories.map((cat) => (
                            <Link key={cat.name} to={`/shop?category=${cat.name}`} className="category-card">
                                <img src={cat.image} alt={cat.name} />
                                <div className="category-overlay">
                                    <h3>{cat.name}</h3>
                                    <p>{cat.count}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="newsletter-section">
                <div className="container">
                    <div className="newsletter-card">
                        <div className="newsletter-content">
                            <h2 className="mb-4">Stay in the Loop</h2>
                            <p className="mb-8 text-muted">Subscribe for exclusive offers and updates</p>

                            {newsletterStatus === 'success' ? (
                                <div className="newsletter-success">
                                    <Check size={24} />
                                    <p>Thanks for subscribing!</p>
                                </div>
                            ) : (
                                <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className={`form-input ${newsletterStatus === 'error' ? 'error' : ''}`}
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setNewsletterStatus('idle');
                                            }}
                                        />
                                        {newsletterStatus === 'error' && (
                                            <span className="error-text">Please enter a valid email</span>
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Subscribe
                                    </button>
                                </form>
                            )}

                            <p className="newsletter-privacy">
                                We respect your privacy. Unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
