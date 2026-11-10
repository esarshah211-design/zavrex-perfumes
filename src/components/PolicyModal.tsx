import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

interface PolicyModalProps {
  policyType: 'privacy' | 'terms' | 'shipping' | 'returns' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policyType, onClose }) => {
  if (!policyType) return null;

  const policies = {
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-xs text-[#C8C5BD] leading-relaxed">
          <p>
            At <strong>ZAVREX</strong>, accessible from our official website, the privacy of our distinguished clientele is of paramount importance. This document outlines the types of personal information received and how it is secured.
          </p>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">1. Information Collection</h4>
          <p>
            When you place an order or contact us, we collect necessary dispatch information including your recipient name, phone number, WhatsApp contact, city, and delivery street address. We do not sell, rent, or trade customer contact details with third-party advertisers.
          </p>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">2. Use of Information</h4>
          <p>
            Customer information is exclusively utilized to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#9E9B95]">
            <li>Process, pack, and dispatch your luxury attar shipments from Peshawar.</li>
            <li>Send order confirmation and live delivery tracking messages via SMS or WhatsApp.</li>
            <li>Respond to concierge inquiries, recommendations, and customer support.</li>
          </ul>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">3. Payment Information Security</h4>
          <p>
            For Cash on Delivery (COD), no financial banking details are stored on our servers. For Direct Bank Transfers, transaction verification screenshots are kept securely only until payment reconciliation.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      content: (
        <div className="space-y-4 text-xs text-[#C8C5BD] leading-relaxed">
          <p>
            Welcome to <strong>ZAVREX</strong>. By accessing this website or purchasing our artisanal attars, you agree to comply with and be bound by the following terms.
          </p>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">1. Product Authenticity</h4>
          <p>
            All ZAVREX fragrances are 100% pure concentrated perfume oils (attars), free from denatured ethyl alcohol. Formulations are handcrafted in Peshawar using premium natural botanicals and aged resins.
          </p>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">2. Pricing & Orders</h4>
          <p>
            All prices are stated in Pakistani Rupees (PKR) and include packaging. ZAVREX reserves the right to adjust product pricing, seasonal promotional discounts, or batch allocations without prior notice.
          </p>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">3. Intellectual Property</h4>
          <p>
            All brand assets, photography, brand taglines ("Beyond Fragrance. Beyond Ordinary."), and editorial descriptions are the intellectual property of ZAVREX.
          </p>
        </div>
      ),
    },
    shipping: {
      title: 'Nationwide Shipping Policy',
      icon: Truck,
      content: (
        <div className="space-y-4 text-xs text-[#C8C5BD] leading-relaxed">
          <p>
            ZAVREX dispatches all orders directly from our atelier in Peshawar, Khyber Pakhtunkhwa to all major cities and remote towns across Pakistan.
          </p>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">1. Delivery Timelines</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-[#9E9B95]">
            <li><strong>Peshawar City:</strong> Same-day or next-day express courier (within 24 hours).</li>
            <li><strong>Major Metros (Islamabad, Rawalpindi, Lahore, Karachi, Faisalabad):</strong> 2 to 3 business days.</li>
            <li><strong>Other Cities &amp; Regional Towns:</strong> 3 to 4 business days.</li>
          </ul>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">2. Shipping Charges</h4>
          <p>
            Orders totaling <strong>PKR 4,000 or more</strong> qualify for <strong>Complimentary Express Delivery</strong> anywhere in Pakistan. For orders below this threshold, a standard courier fee of PKR 250 is applied.
          </p>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">3. Packaging Security</h4>
          <p>
            Every crystal attar bottle is cushioned inside our custom velvet-lined rigid presentation box and weather-resistant security mailer to ensure flawless arrival.
          </p>
        </div>
      ),
    },
    returns: {
      title: 'Return & Exchange Policy',
      icon: RotateCcw,
      content: (
        <div className="space-y-4 text-xs text-[#C8C5BD] leading-relaxed">
          <p>
            Because artisanal perfume oils are intimate luxury goods, we maintain strict quality control standards.
          </p>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">1. Damaged or Defective In Transit</h4>
          <p>
            If your parcel arrives damaged or with any leakage, notify our WhatsApp concierge (+923109554240) within 48 hours of receipt with a photo of the package. We will immediately dispatch a fresh replacement bottle free of charge.
          </p>
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">2. Scent Satisfaction Guarantee</h4>
          <p>
            We take pride in our formulations. If you are unsure which scent profile suits you best, we encourage trying our 6ml bottles or consulting with our fragrance specialists via WhatsApp prior to placing larger orders.
          </p>
        </div>
      ),
    },
  };

  const current = policies[policyType];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121216] border border-[#25252B] p-6 sm:p-8 max-w-xl w-full text-left relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8B84] hover:text-[#F5F2EB] p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded">
            <Icon className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h3 className="font-serif text-2xl text-[#F5F2EB]">{current.title}</h3>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {current.content}
        </div>

        <div className="mt-6 pt-4 border-t border-[#202026] text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#D4AF37] text-black text-xs uppercase font-semibold tracking-wider hover:bg-[#E5C378] transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
