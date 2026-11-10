import { Product, Order, Review, BrandSettings, ContactInquiry } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_SETTINGS } from '../data/initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'zavrex_products_v1',
  ORDERS: 'zavrex_orders_v1',
  REVIEWS: 'zavrex_reviews_v1',
  SETTINGS: 'zavrex_settings_v1',
  INQUIRIES: 'zavrex_inquiries_v1',
  ADMIN_AUTH: 'zavrex_admin_session_v1',
};

// Storage helper
export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading products from storage:', e);
    return INITIAL_PRODUCTS;
  }
};

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('zavrex_products_updated'));
  } catch (e) {
    console.error('Error saving products:', e);
  }
};

export const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading orders:', e);
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('zavrex_orders_updated'));
  } catch (e) {
    console.error('Error saving orders:', e);
  }
};

export const getStoredReviews = (): Review[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading reviews:', e);
    return INITIAL_REVIEWS;
  }
};

export const saveReviews = (reviews: Review[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new Event('zavrex_reviews_updated'));
  } catch (e) {
    console.error('Error saving reviews:', e);
  }
};

export const getStoredSettings = (): BrandSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading settings:', e);
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = (settings: BrandSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('zavrex_settings_updated'));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
};

export const getStoredInquiries = (): ContactInquiry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveInquiry = (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'read'>): ContactInquiry => {
  const newInq: ContactInquiry = {
    ...inquiry,
    id: 'inq_' + Date.now(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  const list = [newInq, ...getStoredInquiries()];
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(list));
  return newInq;
};

// Order creation with unique sequential / timestamp code
export const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const year = now.getFullYear();
  const orderNumber = `ZVX-${year}-${randomSuffix}`;
  
  const newOrder: Order = {
    ...orderData,
    id: `ord_${Date.now()}`,
    orderNumber,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  // Save locally
  const orders = [newOrder, ...getStoredOrders()];
  saveOrders(orders);

  // Sync to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        customer: newOrder.customer,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        delivery_fee: newOrder.deliveryFee,
        discount_amount: newOrder.discountAmount,
        promo_code: newOrder.promoCode,
        total: newOrder.total,
        payment_method: newOrder.paymentMethod,
        status: newOrder.status,
        notes: newOrder.customer.notes || null,
        created_at: newOrder.createdAt,
        updated_at: newOrder.updatedAt,
      });
    } catch (err) {
      console.warn('Supabase sync skipped/failed:', err);
    }
  }

  // Deduct inventory
  const products = getStoredProducts();
  newOrder.items.forEach(item => {
    const prod = products.find(p => p.id === item.productId);
    if (prod && prod.stock && prod.stock[item.size]) {
      prod.stock[item.size] = Math.max(0, prod.stock[item.size] - item.quantity);
    }
  });
  saveProducts(products);

  return newOrder;
};

// Admin authentication helpers
export const checkAdminAuth = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'authenticated';
  } catch {
    return false;
  }
};

export const setAdminAuth = (authenticated: boolean): void => {
  if (authenticated) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'authenticated');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};

// WhatsApp link generator
export const generateWhatsAppLink = (phone: string, text: string): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};
