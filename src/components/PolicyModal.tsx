import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

export type PolicyType = 'privacy' | 'terms' | 'shipping' | 'returns';

interface PolicyModalProps {
  policyType: PolicyType | null;
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
            At <strong>ZAVREX</strong> (Peshawar, Khyber Pakhtunkhwa, Pakistan), the privacy and security of our esteemed patrons is an uncompromising commitment. This Privacy Policy discloses the protocols governing personal data collected through our website and concierge communications.
          </p>
          
          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">1. Personal Information Collected</h4>
          <p>
            When placing an order, inquiring through WhatsApp, or submitting appraisals, we strictly collect only information necessary for fulfillment and support:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#9E9B95]">
            <li>Full Name and recipient identity.</li>
            <li>Direct contact phone number and WhatsApp number for courier dispatch alerts.</li>
            <li>Delivery destination: City, province, and complete residential or business address.</li>
            <li>Special courier instructions or landmark details.</li>
          </ul>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">2. Strict Non-Disclosure &amp; Zero Advertising Sale</h4>
          <p>
            ZAVREX operates on an absolute confidentiality pledge. <strong>We never sell, rent, monetize, or disclose your personal records to third-party marketing brokers or ad networks.</strong> Customer data is transmitted solely to our certified courier dispatch partners for order conveyance.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">3. Payment &amp; Financial Security</h4>
          <p>
            For Cash on Delivery (COD), no credit card or sensitive banking credentials are ever requested or stored on our servers. For Direct Bank Transfer transactions, payment verification receipts are processed privately and held only until courier confirmation.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">4. Patron Data Rights &amp; Erasure</h4>
          <p>
            You retain full rights to request verification, modification, or complete permanent deletion of your stored dispatch records at any time by messaging our concierge on WhatsApp (+923109554240) or emailing our team.
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
            Welcome to the official digital boutique of <strong>ZAVREX</strong>. By accessing this platform or ordering our artisanal attars, you acknowledge and agree to the following terms and commercial guidelines.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">1. Artisanal Formulation &amp; Authenticity</h4>
          <p>
            Every fragrance bearing the ZAVREX seal is an authentic, 100% concentrated perfume oil (attar), completely free from denatured ethyl alcohol, aerosol propellants, and artificial fillers. Natural botanical variations may occur between harvests of wild Taif rose petals, Assam agarwood, and Kashmiri saffron.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">2. Pricing, Packaging &amp; Orders</h4>
          <p>
            All listed prices are denominated in Pakistani Rupees (PKR) and encompass bespoke velvet-lined presentation packaging. We reserve the prerogative to adjust batch pricing, promotional privileges, and seasonal allocations without retroactive liability.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">3. Order Placement &amp; Verification</h4>
          <p>
            Submission of an order constitutes an offer to purchase. Cash on Delivery orders may receive a brief telephonic or WhatsApp confirmation before dispatch from Peshawar. We reserve the right to cancel orders with unverified contact information.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">4. Intellectual Property</h4>
          <p>
            The ZAVREX trademark, crest, brand identity, signature packaging aesthetics, and the motto "Beyond Fragrance. Beyond Ordinary." are protected intellectual property. Unauthorized commercial reproduction is strictly prohibited.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">5. Governing Jurisdiction</h4>
          <p>
            These terms are governed exclusively by the laws of Pakistan, with exclusive legal jurisdiction residing in Peshawar, Khyber Pakhtunkhwa.
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
            Every ZAVREX creation is packaged and dispatched directly from our master atelier in Peshawar, Khyber Pakhtunkhwa, reaching all cities, cantts, and regional towns throughout Pakistan.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">1. Estimated Transit Timelines</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-[#9E9B95]">
            <li><strong>Peshawar Metropolitan Area:</strong> Same-day or 24-hour priority courier.</li>
            <li><strong>Major Cities (Islamabad, Rawalpindi, Lahore, Karachi, Faisalabad, Multan, Quetta):</strong> 2 to 3 business days.</li>
            <li><strong>Regional Towns &amp; Northern Areas:</strong> 3 to 4 business days.</li>
          </ul>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">2. Complimentary Shipping Threshold</h4>
          <p>
            Orders totaling <strong>PKR 4,000 or more</strong> qualify automatically for <strong>Complimentary Express Shipping</strong> anywhere across Pakistan. For orders below this threshold, a modest courier delivery fee of PKR 250 is applied.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">3. Luxury Presentation &amp; Transit Security</h4>
          <p>
            Each crystal attar flacon is nestled inside our custom rigid presentation box and protected by tamper-evident waterproof outer courier wrapping to guarantee pristine delivery.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">4. Live WhatsApp Consignment Tracking</h4>
          <p>
            Upon courier booking, customers receive an automated notification containing their tracking consignment number and a direct tracking link via WhatsApp or SMS.
          </p>
        </div>
      ),
    },
    returns: {
      title: 'Return & Refund Policy',
      icon: RotateCcw,
      content: (
        <div className="space-y-4 text-xs text-[#C8C5BD] leading-relaxed">
          <p>
            At <strong>ZAVREX</strong>, we stand behind the exceptional quality of our artisanal attars. Because concentrated perfume oils are intimate luxury sensory creations, our return and refund guidelines ensure fairness and complete peace of mind.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">1. Transit Damage &amp; Leakage Guarantee (100% Covered)</h4>
          <p>
            If your parcel arrives damaged, broken, or exhibiting bottle leakage during courier transit:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#9E9B95]">
            <li>Notify our WhatsApp concierge (+923109554240) within <strong>48 hours</strong> of parcel receipt.</li>
            <li>Share a brief photo or video of the affected flacon and packaging.</li>
            <li>We will <strong>immediately dispatch a fresh replacement flacon at zero cost</strong> or issue a <strong>100% full monetary refund</strong> according to your preference.</li>
          </ul>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">2. Unopened Exchange Policy (7 Days)</h4>
          <p>
            If you wish to exchange an unopened fragrance flacon for an alternate scent profile in our collection, you may do so within <strong>7 days</strong> of delivery, provided the bottle seal remains intact and original luxury packaging is preserved.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">3. Refund Processing Method &amp; Timelines</h4>
          <p>
            Approved monetary refunds are processed within <strong>2 to 3 business days</strong> via Direct Bank Transfer, JazzCash, or EasyPaisa directly to the patron's designated account.
          </p>

          <h4 className="font-semibold text-[#F5F2EB] text-sm pt-2">4. Pre-Dispatch Order Cancellation</h4>
          <p>
            If you need to amend or cancel an order, simply message our team on WhatsApp (+923109554240) before your order is handed to the courier service. No cancellation fees apply.
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
