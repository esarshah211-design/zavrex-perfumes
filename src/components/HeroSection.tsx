import React from 'react';
import { useCart } from '../context/CartContext';
import { ArrowRight, Compass, ShieldCheck, Droplet, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { settings, setActiveView } = useCart();

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0C]">
      {/* Background Hero Image with luxury multi-stop dark scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImage}
          alt="ZAVREX Artisanal Attar Bottle and Cambodian Oud"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Measured dark scrim for WCAG AA legibility & deep luxury aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/75 to-[#0B0B0C]/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0B0B0C]/50 to-[#0B0B0C]/90" />
      </div>

      {/* Decorative hairline gold accent frame */}
      <div className="absolute inset-4 sm:inset-8 border border-[#D4AF37]/15 pointer-events-none z-10 hidden md:block" />

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Editorial Subtitle Kicker (Clean unboxed metadata) */}
        <div className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.3em] text-[#D4AF37] mb-6 font-medium">
          <span>{settings.brandName}</span>
          <span aria-hidden="true">·</span>
          <span>{settings.location}</span>
          <span aria-hidden="true">·</span>
          <span>Haute Parfumerie</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-wide text-[#F5F2EB] leading-[1.08] text-balance max-w-4xl mb-6">
          {settings.heroHeadline}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base sm:text-xl text-[#C8C5BD] font-light max-w-2xl mx-auto leading-relaxed tracking-wide mb-10 text-balance">
          {settings.heroSubtitle}
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto mb-16">
          <button
            onClick={() => {
              setActiveView('shop');
              window.scrollTo({ top: 500, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#E5C378] text-[#0B0B0C] font-semibold text-xs uppercase tracking-[0.22em] transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 flex items-center justify-center gap-3 group"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              setActiveView('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-[#F5F2EB]/5 text-[#F5F2EB] hover:text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] font-semibold text-xs uppercase tracking-[0.22em] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <span>Discover ZAVREX</span>
          </button>
        </div>

        {/* Trust Markers Bar */}
        <div className="pt-8 border-t border-[#25252B]/80 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 w-full max-w-3xl">
          <div className="flex items-center justify-center gap-3 text-left">
            <Droplet className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#F5F2EB]">100% Pure Attar</p>
              <p className="text-[11px] text-[#8E8B84]">Alcohol-free concentrated perfume oil</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#F5F2EB]">Beast-Mode Longevity</p>
              <p className="text-[11px] text-[#8E8B84]">18 to 24+ hours projection on garments</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#F5F2EB]">Nationwide Cash on Delivery</p>
              <p className="text-[11px] text-[#8E8B84]">Dispatched from Peshawar across Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
