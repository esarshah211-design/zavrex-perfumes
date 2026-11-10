import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart, Search, Menu, X, Shield, MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/storage';

interface NavbarProps {
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const { totalItems, setIsCartOpen, activeView, setActiveView, wishlist, settings } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Collections', view: 'shop' },
    { label: 'Arabian Oud', view: 'shop-oud' },
    { label: 'Brand Story', view: 'about' },
    { label: 'Reviews', view: 'reviews' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0C]/90 backdrop-blur-md border-b border-[#25252B] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element wordmark in display face, whitespace-nowrap shrink-0) */}
        <button
          onClick={() => handleNav('home')}
          className="text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-[0.28em] text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors">
            ZAVREX
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wider uppercase text-[#C8C5BD]">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.view)}
              className={`hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeView === link.view
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Search button */}
          <button
            onClick={onSearchClick}
            aria-label="Search Fragrances"
            className="p-2 text-[#C8C5BD] hover:text-[#D4AF37] transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist button */}
          <button
            onClick={() => handleNav('wishlist')}
            aria-label="Wishlist"
            className="p-2 text-[#C8C5BD] hover:text-[#D4AF37] transition-colors relative hidden sm:block"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Quick WhatsApp Inquiry */}
          <a
            href={generateWhatsAppLink(
              settings.whatsappNumber,
              'Salam ZAVREX, I am interested in inquiring about your luxury attar collection.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Inquiry"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#0B0B0C] bg-[#D4AF37] hover:bg-[#E5C378] rounded transition-colors whitespace-nowrap shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Inquire</span>
          </a>

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            className="p-2 text-[#F5F2EB] hover:text-[#D4AF37] transition-colors relative flex items-center"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-black text-[11px] font-bold rounded-full flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </button>

          {/* Admin link button */}
          <button
            onClick={() => handleNav('admin')}
            aria-label="Admin Portal"
            title="Admin Portal"
            className={`p-2 transition-colors ${
              activeView === 'admin' ? 'text-[#D4AF37]' : 'text-[#7A7873] hover:text-[#C8C5BD]'
            }`}
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-[#C8C5BD] hover:text-[#F5F2EB] lg:hidden focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F0F12] border-b border-[#25252B] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.view)}
                className={`text-left text-base uppercase tracking-wider py-2 border-b border-[#1A1A20] ${
                  activeView === link.view ? 'text-[#D4AF37] font-semibold' : 'text-[#C8C5BD]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('wishlist')}
              className="text-left text-base uppercase tracking-wider py-2 border-b border-[#1A1A20] text-[#C8C5BD] flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              {wishlist.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-[#D4AF37] text-black font-bold rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="text-left text-base uppercase tracking-wider py-2 text-[#9E9B95] flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          </div>

          <div className="pt-2">
            <a
              href={generateWhatsAppLink(
                settings.whatsappNumber,
                'Salam ZAVREX, I would like to order luxury attars via WhatsApp.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] text-[#0B0B0C] font-semibold uppercase tracking-wider text-sm rounded"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
