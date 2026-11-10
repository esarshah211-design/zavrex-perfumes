import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { getStoredReviews, saveReviews } from '../lib/storage';
import { Review } from '../types';
import { Star, ShieldCheck, MessageSquarePlus, Check, X } from 'lucide-react';
import { PAKISTAN_CITIES } from '../data/initialData';

export const CustomerReviewsSection: React.FC<{ isStandalonePage?: boolean }> = ({ isStandalonePage = false }) => {
  const [reviews, setReviews] = useState<Review[]>(getStoredReviews);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    city: 'Peshawar',
    rating: 5,
    title: '',
    comment: '',
    productName: 'Dehn Al Oud Royale',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.comment.trim()) return;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      productId: 'zvx-custom',
      productName: formData.productName,
      author: formData.author.trim(),
      city: formData.city,
      rating: formData.rating,
      title: formData.title.trim() || 'Exceptional Fragrance',
      comment: formData.comment.trim(),
      date: 'Just now',
      verifiedPurchase: true,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveReviews(updated);
    setSubmitted(true);
    setTimeout(() => {
      setShowAddModal(false);
      setSubmitted(false);
      setFormData({
        author: '',
        city: 'Peshawar',
        rating: 5,
        title: '',
        comment: '',
        productName: 'Dehn Al Oud Royale',
      });
    }, 1500);
  };

  return (
    <section className={`bg-[#0E0E12] text-[#F5F2EB] ${isStandalonePage ? 'py-16' : 'py-24'} border-t border-[#202026]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-2">
              <span>Authentic Appraisals</span>
              <span aria-hidden="true">·</span>
              <span>Perfume Connoisseurs</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F5F2EB]">
              Client Testimonials
            </h2>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="self-start md:self-auto px-6 py-3 bg-[#181820] hover:bg-[#D4AF37] text-[#F5F2EB] hover:text-black border border-[#D4AF37]/50 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-[#121216] border border-[#202026] flex flex-col justify-between"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'text-[#D4AF37] fill-[#D4AF37]'
                          : 'text-[#444]'
                      }`}
                    />
                  ))}
                </div>

                <h4 className="font-serif text-base font-medium text-[#F5F2EB] mb-2 leading-snug">
                  "{rev.title}"
                </h4>

                <p className="text-xs text-[#9E9B95] leading-relaxed mb-6 font-light">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1C1C24]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#F5F2EB]">{rev.author}</span>
                  <span className="text-[#8E8B84]">{rev.city}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7A7873] mt-1">
                  <span className="text-[#D4AF37]">{rev.productName}</span>
                  {rev.verifiedPurchase && (
                    <span className="flex items-center gap-0.5 text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#121216] border border-[#25252B] p-6 sm:p-8 max-w-lg w-full text-left relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-[#8E8B84] hover:text-[#F5F2EB]"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Share Your Experience
              </span>
              <h3 className="font-serif text-2xl text-[#F5F2EB] mt-1 mb-4">
                Submit an Attar Review
              </h3>

              {submitted ? (
                <div className="py-8 text-center text-emerald-400 flex flex-col items-center">
                  <Check className="w-10 h-10 mb-2" />
                  <p className="text-sm font-semibold">Review successfully published!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#F5F2EB] uppercase tracking-wider mb-1 font-medium">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asadullah Durrani"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#F5F2EB] uppercase tracking-wider mb-1 font-medium">
                        City *
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#F5F2EB] uppercase tracking-wider mb-1 font-medium">
                        Rating *
                      </label>
                      <select
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value={5}>5 Stars - Magnificent</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Good</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#F5F2EB] uppercase tracking-wider mb-1 font-medium">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#F5F2EB] uppercase tracking-wider mb-1 font-medium">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Unrivalled Cambodian Oud longevity"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#F5F2EB] uppercase tracking-wider mb-1 font-medium">
                      Detailed Review *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the scent progression, longevity, compliments received..."
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold uppercase tracking-wider text-xs transition-colors"
                  >
                    Publish Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
