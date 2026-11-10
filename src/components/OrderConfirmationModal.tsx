import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, MessageCircle, ArrowRight, Truck, MapPin, Phone, Calendar } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/storage';

export const OrderConfirmationModal: React.FC = () => {
  const { lastPlacedOrder, setActiveView, settings } = useCart();

  if (!lastPlacedOrder) return null;

  const orderItemsSummary = lastPlacedOrder.items
    .map((item) => `• ${item.name} (${item.size}) x${item.quantity} = PKR ${(item.price * item.quantity).toLocaleString()}`)
    .join('\n');

  const whatsappMessage = `Salam ZAVREX! I have just placed Order *${lastPlacedOrder.orderNumber}* on your website.

*Customer:* ${lastPlacedOrder.customer.fullName}
*Phone:* ${lastPlacedOrder.customer.phone}
*City:* ${lastPlacedOrder.customer.city}
*Address:* ${lastPlacedOrder.customer.address}

*Ordered Attars:*
${orderItemsSummary}

*Subtotal:* PKR ${lastPlacedOrder.subtotal.toLocaleString()}
*Delivery:* ${lastPlacedOrder.deliveryFee === 0 ? 'FREE' : `PKR ${lastPlacedOrder.deliveryFee}`}
${lastPlacedOrder.discountAmount > 0 ? `*Discount:* -PKR ${lastPlacedOrder.discountAmount.toLocaleString()}\n` : ''}*Total Amount:* PKR ${lastPlacedOrder.total.toLocaleString()}
*Payment Method:* ${lastPlacedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer'}

Please confirm my order and share dispatch tracking when shipped from Peshawar. Thank you!`;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#0B0B0C] flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#121216] border border-[#D4AF37]/40 p-6 sm:p-10 text-center relative shadow-2xl">
        {/* Crest & Success Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
        </div>

        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
          Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F2EB] mt-1 mb-2">
          Thank You For Choosing ZAVREX
        </h1>
        <p className="text-xs text-[#8E8B84] max-w-md mx-auto mb-6">
          Your order has been recorded in our system. Our master blenders in Peshawar are carefully preparing your attars in our signature luxury presentation box.
        </p>

        {/* Order Number Highlight Card */}
        <div className="p-4 bg-[#0E0E12] border border-[#25252B] mb-8 inline-block w-full max-w-sm">
          <span className="text-[10px] uppercase tracking-widest text-[#8E8B84] block mb-1">
            Official Order ID
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#D4AF37] tracking-wider">
            {lastPlacedOrder.orderNumber}
          </span>
        </div>

        {/* 1-Click WhatsApp Instant Confirmation (Crucial for Pakistan customers!) */}
        <div className="mb-8 p-5 bg-[#141F18] border border-[#25D366]/40 text-left">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#F5F2EB] mb-1">
                Notify ZAVREX Concierge on WhatsApp
              </h4>
              <p className="text-xs text-[#8E8B84] mb-3">
                Send your order details directly to our WhatsApp (+923109554240) to accelerate dispatch confirmation and receive live courier tracking.
              </p>
              <a
                href={generateWhatsAppLink(settings.whatsappNumber, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#32E875] text-black font-bold text-xs uppercase tracking-wider rounded transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send Order to WhatsApp (+923109554240)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="text-left bg-[#0E0E12] border border-[#202026] p-5 text-xs text-[#C8C5BD] space-y-4 mb-8">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
            <span className="font-semibold text-sm text-[#F5F2EB]">Order Details</span>
            <span className="flex items-center gap-1 text-[11px] text-[#8E8B84]">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              {new Date(lastPlacedOrder.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="space-y-2">
            {lastPlacedOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span>
                  {item.name} ({item.size}) <span className="text-[#8E8B84]">x{item.quantity}</span>
                </span>
                <span className="font-semibold text-[#F5F2EB] tabular-nums">
                  ₨ {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1F1F24] space-y-1 text-[#8E8B84]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-[#F5F2EB] tabular-nums">₨ {lastPlacedOrder.subtotal.toLocaleString()}</span>
            </div>
            {lastPlacedOrder.discountAmount > 0 && (
              <div className="flex justify-between text-[#D4AF37]">
                <span>Discount:</span>
                <span className="tabular-nums">- ₨ {lastPlacedOrder.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span className="text-[#F5F2EB] tabular-nums">
                {lastPlacedOrder.deliveryFee === 0 ? 'FREE' : `₨ ${lastPlacedOrder.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#F5F2EB] pt-2 border-t border-[#1F1F24]">
              <span>Grand Total:</span>
              <span className="text-[#D4AF37] tabular-nums">₨ {lastPlacedOrder.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="pt-3 border-t border-[#1F1F24] grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-[#8E8B84] block mb-0.5">Delivery Address:</span>
              <p className="text-[#F5F2EB] flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{lastPlacedOrder.customer.address}, {lastPlacedOrder.customer.city}</span>
              </p>
            </div>
            <div>
              <span className="text-[#8E8B84] block mb-0.5">Payment Method:</span>
              <p className="text-[#F5F2EB] font-medium flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{lastPlacedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Bank Transfer'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1F1F26] hover:bg-[#2A2A35] text-[#F5F2EB] border border-[#3A3A45] font-semibold text-xs uppercase tracking-wider transition-colors"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
        </button>
      </div>
    </div>
  );
};
