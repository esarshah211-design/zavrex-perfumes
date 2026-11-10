import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    promoCode,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    isCartOpen,
    setIsCartOpen,
    settings,
    setActiveView,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setInputCode('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Free delivery progress
  const freeThreshold = settings.freeDeliveryThreshold || 4000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const amountRemaining = Math.max(0, freeThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0F12] border-l border-[#25252B] text-[#F5F2EB] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#202026] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-2xl font-normal tracking-wide">
                Your Fragrance Bag
              </h2>
              <span className="text-xs text-[#8E8B84] font-mono">({totalItems})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#8E8B84] hover:text-[#F5F2EB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#141418] px-6 py-3 border-b border-[#202026]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-[#C8C5BD] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                {amountRemaining > 0 ? (
                  <>Add <strong className="text-[#D4AF37]">PKR {amountRemaining.toLocaleString()}</strong> for Free Delivery</>
                ) : (
                  <span className="text-[#D4AF37]">You unlocked Free Express Shipping!</span>
                )}
              </span>
              <span className="text-[11px] text-[#8E8B84]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#25252B] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-[#2A2A35] mb-4" />
                <p className="font-serif text-xl text-[#F5F2EB] mb-2">Your Bag is Empty</p>
                <p className="text-xs text-[#8E8B84] max-w-xs mb-6">
                  Explore our royal collection of non-alcoholic attars and pure perfume oils.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('shop');
                  }}
                  className="px-6 py-3 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#E5C378] transition-colors"
                >
                  Discover Fragrances
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#141418] border border-[#202026] relative group"
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 bg-[#0B0B0C] shrink-0 border border-[#25252B] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start pr-6">
                        <h4 className="font-serif text-base text-[#F5F2EB] leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                      </div>
                      <div className="text-[11px] text-[#D4AF37] uppercase tracking-wider mt-0.5">
                        Size: {item.size} · Pure Oil
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1F1F26]">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#2A2A32] bg-[#0E0E12]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-[#8E8B84] hover:text-[#F5F2EB]"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-[#8E8B84] hover:text-[#F5F2EB]"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-sans font-semibold text-sm text-[#F5F2EB] tabular-nums">
                        ₨ {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                    className="absolute top-3 right-3 text-[#5A5852] hover:text-[#E74C3C] transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#121216] border-t border-[#202026] space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B84]" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. ZAVREX10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#0E0E12] border border-[#2A2A32] text-xs text-[#F5F2EB] uppercase placeholder:normal-case placeholder:text-[#5A5852] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#202028] hover:bg-[#D4AF37] hover:text-black text-xs font-semibold uppercase tracking-wider text-[#F5F2EB] transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 border border-[#D4AF37]/20">
                    <span>Applied Promo: <strong>{appliedPromo}</strong></span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-xs text-[#8E8B84] hover:text-red-400 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoMessage && (
                  <p
                    className={`text-xs ${
                      promoMessage.isError ? 'text-red-400' : 'text-[#D4AF37]'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-[#C8C5BD] pt-2 border-t border-[#1C1C22]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-[#F5F2EB]">
                    ₨ {subtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>Discount</span>
                    <span className="tabular-nums font-medium">
                      - ₨ {discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Nationwide Express Delivery</span>
                  <span className="tabular-nums font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-[#D4AF37] uppercase tracking-wider">Free</span>
                    ) : (
                      `₨ ${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-[#F5F2EB] pt-2 border-t border-[#25252B]">
                  <span>Total Amount</span>
                  <span className="tabular-nums text-lg text-[#D4AF37]">
                    ₨ {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#E5C378] text-[#0B0B0C] font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A7873]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Cash on Delivery &amp; Bank Transfer Available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
