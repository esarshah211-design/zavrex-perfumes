export type FragranceSize = '6ml' | '12ml' | '30ml';

export type FragranceCategory = 
  | "Men's Collection"
  | "Women's Collection"
  | "Unisex Collection"
  | "Arabian Oud"
  | "Musk Collection"
  | "Signature Collection";

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: FragranceCategory;
  description: string;
  prices: Record<FragranceSize, number>;
  originalPrices?: Record<FragranceSize, number>;
  images: string[];
  notes: FragranceNotes;
  concentration: string;
  longevity: string;
  sillage: string;
  stock: Record<FragranceSize, number>;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSignature?: boolean;
  rating: number;
  reviewsCount: number;
  origin?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  category: string;
  size: FragranceSize;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';

export interface CustomerDetails {
  fullName: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  promoCode?: string;
  total: number;
  paymentMethod: 'cod' | 'bank_transfer';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minSpend?: number;
  active: boolean;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroImage: string;
  whatsappNumber: string;
  location: string;
  announcementText: string;
  instagramUrl: string;
  tiktokUrl: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
  promoCodes: PromoCode[];
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}
