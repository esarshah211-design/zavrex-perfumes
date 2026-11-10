import React, { useState } from 'react';
import { Product, FragranceSize } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye, Heart, MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/storage';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, wishlist, toggleWishlist, settings, setSelectedProduct, setActiveView } = useCart();
  const [selectedSize, setSelectedSize] = useState<FragranceSize>('12ml');
  const [imageError, setImageError] = useState(false);

  const currentPrice = product.prices[selectedSize] || product.prices['12ml'] || product.prices['6ml'];
  const originalPrice = product.originalPrices?.[selectedSize];
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
  };

  const handleCardClick = () => {
    setSelectedProduct(product);
    setActiveView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Salam ZAVREX, I want to order:\n\n*Product:* ${product.name}\n*Size:* ${selectedSize}\n*Price:* PKR ${currentPrice.toLocaleString()}\n\nPlease confirm availability and delivery details to my address.`;
    window.open(generateWhatsAppLink(settings.whatsappNumber, message), '_blank');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#121215] border border-[#25252B] hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Top badges bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1">
          {product.isSignature && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#0B0B0C]/80 px-2 py-0.5 border border-[#D4AF37]/30 backdrop-blur-sm">
              Signature
            </span>
          )}
          {product.isBestSeller && !product.isSignature && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F2EB] bg-[#0B0B0C]/80 px-2 py-0.5 border border-[#444] backdrop-blur-sm">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E5C378] bg-[#0B0B0C]/80 px-2 py-0.5 border border-[#D4AF37]/30 backdrop-blur-sm">
              New
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`pointer-events-auto p-2 rounded-full bg-[#0B0B0C]/70 backdrop-blur-sm border border-[#2A2A30] transition-colors ${
            isWishlisted ? 'text-[#D4AF37]' : 'text-[#8E8B84] hover:text-[#F5F2EB]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D4AF37]' : ''}`} />
        </button>
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-[#0E0E10] overflow-hidden">
        {!imageError && product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#15151A]">
            <span className="font-serif text-2xl text-[#D4AF37] mb-2">ZAVREX</span>
            <span className="text-xs text-[#8E8B84]">{product.name}</span>
          </div>
        )}

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-0 bg-[#0B0B0C]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3.5 py-2 bg-[#0B0B0C]/90 hover:bg-[#0B0B0C] text-[#F5F2EB] text-xs uppercase tracking-wider font-semibold border border-[#D4AF37]/40 flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleWhatsAppOrder}
            title="Order via WhatsApp"
            className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-black rounded transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Product Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Origin Unboxed Metadata */}
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#D4AF37] mb-1 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#8E8B84]">Pure Oil</span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors leading-tight mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* Fragrance Tagline */}
          <p className="text-xs text-[#9E9B95] line-clamp-2 leading-relaxed mb-4">
            {product.tagline || product.description}
          </p>

          {/* Key Fragrance Notes Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.notes.top.slice(0, 2).concat(product.notes.heart.slice(0, 1)).map((note, i) => (
              <span
                key={i}
                className="text-[10px] text-[#C8C5BD] bg-[#1A1A20] px-2 py-0.5 border border-[#2A2A32]"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        <div>
          {/* Size Selector Segmented Controls */}
          <div className="flex items-center justify-between gap-1 mb-4 p-1 bg-[#0E0E12] border border-[#222228]">
            {(['6ml', '12ml', '30ml'] as FragranceSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`flex-1 py-1 text-[11px] font-medium tracking-wider transition-colors ${
                  selectedSize === size
                    ? 'bg-[#D4AF37] text-black font-semibold shadow-sm'
                    : 'text-[#8E8B84] hover:text-[#F5F2EB]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Price & Purchase Action Row */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1F1F24]">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#7A7873]">Price ({selectedSize})</span>
              <div className="flex items-baseline gap-2">
                <span className="font-sans font-bold text-lg sm:text-xl text-[#F5F2EB] tabular-nums">
                  ₨ {currentPrice.toLocaleString()}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-xs text-[#7A7873] line-through tabular-nums">
                    ₨ {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-3.5 py-2.5 bg-[#1F1F26] hover:bg-[#D4AF37] text-[#F5F2EB] hover:text-[#0B0B0C] border border-[#33333C] hover:border-[#D4AF37] font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
