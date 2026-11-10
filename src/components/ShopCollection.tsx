import React, { useState, useMemo } from 'react';
import { Product, FragranceCategory } from '../types';
import { ProductCard } from './ProductCard';
import { ProductDetailsModal } from './ProductDetailsModal';
import { Search, SlidersHorizontal, Sparkles, Filter } from 'lucide-react';

interface ShopCollectionProps {
  products: Product[];
  initialCategory?: string;
}

export const ShopCollection: React.FC<ShopCollectionProps> = ({
  products,
  initialCategory = 'All',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categories = [
    'All',
    "Men's Collection",
    "Women's Collection",
    'Unisex Collection',
    'Arabian Oud',
    'Musk Collection',
    'Signature Collection',
  ];

  // Filtering and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category check
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(query);
          const matchTagline = p.tagline?.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchNotes = [
            ...p.notes.top,
            ...p.notes.heart,
            ...p.notes.base,
          ].some((n) => n.toLowerCase().includes(query));
          return matchName || matchTagline || matchDesc || matchNotes;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.prices['12ml'] || a.prices['6ml'];
        const priceB = b.prices['12ml'] || b.prices['6ml'];

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        // Featured default
        if (a.isSignature && !b.isSignature) return -1;
        if (!a.isSignature && b.isSignature) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="shop-section" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title & Kicker */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-2">
          <span>The Atelier Archives</span>
          <span aria-hidden="true">·</span>
          <span>100% Non-Alcoholic Attars</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F5F2EB] mb-4">
          The Fragrance Collection
        </h2>
        <p className="text-xs sm:text-sm text-[#8E8B84] font-light max-w-xl mx-auto">
          Distilled from rare botanical absolutes, Assamese agarwood, Taif roses, and royal ambergris. Available in 6ml, 12ml, and 30ml flacons.
        </p>
      </div>

      {/* Category Filter Buttons (Interactive Filter Controls conforming to frontend-design) */}
      <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider whitespace-nowrap shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-[#D4AF37] text-black font-semibold shadow-md'
                : 'bg-[#141418] text-[#8E8B84] hover:text-[#F5F2EB] hover:bg-[#1C1C24] border border-[#25252B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#121216] border border-[#202026] mb-10">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7873]" />
          <input
            type="text"
            placeholder="Search by notes (e.g. Saffron, Oud, Rose)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0E0E12] border border-[#25252B] text-xs text-[#F5F2EB] placeholder:text-[#5A5852] focus:outline-none focus:border-[#D4AF37]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A7873] hover:text-[#F5F2EB]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Counter and Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto text-xs">
          <span className="text-[#8E8B84]">
            Showing <strong className="text-[#F5F2EB]">{filteredProducts.length}</strong> creations
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0E0E12] border border-[#25252B] px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="featured">Curated &amp; Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid (3-column desktop / 2-column tablet) */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-[#121216] border border-[#202026] p-8">
          <Sparkles className="w-10 h-10 text-[#444] mx-auto mb-3" />
          <h3 className="font-serif text-2xl text-[#F5F2EB] mb-2">No Fragrances Found</h3>
          <p className="text-xs text-[#8E8B84] mb-4">
            Try adjusting your search criteria or explore another collection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductDetailsModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
};
