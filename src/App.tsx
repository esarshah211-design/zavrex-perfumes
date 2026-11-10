import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { getStoredProducts } from './lib/storage';
import { Product } from './types';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroSection } from './components/HeroSection';
import { HomeSections } from './components/HomeSections';
import { ShopCollection } from './components/ShopCollection';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { BrandStorySection } from './components/BrandStorySection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { ContactView } from './components/ContactView';
import { AdminDashboard } from './components/AdminDashboard';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { SearchModal } from './components/SearchModal';
import { WishlistView } from './components/WishlistView';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeView, selectedProduct, setSelectedProduct } = useCart();
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync products when modified from Admin Panel
  useEffect(() => {
    const handleProductsUpdate = () => {
      setProducts(getStoredProducts());
    };
    window.addEventListener('zavrex_products_updated', handleProductsUpdate);
    return () => window.removeEventListener('zavrex_products_updated', handleProductsUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F2EB] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Top Announcement Bar */}
      {activeView !== 'admin' && <AnnouncementBar />}

      {/* Main Top Navigation */}
      {activeView !== 'admin' && (
        <Navbar onSearchClick={() => setIsSearchOpen(true)} />
      )}

      {/* Active View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection />
            <HomeSections
              products={products}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
            <CustomerReviewsSection />
          </>
        )}

        {activeView === 'shop' && (
          <ShopCollection
            products={products}
            initialCategory="All"
          />
        )}

        {activeView === 'shop-oud' && (
          <ShopCollection
            products={products}
            initialCategory="Arabian Oud"
          />
        )}

        {activeView === 'product-details' && selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            isFullPage={true}
          />
        )}

        {activeView === 'wishlist' && (
          <WishlistView
            products={products}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {activeView === 'about' && (
          <BrandStorySection isStandalonePage={true} />
        )}

        {activeView === 'reviews' && (
          <CustomerReviewsSection isStandalonePage={true} />
        )}

        {activeView === 'contact' && <ContactView />}

        {activeView === 'checkout' && <CheckoutView />}

        {activeView === 'order-confirmation' && <OrderConfirmationModal />}

        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Quick View Modal if triggered from home or shop */}
      {quickViewProduct && (
        <ProductDetailsModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
      />

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer />

      {/* Floating WhatsApp Button */}
      {activeView !== 'admin' && <WhatsAppFloatingButton />}

      {/* Mobile Bottom Thumb Navigation */}
      {activeView !== 'admin' && <MobileBottomNav />}

      {/* Luxury Brand Footer */}
      {activeView !== 'admin' && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
