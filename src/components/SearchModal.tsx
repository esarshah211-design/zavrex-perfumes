import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, products }) => {
  const { setSelectedProduct, setActiveView } = useCart();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          [...p.notes.top, ...p.notes.heart, ...p.notes.base].some((n) =>
            n.toLowerCase().includes(q)
          )
        );
      })
    : [];

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product-details');
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 pt-20 animate-fade-in">
      <div className="bg-[#121216] border border-[#25252B] max-w-2xl w-full p-6 text-left relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8B84] hover:text-[#F5F2EB] p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block mb-2">
          Discover ZAVREX Creations
        </span>

        {/* Input */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
          <input
            type="text"
            autoFocus
            placeholder="Search by scent (Oud, Musk, Taif Rose, Saffron, Amber)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0A0A0D] border border-[#2A2A35] text-sm text-[#F5F2EB] placeholder:text-[#5A5852] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="space-y-2">
            <span className="text-xs text-[#8E8B84]">Popular Searches:</span>
            <div className="flex flex-wrap gap-2">
              {['Cambodian Oud', 'White Musk', 'Taif Rose', 'Saffron', 'Ambergris', 'Pure Oil'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 bg-[#181820] hover:bg-[#252530] text-xs text-[#C8C5BD] border border-[#222228] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <span className="text-xs text-[#8E8B84] block mb-2">
              Found {results.length} fragrances matching "{query}":
            </span>
            {results.length === 0 ? (
              <p className="text-xs text-[#7A7873] py-8 text-center">
                No matching fragrances found. Try searching for "Oud" or "Rose".
              </p>
            ) : (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="p-3 bg-[#0E0E12] border border-[#202026] hover:border-[#D4AF37]/50 flex items-center justify-between cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover border border-[#25252B]"
                    />
                    <div>
                      <h4 className="font-serif text-sm text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#8E8B84]">{product.category} · From ₨ {product.prices['6ml']?.toLocaleString()}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#7A7873] group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
