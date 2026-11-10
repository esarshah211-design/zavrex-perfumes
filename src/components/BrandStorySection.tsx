import React from 'react';
import { useCart } from '../context/CartContext';
import { CRAFTSMANSHIP_IMAGE } from '../data/initialData';
import { Shield, Sparkles, Feather, Compass, CheckCircle } from 'lucide-react';

export const BrandStorySection: React.FC<{ isStandalonePage?: boolean }> = ({ isStandalonePage = false }) => {
  const { settings, setActiveView } = useCart();

  return (
    <div className={`bg-[#0B0B0C] text-[#F5F2EB] ${isStandalonePage ? 'py-16' : 'py-24'} border-t border-[#202026]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-3">
            <span>The Heritage of Haute Parfumerie</span>
            <span aria-hidden="true">·</span>
            <span>{settings.location}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-[#F5F2EB] mb-6">
            The Philosophy of ZAVREX
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#C8C5BD] font-light leading-relaxed">
            Born at the historic crossroads of Peshawar, ZAVREX was founded with an unyielding devotion: to resurrect the noble art of pure, non-alcoholic concentrated perfume oils and elevate them to the zenith of global luxury.
          </p>
        </div>

        {/* Editorial Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-20">
          {/* Craftsmanship Image */}
          <div className="lg:col-span-7 relative group">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-[#141418] border border-[#D4AF37]/20 overflow-hidden shadow-2xl">
              <img
                src={CRAFTSMANSHIP_IMAGE}
                alt="Artisanal perfume distillation still and master perfumer hands holding precious oud and amber"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-mono">
                  Atelier Archive · Traditional Hydro-Distillation
                </span>
                <p className="font-serif text-lg sm:text-xl text-[#F5F2EB] mt-1">
                  Pure Agarwood Heartwood &amp; Wild Flora Distillation
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F2EB] font-normal leading-snug">
              Beyond Fragrance.<br />
              <span className="text-[#D4AF37]">Beyond Ordinary.</span>
            </h3>

            <p className="text-sm text-[#9E9B95] leading-relaxed">
              In a commercial world saturated with diluted, alcohol-based sprays that dissipate within hours, ZAVREX honors the ancient tradition of slow perfumery. Our attars are concentrated extracts of rare natural botanicals, wild-harvested resins, and aged Assamese agarwood.
            </p>

            <p className="text-sm text-[#9E9B95] leading-relaxed">
              Every drop is applied using an artisanal crystal wand directly to pulse points, reacting intimately with your body warmth to craft a singular olfactory signature that turns heads without saying a word.
            </p>

            <div className="space-y-3 pt-4 border-t border-[#1C1C24]">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs text-[#C8C5BD]">
                  <strong>Zero Alcohol:</strong> 100% skin-safe, pure perfume oil formulated for religious purity and deep reverence.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs text-[#C8C5BD]">
                  <strong>Rare Terroirs:</strong> Wild Cambodian Oud, Omani Frankincense, Kashmiri Saffron, and Taif Damascena Rose.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs text-[#C8C5BD]">
                  <strong>Artisanal Crystal Vessels:</strong> Heavy faceted glass bottles with engraved gold closures designed as collectors' heirlooms.
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setActiveView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold text-xs uppercase tracking-widest transition-colors"
              >
                Experience the Collection
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-12 border-t border-[#202026]">
          <div className="p-6 bg-[#121216] border border-[#202026]">
            <Compass className="w-6 h-6 text-[#D4AF37] mb-4" />
            <h4 className="font-serif text-lg text-[#F5F2EB] mb-2">Heritage Origin</h4>
            <p className="text-xs text-[#8E8B84] leading-relaxed">
              Crafted in Peshawar, preserving centuries of Silk Route botanical blending traditions.
            </p>
          </div>

          <div className="p-6 bg-[#121216] border border-[#202026]">
            <Feather className="w-6 h-6 text-[#D4AF37] mb-4" />
            <h4 className="font-serif text-lg text-[#F5F2EB] mb-2">Silken Sillage</h4>
            <p className="text-xs text-[#8E8B84] leading-relaxed">
              Velvety textures that nourish the skin while delivering an intimate, magnetic projection.
            </p>
          </div>

          <div className="p-6 bg-[#121216] border border-[#202026]">
            <Sparkles className="w-6 h-6 text-[#D4AF37] mb-4" />
            <h4 className="font-serif text-lg text-[#F5F2EB] mb-2">Aged Maceration</h4>
            <p className="text-xs text-[#8E8B84] leading-relaxed">
              Each formulation rests in dark temperature-regulated cellars for months to achieve absolute harmony.
            </p>
          </div>

          <div className="p-6 bg-[#121216] border border-[#202026]">
            <Shield className="w-6 h-6 text-[#D4AF37] mb-4" />
            <h4 className="font-serif text-lg text-[#F5F2EB] mb-2">Absolute Integrity</h4>
            <p className="text-xs text-[#8E8B84] leading-relaxed">
              Uncut, unadulterated pure perfume oil. No cheap solvents, parabens, or harsh synthetics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
