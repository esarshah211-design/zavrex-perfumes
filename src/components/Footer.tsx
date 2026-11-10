import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PolicyModal } from './PolicyModal';
import { MessageCircle, MapPin, Instagram, ShieldCheck, Heart } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/storage';

export const Footer: React.FC = () => {
  const { settings, setActiveView } = useCart();
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'shipping' | 'returns' | null>(null);

  const categories = [
    { name: "Men's Collection", id: "Men's Collection" },
    { name: "Women's Collection", id: "Women's Collection" },
    { name: 'Unisex Collection', id: 'Unisex Collection' },
    { name: 'Arabian Oud', id: 'Arabian Oud' },
    { name: 'Musk Collection', id: 'Musk Collection' },
    { name: 'Signature Collection', id: 'Signature Collection' },
  ];

  return (
    <>
      <footer className="bg-[#08080A] text-[#8E8B84] border-t border-[#1C1C24] pt-16 pb-24 lg:pb-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#1A1A22]">
            {/* Brand Column (Col Span 2 on Large) */}
            <div className="lg:col-span-2 space-y-4">
              <button
                onClick={() => {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-left group focus:outline-none"
              >
                <span className="font-display text-2xl font-bold tracking-[0.28em] text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors">
                  {settings.brandName}
                </span>
              </button>

              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-medium">
                {settings.tagline}
              </p>

              <p className="text-xs text-[#8E8B84] max-w-sm leading-relaxed font-light">
                Premium non-alcoholic artisanal attars and pure perfume oils crafted with venerable heritage in Peshawar, Pakistan. Sourced from the finest terroirs of Assam, Cambodia, and Taif.
              </p>

              <div className="pt-2 flex items-center gap-4 text-[#F5F2EB]">
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ZAVREX Instagram"
                  className="p-2 bg-[#121216] border border-[#25252B] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors rounded"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ZAVREX TikTok"
                  className="p-2 bg-[#121216] border border-[#25252B] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors rounded flex items-center justify-center font-bold text-xs"
                >
                  <span>♪</span>
                </a>

                <a
                  href={generateWhatsAppLink(
                    settings.whatsappNumber,
                    'Salam ZAVREX, I am reaching out from your website footer.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ZAVREX WhatsApp"
                  className="p-2 bg-[#121216] border border-[#25252B] hover:border-[#25D366] hover:text-[#25D366] transition-colors rounded"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>

            {/* Shop Categories */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#F5F2EB] font-semibold">
                Collections
              </h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setActiveView('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-[#D4AF37] transition-colors text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Concierge & Policies */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#F5F2EB] font-semibold">
                Customer Care
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActivePolicy('shipping')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Nationwide Shipping Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePolicy('returns')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Return &amp; Exchange Guarantee
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePolicy('privacy')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePolicy('terms')}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#D4AF37] transition-colors text-[#5A5852]"
                  >
                    Admin Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact & Location Information */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#F5F2EB] font-semibold">
                Atelier Peshawar
              </h4>
              <p className="text-xs text-[#C8C5BD] leading-relaxed flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{settings.location}</span>
              </p>
              <p className="text-xs text-[#C8C5BD] flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>{settings.whatsappNumber}</span>
              </p>
              <div className="pt-2">
                <div className="p-3 bg-[#121216] border border-[#202026] text-[11px] text-[#7A7873]">
                  <span>Fast Cash on Delivery nationwide via certified courier networks.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#5A5852]">
            <p>© {new Date().getFullYear()} ZAVREX Fragrance House. All Rights Reserved.</p>
            <p className="flex items-center gap-1 text-[#7A7873]">
              <span>Handcrafted with devotion in Peshawar, Pakistan</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      <PolicyModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </>
  );
};
