import React, { useState } from 'react';
import { Product, FragranceSize } from '../types';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Zap, MessageCircle, Heart, Check, Clock, Droplets, Wind, Shield } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/storage';

interface ProductDetailsModalProps {
  product: Product;
  onClose?: () => void;
  isFullPage?: boolean;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  isFullPage = false,
}) => {
  const { addToCart, wishlist, toggleWishlist, settings, setIsCartOpen, setActiveView } = useCart();
  const [selectedSize, setSelectedSize] = useState<FragranceSize>('12ml');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const price = product.prices[selectedSize] || 0;
  const originalPrice = product.originalPrices?.[selectedSize];
  const stock = product.stock[selectedSize] ?? 10;
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    setIsCartOpen(false);
    setActiveView('checkout');
    if (onClose) onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppOrder = () => {
    const text = `Salam ZAVREX, I am interested in ordering:\n\n*Product:* ${product.name}\n*Size:* ${selectedSize}\n*Quantity:* ${quantity}\n*Price:* PKR ${(price * quantity).toLocaleString()}\n\nPlease advise on delivery to my city and payment options.`;
    window.open(generateWhatsAppLink(settings.whatsappNumber, text), '_blank');
  };

  const content = (
    <div className="bg-[#0F0F12] text-[#F5F2EB] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12 relative max-w-6xl w-full mx-auto border border-[#25252B]">
      {/* Close button if rendered in modal mode */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-20 p-2 text-[#8E8B84] hover:text-[#F5F2EB] bg-[#0B0B0C]/80 rounded-full border border-[#2A2A30] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Left Column: Image Showcase Gallery */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-[#0E0E10] border border-[#25252B] overflow-hidden">
          <img
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-500"
          />
          {product.isSignature && (
            <span className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#0B0B0C]/90 px-3 py-1 border border-[#D4AF37]/30">
              Signature Collection
            </span>
          )}
        </div>

        {/* Thumbnail Selector */}
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-20 shrink-0 border overflow-hidden transition-all ${
                  activeImageIndex === idx
                    ? 'border-[#D4AF37] opacity-100 ring-1 ring-[#D4AF37]'
                    : 'border-[#25252B] opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Olfactory Specs Mini Matrix */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-[#141418] border border-[#202026] text-center mt-2">
          <div className="flex flex-col items-center">
            <Droplets className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="text-[10px] uppercase tracking-wider text-[#8E8B84]">Type</span>
            <span className="text-xs font-medium text-[#F5F2EB]">Pure Attar</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="text-[10px] uppercase tracking-wider text-[#8E8B84]">Longevity</span>
            <span className="text-xs font-medium text-[#F5F2EB]">{product.longevity.split(' ')[0]}</span>
          </div>
          <div className="flex flex-col items-center">
            <Wind className="w-4 h-4 text-[#D4AF37] mb-1" />
            <span className="text-[10px] uppercase tracking-wider text-[#8E8B84]">Projection</span>
            <span className="text-xs font-medium text-[#F5F2EB]">Royal / Heavy</span>
          </div>
        </div>
      </div>

      {/* Right Column: Contiguous Purchase Module */}
      <div className="lg:col-span-6 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-medium">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.origin || 'Peshawar, Pakistan'}</span>
            </div>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-full border border-[#25252B] transition-colors ${
                isWishlisted ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#8E8B84] hover:text-[#F5F2EB]'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D4AF37]' : ''}`} />
            </button>
          </div>

          {/* Product Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5F2EB] leading-tight mb-3">
            {product.name}
          </h1>

          {/* Tagline */}
          <p className="text-sm text-[#D4AF37] font-light tracking-wide mb-6">
            {product.tagline}
          </p>

          {/* Dynamic Price Display */}
          <div className="flex items-baseline gap-4 pb-6 border-b border-[#202026] mb-6">
            <span className="font-sans font-bold text-3xl sm:text-4xl text-[#F5F2EB] tabular-nums">
              ₨ {price.toLocaleString()}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-base text-[#7A7873] line-through tabular-nums">
                ₨ {originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-[#8E8B84] uppercase tracking-wider font-medium">
              PKR · Includes Tax
            </span>
          </div>

          {/* Detailed Description */}
          <div className="space-y-4 mb-8">
            <p className="text-sm text-[#C8C5BD] leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Olfactory Pyramid (Top, Heart, Base Notes) */}
          <div className="p-4 bg-[#141418] border border-[#25252B] mb-8 space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center justify-between">
              <span>Fragrance Notes Pyramid</span>
              <span className="text-[10px] text-[#8E8B84] font-normal">Authentic Extraction</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="w-20 font-semibold text-[#F5F2EB] uppercase tracking-wider text-[11px] shrink-0">
                  Top Notes:
                </span>
                <span className="text-[#9E9B95]">{product.notes.top.join(' · ')}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="w-20 font-semibold text-[#F5F2EB] uppercase tracking-wider text-[11px] shrink-0">
                  Heart Notes:
                </span>
                <span className="text-[#9E9B95]">{product.notes.heart.join(' · ')}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="w-20 font-semibold text-[#F5F2EB] uppercase tracking-wider text-[11px] shrink-0">
                  Base Notes:
                </span>
                <span className="text-[#9E9B95]">{product.notes.base.join(' · ')}</span>
              </div>
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#F5F2EB]">
                Select Bottle Volume:
              </label>
              <span className="text-xs text-[#D4AF37]">
                {stock > 0 ? `${stock} in stock` : 'Out of stock'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['6ml', '12ml', '30ml'] as FragranceSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-4 border text-center transition-all ${
                    selectedSize === size
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#F5F2EB] ring-1 ring-[#D4AF37]'
                      : 'border-[#25252B] bg-[#141418] text-[#8E8B84] hover:text-[#F5F2EB] hover:border-[#3A3A45]'
                  }`}
                >
                  <div className="font-semibold text-sm">{size}</div>
                  <div className="text-[11px] text-[#D4AF37] mt-0.5 tabular-nums">
                    ₨ {product.prices[size]?.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-8">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#F5F2EB]">
              Quantity:
            </label>
            <div className="flex items-center border border-[#25252B] bg-[#141418]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-lg text-[#8E8B84] hover:text-[#F5F2EB]"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center text-lg text-[#8E8B84] hover:text-[#F5F2EB]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Purchase Action Buttons */}
        <div className="space-y-3 pt-6 border-t border-[#202026]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-[#181820] hover:bg-[#252530] text-[#F5F2EB] border border-[#D4AF37]/50 font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-4 bg-[#D4AF37] hover:bg-[#E5C378] text-[#0B0B0C] font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>

          <button
            onClick={handleWhatsAppOrder}
            className="w-full py-3 bg-[#132A1C] hover:bg-[#183523] border border-[#25D366]/40 text-[#25D366] font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Order or Inquire via WhatsApp (+923109554240)</span>
          </button>

          {/* Delivery & Assurance bullet points */}
          <div className="pt-4 flex flex-col gap-1.5 text-xs text-[#8E8B84]">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Non-alcoholic concentrated oil formulated with traditional Peshawar mastery</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Cash on Delivery available nationwide (2-4 business days)</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>100% Authentic fragrance guarantee &amp; secure delivery box</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFullPage) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#0B0B0C]">
        <div className="max-w-6xl mx-auto mb-6">
          <button
            onClick={() => setActiveView('shop')}
            className="text-xs uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            ← Back to Collections
          </button>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl my-8">{content}</div>
    </div>
  );
};
