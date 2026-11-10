import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useCart();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !settings.announcementText) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#121215] via-[#1C1A16] to-[#121215] border-b border-[#D4AF37]/20 py-2 px-4 text-xs text-[#E5C378] flex items-center justify-center font-medium tracking-wider uppercase">
      <div className="flex items-center gap-2 text-center truncate">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 animate-pulse hidden sm:inline" />
        <span className="truncate">{settings.announcementText}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9B95] hover:text-[#F5F2EB] p-1 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
