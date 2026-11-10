import React from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

interface WishlistViewProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ products, onQuickView }) => {
  const { wishlist, setActiveView } = useCart();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#0B0B0C] text-[#F5F2EB]">
      {/* Back button */}
      <button
        onClick={() => setActiveView('shop')}
        className="text-xs uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1.5 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Collections</span>
      </button>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-2">
          <span>Curated Favorites</span>
          <span aria-hidden="true">·</span>
          <span>Personal Vault</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#F5F2EB]">
          Your Saved Fragrances ({savedProducts.length})
        </h1>
      </div>

      {savedProducts.length === 0 ? (
        <div className="py-20 text-center bg-[#121216] border border-[#202026] p-8 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-[#333] mx-auto mb-4" />
          <h3 className="font-serif text-2xl text-[#F5F2EB] mb-2">Your Wishlist is Empty</h3>
          <p className="text-xs text-[#8E8B84] mb-6">
            Click the heart icon on any attar card to save it for later review or custom blending.
          </p>
          <button
            onClick={() => setActiveView('shop')}
            className="px-6 py-3 bg-[#D4AF37] text-black text-xs uppercase font-semibold tracking-wider hover:bg-[#E5C378] transition-colors"
          >
            Explore Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {savedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </div>
  );
};
