import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { MessageCircle, X, Sparkles, Package, HelpCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/storage';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const quickPrompts = [
    {
      title: 'Order on WhatsApp',
      desc: 'Send product names or screenshots to order directly',
      icon: Package,
      msg: 'Salam ZAVREX! I would like to place an attar order directly through WhatsApp.',
    },
    {
      title: 'Fragrance Recommendation',
      desc: 'Speak with our perfume specialist in Peshawar',
      icon: Sparkles,
      msg: 'Salam ZAVREX! I would like advice on selecting the best attar for my taste and personality.',
    },
    {
      title: 'Track My Order',
      desc: 'Inquire regarding courier dispatch status',
      icon: HelpCircle,
      msg: 'Salam ZAVREX! I would like to inquire about the tracking status of my recent order.',
    },
  ];

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-5 z-40 flex flex-col items-end">
      {/* Expanded Quick Options Menu */}
      {isOpen && (
        <div className="mb-3 w-80 bg-[#121216] border border-[#25D366]/40 p-4 shadow-2xl text-left animate-fade-in rounded-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#202026] mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="font-semibold text-xs text-[#F5F2EB] uppercase tracking-wider">
                ZAVREX Concierge
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#8E8B84] hover:text-[#F5F2EB]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#8E8B84] mb-3">
            Peshawar Atelier &amp; Nationwide Support. How may we assist you today?
          </p>

          <div className="space-y-2">
            {quickPrompts.map((q, idx) => {
              const Icon = q.icon;
              return (
                <a
                  key={idx}
                  href={generateWhatsAppLink(settings.whatsappNumber, q.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 bg-[#181820] hover:bg-[#20202A] border border-[#2A2A35] hover:border-[#25D366]/50 rounded flex items-start gap-2.5 transition-all text-xs group"
                >
                  <Icon className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors">
                      {q.title}
                    </div>
                    <div className="text-[11px] text-[#8E8B84] leading-tight mt-0.5">
                      {q.desc}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-[#202026] text-center">
            <span className="text-[10px] text-[#7A7873]">
              Official WhatsApp: {settings.whatsappNumber}
            </span>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open WhatsApp Concierge"
        className="relative group p-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-black rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none group-hover:opacity-0" />
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <MessageCircle className="w-6 h-6 fill-current text-black" />
        )}
      </button>
    </div>
  );
};
