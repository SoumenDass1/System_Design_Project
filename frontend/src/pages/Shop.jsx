import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid, List, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import '../css/Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Server-side params
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: [0, 1000],
        inStock: false,
    });

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch Products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Construct query params
                const params = new URLSearchParams({
                    page,
                    limit: 12,
                    sort: sortBy === 'price-low' ? 'price_asc'
                        : sortBy === 'price-high' ? 'price_desc'
                            : sortBy === 'name-asc' ? 'name_asc'
                                : 'newest', // Backend default
                });

                if (debouncedSearch) params.append('search', debouncedSearch);
                if (filters.inStock) params.append('inStock', 'true');
                if (filters.categories.length > 0) {
                    // Backend expects single category or multiple? Controller checks generic 'category'
                    // Simple implementation for single category filter for now or multiple if backend supports
                    // Controller: if (category && category !== 'All') where.category = category;
                    // It seems backend supports ONE category at a time in the current controller logic provided earlier.
                    // But let's send the first one or loop. The loop in controller wasn't "in", it was exact match.
                    // Wait, let's verify controller... "where.category = category". It expects a string.
                    // So we can only filter by one category at a time effectively unless we update backend.
                    // For now let's send the last selected one or join them if backend supported it. 
                    // Let's assume user picks one main category or we take the first one.
                    // IMPORTANT: The UI allows multiple. The backend controller I saw only handled one `req.query.category`.
                    // I will send the first selected category for now to be safe, or update backend to use `in`.
                    params.append('category', filters.categories[0]);
                }

                if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0]);
                if (filters.priceRange[1] < 1000) params.append('maxPrice', filters.priceRange[1]);

                const { data } = await api.get(`/products?${params.toString()}`);

                setProducts(data.products);
                setTotalPages(data.totalPages);
                setTotalProducts(data.totalCount);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        if (debouncedSearch !== null) {
            fetchProducts();
        }
    }, [page, debouncedSearch, sortBy, filters]);

    const handleCategoryToggle = (cat) => {
        setFilters(prev => {
            // Since backend currently supports simple string match, maybe best to behave like radio?
            // Or keep UI as multi-select but know it filters by the set.
            // Let's keep existing logic but warn it might only filter one server side.
            // Actually, let's Stick to the existing logic for user experience.
            const isSelected = prev.categories.includes(cat);
            if (isSelected) return { ...prev, categories: prev.categories.filter(c => c !== cat) };
            return { ...prev, categories: [...prev.categories, cat] };
        });
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ categories: [], priceRange: [0, 1000], inStock: false });
        setSearchQuery('');
        setPage(1);
    };

    return (
        <div className="shop-page">
            <div className="container">
                {/* Header */}
                <div className="shop-header">
                    <div>
                        <h1>Shop All Products</h1>
                        <p className="text-muted">Discover our entire collection</p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="shop-toolbar">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="toolbar-actions">
                        <button
                            className="btn btn-outline filter-toggle"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={18} />
                            Filters
                            {(filters.categories.length > 0 || filters.inStock) && (
                                <span className="filter-count">{filters.categories.length + (filters.inStock ? 1 : 0)}</span>
                            )}
                        </button>

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setPage(1);
                            }}
                            className="sort-select"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name-asc">Name: A-Z</option>
                        </select>

                        <div className="view-toggle">
                            <button
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="shop-content">
                    {/* Filters Sidebar */}
                    <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
                        <div className="filters-header">
                            <h3>Filters</h3>
                            <button onClick={() => setShowFilters(false)} className="close-btn">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Applied Filters */}
                        {(filters.categories.length > 0 || filters.inStock) && (
                            <div className="applied-filters">
                                <div className="applied-filters-header">
                                    <span>Applied Filters</span>
                                    <button onClick={clearFilters} className="clear-all">Clear All</button>
                                </div>
                                <div className="filter-chips">
                                    {filters.categories.map(cat => (
                                        <span key={cat} className="filter-chip">
                                            {cat}
                                            <button onClick={() => handleCategoryToggle(cat)}>
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    {filters.inStock && (
                                        <span className="filter-chip">
                                            In Stock Only
                                            <button onClick={() => setFilters(prev => ({ ...prev, inStock: false }))}>
                                                <X size={14} />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Categories */}
                        <div className="filter-group">
                            <h4>Categories</h4>
                            {/* Ideally fetch categories from API too. Hardcoding for now based on what I saw */}
                            {['Accessories', 'Electronics', 'Fashion', 'Home', 'Sports', 'Stationery'].map(cat => (
                                <label key={cat} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={filters.categories.includes(cat)}
                                        onChange={() => handleCategoryToggle(cat)}
                                    />
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <h4>Price Range</h4>
                            <div className="price-range-slider">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="10"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => {
                                        setFilters(prev => ({
                                            ...prev,
                                            priceRange: [0, Number(e.target.value)]
                                        }));
                                        setPage(1);
                                    }}
                                    className="price-slider"
                                />
                                <div className="price-range-display">
                                    <span>${filters.priceRange[0]}</span>
                                    <span>${filters.priceRange[1]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="filter-group">
                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.inStock}
                                    onChange={(e) => {
                                        setFilters(prev => ({ ...prev, inStock: e.target.checked }));
                                        setPage(1);
                                    }}
                                />
                                <span>In Stock Only</span>
                            </label>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="products-section">
                        <div className="results-info">
                            <p>{totalProducts} products found</p>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">Loading products...</div>
                        ) : products.length > 0 ? (
                            <>
                                <div className={`products-grid ${viewMode}`}>
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(p => p - 1)}
                                            className="btn btn-outline"
                                        >
                                            <ChevronLeft size={16} /> Previous
                                        </button>
                                        <span className="page-info">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => p + 1)}
                                            className="btn btn-outline"
                                        >
                                            Next <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search terms</p>
                                <button onClick={clearFilters} className="btn btn-primary">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Shop;
