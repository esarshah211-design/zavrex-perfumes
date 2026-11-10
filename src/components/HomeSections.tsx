import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import {
  ArrowRight,
  Shield,
  Sparkles,
  Award,
  Droplet,
  Instagram,
  CheckCircle2,
} from 'lucide-react';
import {
  OUD_IMPERIALE_IMAGE,
  ROOH_AL_MUSK_IMAGE,
  TAIF_ROSE_IMAGE,
  HERO_IMAGE,
  CRAFTSMANSHIP_IMAGE,
} from '../data/initialData';

interface HomeSectionsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({ products, onQuickView }) => {
  const { setActiveView, setSelectedProduct, settings } = useCart();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter collections
  const signatureProducts = products.filter((p) => p.isSignature || p.isFeatured).slice(0, 3);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 3);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. SIGNATURE OUD & ATTIRE SPOTLIGHT (Airy, High-End Presentation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-2">
              <span>Haute Parfumerie</span>
              <span aria-hidden="true">·</span>
              <span>Signature Extraits</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F5F2EB]">
              The Signature Collection
            </h2>
          </div>

          <button
            onClick={() => {
              setActiveView('shop');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:text-[#E5C378] font-semibold flex items-center gap-2 group self-start md:self-auto"
          >
            <span>View All Creations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3-column product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {signatureProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* 2. THE OLFACTORY ARTISTRY (EDITORIAL SHOWCASE SPLIT) */}
      <section className="bg-[#121216] border-y border-[#202026] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
              The Pure Essence
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F5F2EB] leading-tight">
              Why Discerning Connoisseurs Prefer ZAVREX Attars
            </h2>
            <p className="text-sm text-[#9E9B95] leading-relaxed font-light">
              Unlike Western eau de parfum sprays that rely on 80% to 90% denatured industrial alcohol, ZAVREX attars consist strictly of 100% pure perfume oil. Applying a single swipe of our crystal wand to your pulse points ensures an intimate, mesmerizing scent trail that lasts all day and into the evening.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#1F1F26]">
              <div>
                <span className="font-serif text-3xl font-normal text-[#D4AF37] tabular-nums block mb-1">
                  100%
                </span>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F5F2EB]">
                  Alcohol-Free
                </h4>
                <p className="text-[11px] text-[#7A7873] mt-0.5">
                  Safe for sensitive skin &amp; prayer rituals.
                </p>
              </div>

              <div>
                <span className="font-serif text-3xl font-normal text-[#D4AF37] tabular-nums block mb-1">
                  24h+
                </span>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F5F2EB]">
                  Skin Longevity
                </h4>
                <p className="text-[11px] text-[#7A7873] mt-0.5">
                  Natural resinous base notes that endure.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold text-xs uppercase tracking-widest transition-colors inline-flex items-center gap-2"
              >
                <span>Read Our Heritage Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] bg-[#0E0E10] border border-[#25252B] overflow-hidden shadow-2xl">
              <img
                src={OUD_IMPERIALE_IMAGE}
                alt="Cambodian Oud attar in crystal flacon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0B0B0C]/80 backdrop-blur-sm border border-[#25252B]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">
                      Featured Creation
                    </span>
                    <h3 className="font-serif text-lg text-[#F5F2EB]">Dehn Al Oud Royale</h3>
                  </div>
                  <button
                    onClick={() => {
                      const prod = products.find((p) => p.id === 'zvx-oud-royale');
                      if (prod) {
                        setSelectedProduct(prod);
                        setActiveView('product-details');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#E5C378]"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-2">
              <span>Client Favorites</span>
              <span aria-hidden="true">·</span>
              <span>Most Coveted</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F5F2EB]">
              Best Sellers
            </h2>
          </div>

          <button
            onClick={() => {
              setActiveView('shop');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:text-[#E5C378] font-semibold flex items-center gap-2 group self-start md:self-auto"
          >
            <span>Browse All Attars</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* 4. INSTAGRAM & TIKTOK GALLERY (Crucial for mobile and social traffic) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-2">
            <Instagram className="w-3.5 h-3.5" />
            <span>@zavrex.pk on Instagram</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F2EB]">
            Follow The Journey
          </h2>
          <p className="text-xs text-[#8E8B84] mt-1">
            Tag #ZavrexLuxury in your stories to be featured in our royal gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { img: OUD_IMPERIALE_IMAGE, title: 'Cambodian Oud Distillation' },
            { img: ROOH_AL_MUSK_IMAGE, title: 'Pure White Musk on Silk' },
            { img: TAIF_ROSE_IMAGE, title: 'Taif Damascena Petals' },
            { img: HERO_IMAGE, title: 'Artisanal Crystal Flacon' },
          ].map((item, idx) => (
            <a
              key={idx}
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-[#141418] border border-[#202026] overflow-hidden block"
            >
              <img
                src={item.img}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#0B0B0C]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <Instagram className="w-6 h-6 text-[#D4AF37] mb-2" />
                <span className="text-xs font-serif text-[#F5F2EB]">{item.title}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 5. NEWSLETTER & VIP ATELIER CLUB */}
      <section className="bg-gradient-to-b from-[#121216] to-[#0B0B0C] border-t border-[#202026] py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-xl mx-auto">
          <Sparkles className="w-6 h-6 text-[#D4AF37] mx-auto mb-3" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-2">
            The ZAVREX Private Circle
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F2EB] mb-3">
            Receive Private Allocations
          </h2>
          <p className="text-xs text-[#8E8B84] font-light leading-relaxed mb-6">
            Subscribe to receive invitations to limited single-cask agarwood releases, seasonal harvest notifications, and secret private member discounts.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-[#142A1C] border border-[#25D366]/40 text-[#25D366] text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Welcome to the ZAVREX Private Circle. Your invitation is confirmed.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#0A0A0D] border border-[#25252B] text-xs text-[#F5F2EB] placeholder:text-[#5A5852] focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                Join Circle
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
