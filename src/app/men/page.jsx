'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import Breadcrumb from '@/components/shared/Breadcrumb';
import FilterBar from '@/components/shared/FilterBar';
import ProductCard from '@/components/shared/ProductCard';
import { categories, sizes, colorOptions, sortOptions } from '@/data/menProducts';
import productsData from '@/data/menProducts';

export default function MenPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Shoes');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Filter + Sort Logic
  const filteredProducts = useMemo(() => {
    let results = productsData.filter((item) => {
      // Category Filter
      const matchCategory = selectedCategory === 'All Shoes' || item.category === selectedCategory;

      // Size Filter
      const matchSize = selectedSize ? item.sizes.includes(selectedSize) : true;

      // Color Filter
      const matchColor = selectedColor ? item.colorName === selectedColor : true;

      // Search Filter (name, type or category)
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = query
        ? item.name.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        : true;

      return matchCategory && matchSize && matchColor && matchSearch;
    });

    // Sort Logic
    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
        break;
      default:
        break;
    }

    return results;
  }, [selectedCategory, selectedSize, selectedColor, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8">
        <Breadcrumb title="MEN" section="Men" />

        <FilterBar
          categories={categories}
          sizes={sizes}
          colorOptions={colorOptions}
          sortOptions={sortOptions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />

        {/* Results Count */}
        <div className="mb-4 md:mb-6">
          <p className="text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Product Grid */}          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} section="men" />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No products found</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search query</p>
                <button
                  className="mt-4 text-xs px-4 py-2 rounded-full"
                  style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
                  onClick={() => {
                    setSelectedCategory('All Shoes');
                    setSelectedSize(null);
                    setSelectedColor(null);
                    setSearchQuery('');
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}