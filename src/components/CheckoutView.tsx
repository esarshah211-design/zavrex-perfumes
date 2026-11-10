import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PAKISTAN_CITIES } from '../data/initialData';
import { createOrder, generateWhatsAppLink } from '../lib/storage';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Building2, MessageCircle, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    appliedPromo,
    clearCart,
    setActiveView,
    settings,
    setLastPlacedOrder,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    city: 'Peshawar',
    address: '',
    notes: '',
  });

  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl text-[#F5F2EB] mb-3">Your Bag is Empty</h2>
        <p className="text-sm text-[#8E8B84] mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-8 py-3 bg-[#D4AF37] text-black font-semibold uppercase text-xs tracking-wider"
        >
          Return to Collections
        </button>
      </div>
    );
  }

  const handlePhoneChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: val,
      whatsapp: sameAsPhone ? val : prev.whatsapp,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please provide a valid Pakistani contact phone number (e.g. 03001234567).');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please enter your complete delivery street address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customer: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          whatsapp: (sameAsPhone ? formData.phone : formData.whatsapp).trim(),
          city: formData.city,
          address: formData.address.trim(),
          notes: formData.notes.trim() || undefined,
        },
        items: cart,
        subtotal,
        deliveryFee,
        discountAmount,
        promoCode: appliedPromo || undefined,
        total,
        paymentMethod,
        status: 'pending',
      });

      // Fire celebratory luxury gold confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#E5C378', '#FAF6EE', '#0B0B0C'],
        });
      } catch {
        // Safe fallback
      }

      setLastPlacedOrder(order);
      clearCart();
      setActiveView('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Order creation failed:', err);
      setError('Failed to place order. Please try again or order directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-[#0B0B0C]">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => setActiveView('shop')}
          className="text-xs uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1.5 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-7 bg-[#121216] border border-[#25252B] p-6 sm:p-8">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Express Checkout
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#F5F2EB] mt-1">
                Delivery &amp; Payment Details
              </h1>
              <p className="text-xs text-[#8E8B84] mt-1">
                Dispatched directly from Peshawar atelier. No upfront card required for COD.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#F5F2EB] mb-2">
                  Full Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Khan Bangash"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] placeholder:text-[#5A5852] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#F5F2EB] mb-2">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] placeholder:text-[#5A5852] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[11px] text-[#7A7873] mt-1 block">Rider will call on this number</span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#F5F2EB] mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    disabled={sameAsPhone}
                    placeholder="0300 1234567"
                    value={sameAsPhone ? formData.phone : formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] placeholder:text-[#5A5852] focus:outline-none focus:border-[#D4AF37] ${
                      sameAsPhone ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  />
                  <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => setSameAsPhone(e.target.checked)}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-[11px] text-[#9E9B95]">Same as mobile phone</span>
                  </label>
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#F5F2EB] mb-2">
                  Destination City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0E0E12] text-[#F5F2EB]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#F5F2EB] mb-2">
                  Complete Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House / Flat #, Street, Phase / Sector, Landmark"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] placeholder:text-[#5A5852] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Special Order Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#F5F2EB] mb-2">
                  Order Notes &amp; Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gift packaging requested / Call before 5 PM"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] placeholder:text-[#5A5852] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-[#202026]">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#F5F2EB] mb-3">
                  Select Payment Method:
                </label>
                <div className="space-y-3">
                  {/* Cash on Delivery (COD) */}
                  <label
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 ring-1 ring-[#D4AF37]'
                        : 'border-[#25252B] bg-[#0E0E12] hover:border-[#3A3A45]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-[#D4AF37]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#F5F2EB] flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#D4AF37]" />
                          <span>Cash on Delivery (COD)</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/30">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8B84] mt-1">
                        Pay cash directly to the courier upon delivery at your doorstep anywhere in Pakistan.
                      </p>
                    </div>
                  </label>

                  {/* Direct Bank Transfer */}
                  <label
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 ring-1 ring-[#D4AF37]'
                        : 'border-[#25252B] bg-[#0E0E12] hover:border-[#3A3A45]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 accent-[#D4AF37]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#F5F2EB] flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#D4AF37]" />
                          <span>Direct Bank Transfer</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8B84] mt-1">
                        Transfer to Meezan Bank, SadaPay, or Nayapay. Receipt verified instantly via WhatsApp.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Bank Details Display if Bank Transfer Selected */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-4 p-4 bg-[#181820] border border-[#D4AF37]/30 text-xs space-y-2">
                    <p className="font-semibold text-[#D4AF37] uppercase tracking-wider">
                      Official ZAVREX Bank Account:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#C8C5BD]">
                      <div>
                        <span className="text-[#8E8B84]">Bank:</span>{' '}
                        <strong className="text-[#F5F2EB]">{settings.bankDetails.bankName}</strong>
                      </div>
                      <div>
                        <span className="text-[#8E8B84]">Title:</span>{' '}
                        <strong className="text-[#F5F2EB]">{settings.bankDetails.accountTitle}</strong>
                      </div>
                      <div>
                        <span className="text-[#8E8B84]">Account #:</span>{' '}
                        <strong className="text-[#F5F2EB] font-mono">{settings.bankDetails.accountNumber}</strong>
                      </div>
                      <div>
                        <span className="text-[#8E8B84]">IBAN:</span>{' '}
                        <strong className="text-[#F5F2EB] font-mono text-[11px]">{settings.bankDetails.iban}</strong>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#9E9B95] pt-1 border-t border-[#25252B]">
                      After placing your order, kindly share a screenshot of the payment receipt on WhatsApp with your Order ID.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#E5C378] text-[#0B0B0C] font-bold text-xs uppercase tracking-[0.22em] transition-all duration-300 shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Confirming Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Place Order (PKR {total.toLocaleString()})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#8E8B84]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Your personal details are securely held in strict confidence.</span>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121216] border border-[#25252B] p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-normal text-[#F5F2EB] pb-4 border-b border-[#202026] mb-6">
                Order Summary
              </h2>

              <div className="divide-y divide-[#1C1C24] max-h-80 overflow-y-auto mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover border border-[#25252B] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-serif text-[#F5F2EB] truncate">{item.name}</h4>
                      <p className="text-xs text-[#8E8B84]">
                        {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#F5F2EB] tabular-nums shrink-0">
                      ₨ {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs text-[#C8C5BD] pt-4 border-t border-[#202026]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-[#F5F2EB]">
                    ₨ {subtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>Discount ({appliedPromo})</span>
                    <span className="tabular-nums font-medium">
                      - ₨ {discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery ({formData.city})</span>
                  <span className="tabular-nums font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-[#D4AF37] uppercase tracking-wider font-semibold">Free</span>
                    ) : (
                      `₨ ${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-[#F5F2EB] pt-4 border-t border-[#25252B]">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#D4AF37] font-bold tabular-nums">
                    ₨ {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Ordering Alternative */}
            <div className="bg-[#141A16] border border-[#25D366]/30 p-5 text-center">
              <p className="text-xs uppercase tracking-wider font-semibold text-[#25D366] mb-1">
                Prefer Ordering Directly via WhatsApp?
              </p>
              <p className="text-xs text-[#8E8B84] mb-4">
                Chat with our perfume consultants in Peshawar to customize your bottle or send delivery details directly.
              </p>
              <a
                href={generateWhatsAppLink(
                  settings.whatsappNumber,
                  `Salam ZAVREX, I have ${cart.length} items in my cart totaling PKR ${total.toLocaleString()}. I would like to place my order directly via WhatsApp.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#25D366] text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-[#32E875] transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp (+923109554240)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
