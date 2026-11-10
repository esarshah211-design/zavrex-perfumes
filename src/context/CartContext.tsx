import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, FragranceSize, BrandSettings, Order } from '../types';
import { getStoredSettings } from '../lib/storage';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: FragranceSize, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  promoCode: string;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  settings: BrandSettings;
  updateSettingsState: (newSettings: BrandSettings) => void;
  // Navigation / views
  activeView: string;
  setActiveView: (view: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BrandSettings>(getStoredSettings());
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zavrex_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
      return 'admin';
    }
    return 'home';
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zavrex_wishlist_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep browser URL synchronized with views
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activeView === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else if (activeView === 'home') {
      if (window.location.pathname === '/admin') {
        window.history.pushState(null, '', '/');
      }
    }
  }, [activeView]);

  // Support browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        setActiveView('admin');
      } else {
        setActiveView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('zavrex_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    try {
      localStorage.setItem('zavrex_wishlist_v1', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlist]);

  // Listen to settings update events
  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(getStoredSettings());
    };
    window.addEventListener('zavrex_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('zavrex_settings_updated', handleSettingsUpdate);
  }, []);

  const updateSettingsState = (newSettings: BrandSettings) => {
    setSettings(newSettings);
  };

  const addToCart = (product: Product, size: FragranceSize, quantity: number = 1) => {
    const cartItemId = `${product.id}-${size}`;
    const price = product.prices[size] || 0;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          image: product.images[0] || '',
          category: product.category,
          size,
          price,
          quantity,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoDiscountPercent(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Calculations
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Delivery charges
  const deliveryFee =
    cart.length === 0
      ? 0
      : subtotal >= (settings.freeDeliveryThreshold || 4000)
      ? 0
      : (settings.standardDeliveryFee || 250);

  // Promo code
  const discountAmount = appliedPromo ? Math.round((subtotal * promoDiscountPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const normalized = code.trim().toUpperCase();
    const match = settings.promoCodes?.find(
      p => p.code.toUpperCase() === normalized && p.active
    );

    if (!match) {
      return { success: false, message: 'Invalid promo code.' };
    }

    if (match.minSpend && subtotal < match.minSpend) {
      return {
        success: false,
        message: `This promo requires a minimum spend of PKR ${match.minSpend.toLocaleString()}.`,
      };
    }

    setAppliedPromo(match.code);
    setPromoDiscountPercent(match.discountPercent);
    return {
      success: true,
      message: `Promo code applied! Enjoy ${match.discountPercent}% off your order.`,
    };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoDiscountPercent(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
        promoCode: appliedPromo || '',
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        isCartOpen,
        setIsCartOpen,
        settings,
        updateSettingsState,
        activeView,
        setActiveView,
        selectedProduct,
        setSelectedProduct,
        lastPlacedOrder,
        setLastPlacedOrder,
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
