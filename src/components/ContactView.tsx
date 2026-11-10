import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { saveInquiry, generateWhatsAppLink } from '../lib/storage';
import { MessageCircle, MapPin, Mail, Clock, Send, CheckCircle2, Instagram } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { settings } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    saveInquiry({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    });

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 3000);
  };

  const handleDirectWhatsApp = () => {
    const text = `Salam ZAVREX, my name is ${formData.name || 'a fragrance enthusiast'}. I have an inquiry: ${formData.message || 'I would like to inquire about your attar collections.'}`;
    window.open(generateWhatsAppLink(settings.whatsappNumber, text), '_blank');
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#0B0B0C] text-[#F5F2EB]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-2 block">
            Atelier Concierge
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-tight text-[#F5F2EB] mb-4">
            Connect With ZAVREX
          </h1>
          <p className="text-sm text-[#8E8B84] font-light max-w-xl mx-auto">
            Whether seeking custom attar formulation, wholesale inquiries, or assistance with an order, our Peshawar team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Contact Channels & Location */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary WhatsApp Card */}
            <div className="p-6 bg-[#141C16] border border-[#25D366]/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-[#25D366] text-black rounded-full">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#F5F2EB]">
                    WhatsApp Direct Concierge
                  </h3>
                  <p className="text-xs text-[#25D366] font-mono font-medium">
                    {settings.whatsappNumber}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#8E8B84] mb-4">
                Fastest response for perfume consultations, customized gifts, and instant order confirmations.
              </p>
              <a
                href={generateWhatsAppLink(
                  settings.whatsappNumber,
                  'Salam ZAVREX, I am reaching out from your website contact page.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#32E875] text-black font-semibold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>

            {/* Location & Details Card (Strictly without invented street address) */}
            <div className="p-6 bg-[#121216] border border-[#25252B] space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#F5F2EB] uppercase tracking-wider text-[11px] mb-0.5">
                    Artisanal Atelier Location
                  </h4>
                  <p className="text-[#C8C5BD] text-sm">
                    {settings.location}
                  </p>
                  <p className="text-[11px] text-[#7A7873] mt-0.5">
                    Handcrafted in Peshawar, dispatched nationwide across Pakistan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#1C1C22]">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#F5F2EB] uppercase tracking-wider text-[11px] mb-0.5">
                    Concierge Hours
                  </h4>
                  <p className="text-[#C8C5BD]">
                    Monday – Saturday: 10:00 AM – 10:00 PM (PKT)
                  </p>
                  <p className="text-[11px] text-[#7A7873] mt-0.5">
                    Sunday: WhatsApp Inquiries Active
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#1C1C22]">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#F5F2EB] uppercase tracking-wider text-[11px] mb-0.5">
                    Official Email
                  </h4>
                  <p className="text-[#C8C5BD]">
                    concierge@zavrex.com
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="p-6 bg-[#121216] border border-[#25252B]">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-3">
                Connect on Social Channels
              </h4>
              <div className="flex flex-col gap-2.5">
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-[#0E0E12] border border-[#25252B] hover:border-[#D4AF37] text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[#F5F2EB] group-hover:text-[#D4AF37]">Instagram @zavrex.pk</span>
                  </div>
                  <span className="text-[10px] text-[#8E8B84]">Follow ↗</span>
                </a>

                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-[#0E0E12] border border-[#25252B] hover:border-[#D4AF37] text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#D4AF37]">♪</span>
                    <span className="text-[#F5F2EB] group-hover:text-[#D4AF37]">TikTok @zavrex.official</span>
                  </div>
                  <span className="text-[10px] text-[#8E8B84]">Follow ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-[#121216] border border-[#25252B] p-6 sm:p-8">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Send a Dispatch Inquiry
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#F5F2EB] mt-1 mb-6">
              How May We Serve You?
            </h3>

            {sent ? (
              <div className="py-16 text-center space-y-4 text-emerald-400">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h4 className="font-serif text-2xl text-[#F5F2EB]">Message Received</h4>
                <p className="text-xs text-[#8E8B84] max-w-sm mx-auto">
                  Thank you for reaching out to ZAVREX. Our team will review your inquiry and connect via WhatsApp or phone promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div>
                  <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sardar Hamza Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-2">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0310 9554240"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-2">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Inquire about fragrance notes, custom bottle engraving, wholesale distribution..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0E0E12] border border-[#2A2A32] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectWhatsApp}
                    className="px-6 py-3.5 bg-[#142A1C] hover:bg-[#1A3825] border border-[#25D366]/50 text-[#25D366] font-semibold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
