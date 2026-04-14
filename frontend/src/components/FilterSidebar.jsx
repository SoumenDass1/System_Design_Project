import React from 'react';

const FilterSidebar = ({ filters, setFilters, categories }) => {
    const handleCategoryChange = (category) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter((c) => c !== category)
            : [...filters.categories, category];
        setFilters({ ...filters, categories: newCategories });
    };

    const handlePriceChange = (e) => {
        setFilters({ ...filters, maxPrice: Number(e.target.value) });
    };

    return (
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(cat)}
                                onChange={() => handleCategoryChange(cat)}
                                className="form-checkbox rounded text-primary focus:ring-primary"
                            />
                            <span className="text-gray-700">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-bold text-lg mb-4">Price Range</h3>
                <div className="space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={filters.maxPrice}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>$0</span>
                        <span>${filters.maxPrice}</span>
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div>
                <h3 className="font-bold text-lg mb-4">Availability</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                        className="form-checkbox rounded text-primary"
                    />
                    <span>In Stock Only</span>
                </label>
            </div>

            <button
                onClick={() => setFilters({ categories: [], maxPrice: 1000, inStock: false })}
                className="btn btn-outline w-full"
            >
                Clear Filters
            </button>
        </aside>
    );
};

export default FilterSidebar;
