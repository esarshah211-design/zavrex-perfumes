import React from 'react';
import { useCart } from '../context/CartContext';
import { Home, Sparkles, ShoppingBag, Heart, MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/storage';

export const MobileBottomNav: React.FC = () => {
  const { totalItems, activeView, setActiveView, setIsCartOpen, wishlist, settings } = useCart();

  const handleNav = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#0F0F12]/95 backdrop-blur-md border-t border-[#25252B] py-2 px-3 pb-safe">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] transition-colors ${
            activeView === 'home' ? 'text-[#D4AF37]' : 'text-[#8E8B84] hover:text-[#C8C5BD]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-wider mt-1 uppercase font-medium">Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => handleNav('shop')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] transition-colors ${
            activeView.startsWith('shop') ? 'text-[#D4AF37]' : 'text-[#8E8B84] hover:text-[#C8C5BD]'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] tracking-wider mt-1 uppercase font-medium">Shop</span>
        </button>

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center p-1.5 min-w-[50px] text-[#8E8B84] hover:text-[#D4AF37] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider mt-1 uppercase font-medium">Cart</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => handleNav('wishlist')}
          className={`relative flex flex-col items-center justify-center p-1.5 min-w-[50px] transition-colors ${
            activeView === 'wishlist' ? 'text-[#D4AF37]' : 'text-[#8E8B84] hover:text-[#C8C5BD]'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider mt-1 uppercase font-medium">Saved</span>
        </button>

        {/* Direct WhatsApp */}
        <a
          href={generateWhatsAppLink(
            settings.whatsappNumber,
            'Salam ZAVREX, I am browsing your fragrance collection and would like personal assistance.'
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-1.5 min-w-[50px] text-[#25D366] hover:text-[#32E875] transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] tracking-wider mt-1 uppercase font-semibold">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
