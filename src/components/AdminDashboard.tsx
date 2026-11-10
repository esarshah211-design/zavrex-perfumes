import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import {
  getStoredProducts,
  saveProducts,
  getStoredOrders,
  saveOrders,
  getStoredSettings,
  saveSettings,
  getStoredReviews,
  saveReviews,
  getStoredInquiries,
} from '../lib/storage';
import {
  loginAdmin,
  logoutAdmin,
  isCurrentAdminAuthenticated,
  changeAdminPassword,
  requestPasswordReset,
  resetAdminPasswordWithRecovery,
} from '../lib/auth';
import { Product, Order, OrderStatus, FragranceCategory, BrandSettings, Review } from '../types';
import { SQL_SCHEMA_BLUEPRINT, isSupabaseConfigured } from '../lib/supabase';
import {
  Shield,
  Package,
  ShoppingBag,
  Settings as SettingsIcon,
  MessageSquare,
  Database,
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  DollarSign,
  Search,
  Copy,
  Check,
  Eye,
  EyeOff,
  X,
  ExternalLink,
  Sparkles,
  KeyRound,
  AlertCircle,
  Mail,
  Key,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { setActiveView, updateSettingsState } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isCurrentAdminAuthenticated);
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Security / Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Password Recovery / Forgot Password state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('admin@zavrex.com');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState('');
  const [showRecoveryPassword, setShowRecoveryPassword] = useState(false);
  const [showRecoveryConfirmPassword, setShowRecoveryConfirmPassword] = useState(false);
  const [recoveryStatus, setRecoveryStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState<'link' | 'key'>('key');

  // Dashboard Data State
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);
  const [settings, setLocalSettings] = useState<BrandSettings>(getStoredSettings);
  const [reviews, setReviews] = useState<Review[]>(getStoredReviews);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'website' | 'reviews' | 'security' | 'supabase'>('overview');

  // Product Editor Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Search & Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Authentication Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await loginAdmin(loginUsername, loginPassword);
      if (res.success) {
        setIsAuthenticated(true);
        setLoginPassword('');
      } else {
        setLoginError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setLoginPassword('');
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus({ success: false, message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordChangeStatus({ success: false, message: 'Password must be at least 8 characters in length.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changeAdminPassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordChangeStatus({
          success: true,
          message: 'Password successfully updated in Supabase Auth and secure credentials store.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordChangeStatus({
          success: false,
          message: res.error || 'Failed to update password. Verify current password.',
        });
      }
    } catch (err: any) {
      setPasswordChangeStatus({ success: false, message: err.message || 'Failed to update password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRequestResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecovering(true);
    setRecoveryStatus(null);
    try {
      const res = await requestPasswordReset(forgotEmail);
      setRecoveryStatus({ success: res.success, message: res.message });
    } catch (err: any) {
      setRecoveryStatus({ success: false, message: err.message || 'Failed to dispatch reset request.' });
    } finally {
      setIsRecovering(false);
    }
  };

  const handleResetWithRecoveryKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryStatus(null);

    if (recoveryNewPassword !== recoveryConfirmPassword) {
      setRecoveryStatus({ success: false, message: 'New password and confirmation do not match.' });
      return;
    }

    if (recoveryNewPassword.length < 8) {
      setRecoveryStatus({ success: false, message: 'Password must be at least 8 characters in length.' });
      return;
    }

    setIsRecovering(true);
    try {
      const res = await resetAdminPasswordWithRecovery(recoveryKey, recoveryNewPassword);
      if (res.success) {
        setRecoveryStatus({
          success: true,
          message: 'Password successfully reset! You can now log in with your new password.',
        });
        setRecoveryKey('');
        setRecoveryNewPassword('');
        setRecoveryConfirmPassword('');
      } else {
        setRecoveryStatus({ success: false, message: res.error || 'Recovery failed.' });
      }
    } catch (err: any) {
      setRecoveryStatus({ success: false, message: err.message || 'Recovery failed.' });
    } finally {
      setIsRecovering(false);
    }
  };


  // Order Status Update
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    );
    setOrders(updated);
    saveOrders(updated);
    if (selectedOrderDetails?.id === orderId) {
      setSelectedOrderDetails({ ...selectedOrderDetails, status: newStatus });
    }
  };

  // Product Management
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updatedProducts: Product[];
    const exists = products.some((p) => p.id === editingProduct.id);

    if (exists) {
      updatedProducts = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    } else {
      updatedProducts = [editingProduct, ...products];
    }

    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to remove this fragrance from the catalog?')) {
      const updated = products.filter((p) => p.id !== productId);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  const handleNewProduct = () => {
    const newProd: Product = {
      id: `zvx-${Date.now()}`,
      name: 'New Fragrance',
      tagline: 'Pure non-alcoholic attar extract',
      category: 'Arabian Oud',
      description: 'Handcrafted luxury attar formulated in Peshawar atelier.',
      prices: { '6ml': 3200, '12ml': 5900, '30ml': 12500 },
      images: ['/src/assets/images/hero_zavrex_attar_1794350867556.jpg'],
      notes: {
        top: ['Citrus', 'Cardamom'],
        heart: ['Taif Rose', 'Oud'],
        base: ['Ambergris', 'Sandalwood'],
      },
      concentration: '100% Pure Perfume Oil (Attar)',
      longevity: '24+ Hours',
      sillage: 'Heavy & Royal',
      stock: { '6ml': 20, '12ml': 15, '30ml': 5 },
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: true,
      origin: 'Peshawar Atelier',
    };
    setEditingProduct(newProd);
    setIsProductModalOpen(true);
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    updateSettingsState(settings);
    alert('ZAVREX Brand and Website Settings successfully saved!');
  };

  // Copy SQL
  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_BLUEPRINT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Calculations for overview KPIs
  const totalSales = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const averageOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.includes(q);
      const matchCity = o.customer.city.toLowerCase().includes(q);
      return matchNum || matchName || matchPhone || matchCity;
    }
    return true;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-20 px-4 bg-[#0B0B0C] flex items-center justify-center">
        <div className="max-w-md w-full bg-[#121216] border border-[#D4AF37]/30 p-8 shadow-2xl text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Administrative Access
          </span>
          <h1 className="font-serif text-3xl text-[#F5F2EB] mt-1 mb-2">ZAVREX Admin Portal</h1>
          <p className="text-xs text-[#8E8B84] mb-6">
            Authorized management for catalog, orders, and website settings.
          </p>

          {loginError && (
            <div className="p-3 mb-4 bg-red-950/40 border border-red-500/40 text-red-300 text-xs text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left text-xs">
            <div>
              <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                Admin Username or Email
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2.5 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[10px] text-[#7A7873] mt-0.5 block">
                Default username: <strong className="text-[#D4AF37]">admin</strong>
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPasswordModal(true);
                    setRecoveryStatus(null);
                  }}
                  className="text-[11px] text-[#D4AF37] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-10 py-2.5 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8B84] hover:text-[#F5F2EB] p-1"
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-[#7A7873] mt-0.5 block">
                Protected via Supabase Auth &amp; salted cryptographic verification
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold uppercase tracking-wider text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1F1F26] flex items-center justify-between text-xs text-[#8E8B84]">
            <span className="text-[11px] text-[#7A7873] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Authorized personnel only</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="text-[#D4AF37] hover:underline"
            >
              Back to Store
            </button>
          </div>

          {/* Forgot Password Modal */}
          {showForgotPasswordModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 text-left text-xs">
              <div className="bg-[#121216] border border-[#25252B] p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
                <button
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="absolute top-4 right-4 text-[#8E8B84] hover:text-[#F5F2EB]"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1">
                  <KeyRound className="w-4 h-4" />
                  <span>Password Recovery</span>
                </div>
                <h3 className="font-serif text-2xl text-[#F5F2EB] mb-2">Reset Admin Password</h3>
                <p className="text-xs text-[#8E8B84] mb-4">
                  Recover access through Supabase Auth or your Master Security Recovery Key.
                </p>

                {/* Recovery Mode Selector */}
                <div className="flex items-center gap-2 p-1 bg-[#0E0E12] border border-[#25252B] mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMode('key');
                      setRecoveryStatus(null);
                    }}
                    className={`flex-1 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      recoveryMode === 'key' ? 'bg-[#D4AF37] text-black shadow' : 'text-[#8E8B84] hover:text-[#F5F2EB]'
                    }`}
                  >
                    Master Recovery Key
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMode('link');
                      setRecoveryStatus(null);
                    }}
                    className={`flex-1 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      recoveryMode === 'link' ? 'bg-[#D4AF37] text-black shadow' : 'text-[#8E8B84] hover:text-[#F5F2EB]'
                    }`}
                  >
                    Supabase Reset Link
                  </button>
                </div>

                {recoveryStatus && (
                  <div
                    className={`p-3 mb-4 text-xs flex items-center gap-2 ${
                      recoveryStatus.success
                        ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                        : 'bg-red-950/60 border border-red-500/50 text-red-300'
                    }`}
                  >
                    {recoveryStatus.success ? (
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    )}
                    <span>{recoveryStatus.message}</span>
                  </div>
                )}

                {recoveryMode === 'key' ? (
                  <form onSubmit={handleResetWithRecoveryKey} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold">
                          Master Recovery Key *
                        </label>
                        <button
                          type="button"
                          onClick={() => setRecoveryKey('ZAVREX-PESHAWAR-2026')}
                          className="text-[10px] text-[#D4AF37] hover:underline"
                        >
                          Use Default Key
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ZAVREX-PESHAWAR-2026"
                        value={recoveryKey}
                        onChange={(e) => setRecoveryKey(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] font-mono focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                        New Password (min 8 chars) *
                      </label>
                      <div className="relative">
                        <input
                          type={showRecoveryPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={recoveryNewPassword}
                          onChange={(e) => setRecoveryNewPassword(e.target.value)}
                          className="w-full pl-3 pr-10 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRecoveryPassword(!showRecoveryPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8B84] hover:text-[#F5F2EB] p-1"
                          aria-label={showRecoveryPassword ? 'Hide password' : 'Show password'}
                        >
                          {showRecoveryPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showRecoveryConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={recoveryConfirmPassword}
                          onChange={(e) => setRecoveryConfirmPassword(e.target.value)}
                          className="w-full pl-3 pr-10 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRecoveryConfirmPassword(!showRecoveryConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8B84] hover:text-[#F5F2EB] p-1"
                          aria-label={showRecoveryConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showRecoveryConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isRecovering}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold uppercase tracking-wider text-xs transition-colors disabled:opacity-50"
                    >
                      {isRecovering ? 'Resetting...' : 'Reset Password Now'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRequestResetLink} className="space-y-4">
                    <div>
                      <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                        Administrator Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="admin@zavrex.com"
                        className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isRecovering}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold uppercase tracking-wider text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{isRecovering ? 'Dispatching...' : 'Send Supabase Reset Link'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard Interface
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F2EB] pb-24">
      {/* Admin Top Header */}
      <div className="bg-[#121216] border-b border-[#25252B] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold tracking-widest text-[#D4AF37]">
              ZAVREX
            </span>
            <span className="text-xs uppercase tracking-wider text-[#8E8B84] pl-3 border-l border-[#25252B]">
              Admin Control Panel
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveView('home')}
              className="hidden sm:inline-flex items-center gap-1.5 text-[#C8C5BD] hover:text-[#D4AF37]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-[#1F1F24] hover:bg-red-950/60 text-[#C8C5BD] hover:text-red-300 border border-[#25252B] transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#0E0E12] border-b border-[#202026] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 no-scrollbar text-xs font-medium uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#D4AF37] text-[#D4AF37] font-semibold'
                : 'border-transparent text-[#8E8B84] hover:text-[#F5F2EB]'
            }`}
          >
            Overview &amp; KPIs
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#D4AF37] text-[#D4AF37] font-semibold'
                : 'border-transparent text-[#8E8B84] hover:text-[#F5F2EB]'
            }`}
          >
            <span>Orders</span>
            {pendingOrders > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#D4AF37] text-[#D4AF37] font-semibold'
                : 'border-transparent text-[#8E8B84] hover:text-[#F5F2EB]'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('website')}
            className={`px-4 py-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'website'
                ? 'border-[#D4AF37] text-[#D4AF37] font-semibold'
                : 'border-transparent text-[#8E8B84] hover:text-[#F5F2EB]'
            }`}
          >
            Website Content &amp; Banners
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-[#D4AF37] text-[#D4AF37] font-semibold'
                : 'border-transparent text-[#8E8B84] hover:text-[#F5F2EB]'
            }`}
          >
            Client Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-[#D4AF37] text-[#D4AF37] font-semibold'
                : 'border-transparent text-[#8E8B84] hover:text-[#F5F2EB]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Security &amp; Password</span>
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'supabase'
                ? 'border-[#D4AF37] text-[#D4AF37] font-semibold'
                : 'border-transparent text-[#8E8B84] hover:text-[#F5F2EB]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase &amp; Deployment</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* ================= TAB 1: OVERVIEW & KPIS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#121216] border border-[#25252B]">
                <div className="flex items-center justify-between text-[#8E8B84] text-xs uppercase tracking-wider mb-2">
                  <span>Total Sales</span>
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-sans text-[#F5F2EB] tabular-nums">
                  ₨ {totalSales.toLocaleString()}
                </div>
                <p className="text-[11px] text-[#7A7873] mt-1">Across all validated orders</p>
              </div>

              <div className="p-5 bg-[#121216] border border-[#25252B]">
                <div className="flex items-center justify-between text-[#8E8B84] text-xs uppercase tracking-wider mb-2">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-sans text-[#F5F2EB] tabular-nums">
                  {orders.length}
                </div>
                <p className="text-[11px] text-[#D4AF37] mt-1">{pendingOrders} pending dispatch</p>
              </div>

              <div className="p-5 bg-[#121216] border border-[#25252B]">
                <div className="flex items-center justify-between text-[#8E8B84] text-xs uppercase tracking-wider mb-2">
                  <span>Active Catalog</span>
                  <Package className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-sans text-[#F5F2EB] tabular-nums">
                  {products.length} Fragrances
                </div>
                <p className="text-[11px] text-[#7A7873] mt-1">6ml, 12ml, 30ml flacons</p>
              </div>

              <div className="p-5 bg-[#121216] border border-[#25252B]">
                <div className="flex items-center justify-between text-[#8E8B84] text-xs uppercase tracking-wider mb-2">
                  <span>Average Order Value</span>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-sans text-[#F5F2EB] tabular-nums">
                  ₨ {averageOrderValue.toLocaleString()}
                </div>
                <p className="text-[11px] text-[#7A7873] mt-1">PKR per transaction</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#121216] border border-[#25252B] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl text-[#F5F2EB]">Recent Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#D4AF37] hover:underline uppercase tracking-wider"
                >
                  View All ({orders.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0E0E12] text-[#8E8B84] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C1C24] text-[#C8C5BD]">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-[#181820]">
                        <td className="p-3 font-mono font-bold text-[#D4AF37]">{order.orderNumber}</td>
                        <td className="p-3 text-[#F5F2EB] font-medium">{order.customer.fullName}</td>
                        <td className="p-3">{order.customer.city}</td>
                        <td className="p-3">{order.items.length} items</td>
                        <td className="p-3 font-semibold text-[#F5F2EB] tabular-nums">
                          ₨ {order.total.toLocaleString()}
                        </td>
                        <td className="p-3 uppercase text-[10px] text-[#8E8B84]">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                              order.status === 'delivered'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : order.status === 'dispatched'
                                ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                : order.status === 'confirmed'
                                ? 'bg-purple-950 text-purple-400 border border-purple-800'
                                : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#121216] border border-[#25252B] p-4 text-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7873]" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, phone, city..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#0E0E12] border border-[#25252B] text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#8E8B84]">Status Filter:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-[#0E0E12] border border-[#25252B] px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#121216] border border-[#25252B] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0E0E12] text-[#8E8B84] uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status &amp; Action</th>
                      <th className="p-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C1C24] text-[#C8C5BD]">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#181820]">
                        <td className="p-4 font-mono font-bold text-[#D4AF37]">{order.orderNumber}</td>
                        <td className="p-4 text-[11px] text-[#7A7873]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-[#F5F2EB]">{order.customer.fullName}</div>
                          <div className="text-[11px] text-[#8E8B84]">{order.customer.phone}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-[#F5F2EB]">{order.customer.city}</span>
                        </td>
                        <td className="p-4 font-bold text-[#F5F2EB] tabular-nums">
                          ₨ {order.total.toLocaleString()}
                        </td>
                        <td className="p-4 uppercase text-[10px] text-[#8E8B84]">
                          {order.paymentMethod === 'cod' ? 'COD' : 'Bank'}
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1 text-xs uppercase font-semibold border bg-[#0E0E12] focus:outline-none ${
                              order.status === 'delivered'
                                ? 'text-emerald-400 border-emerald-800'
                                : order.status === 'dispatched'
                                ? 'text-blue-400 border-blue-800'
                                : order.status === 'confirmed'
                                ? 'text-purple-400 border-purple-800'
                                : order.status === 'cancelled'
                                ? 'text-red-400 border-red-800'
                                : 'text-yellow-400 border-yellow-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="px-3 py-1 bg-[#202028] hover:bg-[#D4AF37] hover:text-black text-[#F5F2EB] text-xs transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Details Modal Popup */}
            {selectedOrderDetails && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#121216] border border-[#25252B] p-6 sm:p-8 max-w-2xl w-full text-left relative text-xs">
                  <button
                    onClick={() => setSelectedOrderDetails(null)}
                    className="absolute top-4 right-4 text-[#8E8B84] hover:text-[#F5F2EB]"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center justify-between pb-4 border-b border-[#202026] mb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">
                        Order Manifest
                      </span>
                      <h3 className="font-mono text-xl text-[#F5F2EB] font-bold">
                        {selectedOrderDetails.orderNumber}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 uppercase font-bold text-[11px] rounded ${
                        selectedOrderDetails.status === 'delivered'
                          ? 'bg-emerald-950 text-emerald-400'
                          : 'bg-yellow-950 text-yellow-400'
                      }`}
                    >
                      {selectedOrderDetails.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-[#0E0E12] border border-[#1F1F24]">
                    <div>
                      <span className="text-[#8E8B84] block mb-1">Customer Info:</span>
                      <p className="font-semibold text-sm text-[#F5F2EB]">
                        {selectedOrderDetails.customer.fullName}
                      </p>
                      <p className="text-[#C8C5BD]">Phone: {selectedOrderDetails.customer.phone}</p>
                      <p className="text-[#C8C5BD]">WhatsApp: {selectedOrderDetails.customer.whatsapp}</p>
                    </div>

                    <div>
                      <span className="text-[#8E8B84] block mb-1">Shipping Destination:</span>
                      <p className="text-[#F5F2EB] font-medium">{selectedOrderDetails.customer.city}</p>
                      <p className="text-[#8E8B84] leading-relaxed">{selectedOrderDetails.customer.address}</p>
                      {selectedOrderDetails.customer.notes && (
                        <p className="text-[#D4AF37] italic mt-1">Note: {selectedOrderDetails.customer.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="font-semibold text-xs text-[#F5F2EB] uppercase tracking-wider block mb-2">
                      Purchased Fragrance Items:
                    </span>
                    <div className="divide-y divide-[#1F1F26] border border-[#1F1F26]">
                      {selectedOrderDetails.items.map((item, i) => (
                        <div key={i} className="p-3 flex items-center justify-between bg-[#0E0E12]">
                          <div>
                            <span className="font-serif text-sm text-[#F5F2EB]">{item.name}</span>
                            <span className="text-xs text-[#D4AF37] ml-2">({item.size})</span>
                            <span className="text-xs text-[#8E8B84] ml-2">Qty: {item.quantity}</span>
                          </div>
                          <span className="font-semibold text-sm text-[#F5F2EB] tabular-nums">
                            ₨ {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#202026] space-y-1 text-right mb-6">
                    <p className="text-[#8E8B84]">Subtotal: ₨ {selectedOrderDetails.subtotal.toLocaleString()}</p>
                    <p className="text-[#8E8B84]">Delivery: ₨ {selectedOrderDetails.deliveryFee}</p>
                    {selectedOrderDetails.discountAmount > 0 && (
                      <p className="text-[#D4AF37]">- ₨ {selectedOrderDetails.discountAmount.toLocaleString()}</p>
                    )}
                    <p className="text-base font-bold text-[#F5F2EB]">
                      Total: <span className="text-[#D4AF37]">₨ {selectedOrderDetails.total.toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-[#202028] text-[#F5F2EB] hover:bg-[#2A2A35]"
                    >
                      Print Packing Slip
                    </button>
                    <button
                      onClick={() => setSelectedOrderDetails(null)}
                      className="px-5 py-2 bg-[#D4AF37] text-black font-semibold uppercase tracking-wider"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: PRODUCT MANAGEMENT ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-[#F5F2EB]">Fragrance Catalog</h3>
                <p className="text-xs text-[#8E8B84]">
                  Manage prices per size (6ml, 12ml, 30ml), stock count, olfactory notes, and descriptions.
                </p>
              </div>
              <button
                onClick={handleNewProduct}
                className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Attar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div key={prod.id} className="p-4 bg-[#121216] border border-[#25252B] flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[4/3] bg-[#0E0E10] mb-3 overflow-hidden border border-[#202026]">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[10px] uppercase font-bold text-[#D4AF37] bg-[#0B0B0C]/80 px-2 py-0.5 border border-[#D4AF37]/30">
                        {prod.category}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg text-[#F5F2EB] font-normal leading-tight mb-1">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-[#8E8B84] line-clamp-1 mb-3">{prod.tagline}</p>

                    <div className="p-2.5 bg-[#0E0E12] border border-[#1E1E24] mb-3 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#8E8B84]">6ml:</span>
                        <span className="font-medium text-[#F5F2EB] tabular-nums">₨ {prod.prices['6ml']?.toLocaleString()}</span>
                        <span className="text-[10px] text-[#7A7873]">({prod.stock['6ml'] ?? 0} in stock)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E8B84]">12ml:</span>
                        <span className="font-medium text-[#F5F2EB] tabular-nums">₨ {prod.prices['12ml']?.toLocaleString()}</span>
                        <span className="text-[10px] text-[#7A7873]">({prod.stock['12ml'] ?? 0} in stock)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E8B84]">30ml:</span>
                        <span className="font-medium text-[#F5F2EB] tabular-nums">₨ {prod.prices['30ml']?.toLocaleString()}</span>
                        <span className="text-[10px] text-[#7A7873]">({prod.stock['30ml'] ?? 0} in stock)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1C1C24]">
                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsProductModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#1F1F26] hover:bg-[#2A2A35] text-[#C8C5BD] hover:text-[#D4AF37] text-xs font-semibold uppercase tracking-wider flex items-center gap-1 border border-[#2A2A35]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 bg-[#1F1F26] hover:bg-red-950 text-[#8E8B84] hover:text-red-400 border border-[#2A2A35]"
                      title="Delete product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Edit / Add Modal */}
            {isProductModalOpen && editingProduct && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#121216] border border-[#25252B] p-6 sm:p-8 max-w-2xl w-full text-left relative text-xs my-8 max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setIsProductModalOpen(false)}
                    className="absolute top-4 right-4 text-[#8E8B84] hover:text-[#F5F2EB]"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="font-serif text-2xl text-[#F5F2EB] mb-4">
                    {editingProduct.id.startsWith('zvx-custom') || !products.some((p) => p.id === editingProduct.id)
                      ? 'Create New Fragrance'
                      : `Edit ${editingProduct.name}`}
                  </h3>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div>
                      <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                        Fragrance Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                          Category *
                        </label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              category: e.target.value as FragranceCategory,
                            })
                          }
                          className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="Men's Collection">Men's Collection</option>
                          <option value="Women's Collection">Women's Collection</option>
                          <option value="Unisex Collection">Unisex Collection</option>
                          <option value="Arabian Oud">Arabian Oud</option>
                          <option value="Musk Collection">Musk Collection</option>
                          <option value="Signature Collection">Signature Collection</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                          Tagline
                        </label>
                        <input
                          type="text"
                          value={editingProduct.tagline}
                          onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                        Primary Image URL
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.images[0] || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            images: [e.target.value, ...editingProduct.images.slice(1)],
                          })
                        }
                        className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    {/* Price in PKR per Size */}
                    <div className="p-3 bg-[#0E0E12] border border-[#202026] space-y-2">
                      <span className="font-semibold text-[#D4AF37] uppercase tracking-wider block">
                        Prices (PKR) &amp; Inventory Stock
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[#8E8B84] mb-0.5">6ml Price</label>
                          <input
                            type="number"
                            value={editingProduct.prices['6ml']}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                prices: { ...editingProduct.prices, '6ml': Number(e.target.value) },
                              })
                            }
                            className="w-full px-2 py-1.5 bg-[#141418] border border-[#25252B] text-xs text-[#F5F2EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#8E8B84] mb-0.5">12ml Price</label>
                          <input
                            type="number"
                            value={editingProduct.prices['12ml']}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                prices: { ...editingProduct.prices, '12ml': Number(e.target.value) },
                              })
                            }
                            className="w-full px-2 py-1.5 bg-[#141418] border border-[#25252B] text-xs text-[#F5F2EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#8E8B84] mb-0.5">30ml Price</label>
                          <input
                            type="number"
                            value={editingProduct.prices['30ml']}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                prices: { ...editingProduct.prices, '30ml': Number(e.target.value) },
                              })
                            }
                            className="w-full px-2 py-1.5 bg-[#141418] border border-[#25252B] text-xs text-[#F5F2EB]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div>
                          <label className="block text-[#8E8B84] mb-0.5">6ml Stock</label>
                          <input
                            type="number"
                            value={editingProduct.stock['6ml']}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                stock: { ...editingProduct.stock, '6ml': Number(e.target.value) },
                              })
                            }
                            className="w-full px-2 py-1.5 bg-[#141418] border border-[#25252B] text-xs text-[#F5F2EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#8E8B84] mb-0.5">12ml Stock</label>
                          <input
                            type="number"
                            value={editingProduct.stock['12ml']}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                stock: { ...editingProduct.stock, '12ml': Number(e.target.value) },
                              })
                            }
                            className="w-full px-2 py-1.5 bg-[#141418] border border-[#25252B] text-xs text-[#F5F2EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#8E8B84] mb-0.5">30ml Stock</label>
                          <input
                            type="number"
                            value={editingProduct.stock['30ml']}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                stock: { ...editingProduct.stock, '30ml': Number(e.target.value) },
                              })
                            }
                            className="w-full px-2 py-1.5 bg-[#141418] border border-[#25252B] text-xs text-[#F5F2EB]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-[#202026]">
                      <button
                        type="button"
                        onClick={() => setIsProductModalOpen(false)}
                        className="px-4 py-2 bg-[#202028] text-[#F5F2EB]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#D4AF37] text-black font-semibold uppercase tracking-wider"
                      >
                        Save Fragrance
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: WEBSITE CONTENT & BANNERS ================= */}
        {activeTab === 'website' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-[#F5F2EB]">Website Content &amp; Settings</h3>
              <p className="text-xs text-[#8E8B84]">
                Update homepage headlines, top notification banners, official WhatsApp number, and social links.
              </p>
            </div>

            {/* Change Password Option in Admin Settings */}
            <div className="p-4 bg-[#16161D] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/30">
                  <KeyRound className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#F5F2EB] uppercase tracking-wider">
                    Administrator Password Management
                  </h4>
                  <p className="text-[11px] text-[#8E8B84]">
                    Update your master password securely with Supabase Authentication.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-[#121216] border border-[#25252B] p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={settings.brandName}
                    onChange={(e) => setLocalSettings({ ...settings, brandName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setLocalSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                  Homepage Hero Headline
                </label>
                <input
                  type="text"
                  value={settings.heroHeadline}
                  onChange={(e) => setLocalSettings({ ...settings, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                />
              </div>

              <div>
                <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                  Homepage Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubtitle}
                  onChange={(e) => setLocalSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                />
              </div>

              <div>
                <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                  Top Announcement Banner
                </label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => setLocalSettings({ ...settings, announcementText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                    Official WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setLocalSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                    Location Display
                  </label>
                  <input
                    type="text"
                    value={settings.location}
                    onChange={(e) => setLocalSettings({ ...settings, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                    Instagram Profile URL
                  </label>
                  <input
                    type="text"
                    value={settings.instagramUrl}
                    onChange={(e) => setLocalSettings({ ...settings, instagramUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                    TikTok Profile URL
                  </label>
                  <input
                    type="text"
                    value={settings.tiktokUrl}
                    onChange={(e) => setLocalSettings({ ...settings, tiktokUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                    Free Delivery Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) =>
                      setLocalSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#F5F2EB] uppercase tracking-wider font-semibold mb-1">
                    Standard Courier Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.standardDeliveryFee}
                    onChange={(e) =>
                      setLocalSettings({ ...settings, standardDeliveryFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold uppercase tracking-wider text-xs transition-colors"
              >
                Save All Changes
              </button>
            </form>

            {/* Administrator Account & Password Management Shortcut in Settings */}
            <div className="p-5 bg-[#121216] border border-[#25252B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-1">
                  <KeyRound className="w-4 h-4" />
                  <span>Admin Credentials &amp; Password Management</span>
                </div>
                <p className="text-xs text-[#8E8B84]">
                  Update your administrator login password or manage emergency access keys securely.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className="px-4 py-2.5 bg-[#1A1A22] hover:bg-[#252530] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 5: REVIEWS MODERATION ================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="font-serif text-2xl text-[#F5F2EB]">Customer Testimonials &amp; Reviews</h3>
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-[#121216] border border-[#25252B] flex justify-between items-start text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#F5F2EB]">{rev.author}</span>
                      <span className="text-[#8E8B84]">({rev.city})</span>
                      <span className="text-[#D4AF37]">· {rev.rating} ★</span>
                      <span className="text-[#7A7873]">· {rev.productName}</span>
                    </div>
                    <p className="font-medium text-[#F5F2EB] mb-1">"{rev.title}"</p>
                    <p className="text-[#9E9B95] leading-relaxed max-w-2xl">{rev.comment}</p>
                  </div>

                  <button
                    onClick={() => {
                      const updated = reviews.filter((r) => r.id !== rev.id);
                      setReviews(updated);
                      saveReviews(updated);
                    }}
                    className="p-1.5 text-[#8E8B84] hover:text-red-400"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: SECURITY & PASSWORD MANAGEMENT ================= */}
        {activeTab === 'security' && (
          <div className="max-w-3xl space-y-8">
            <div>
              <h3 className="font-serif text-2xl text-[#F5F2EB]">Administrator Security &amp; Credentials</h3>
              <p className="text-xs text-[#8E8B84]">
                Manage your credentials, update your master password, and monitor Supabase Authentication status.
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="p-6 bg-[#121216] border border-[#25252B] space-y-4 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#202026]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#F5F2EB]">ZAVREX Master Administrator</h4>
                    <p className="text-xs text-[#8E8B84]">Full access permissions for catalog, orders, and settings</p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded">
                  Active Session
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8E8B84] block mb-0.5">Admin Username:</span>
                  <span className="font-semibold text-[#F5F2EB] font-mono">admin</span>
                </div>
                <div>
                  <span className="text-[#8E8B84] block mb-0.5">Associated Email:</span>
                  <span className="font-semibold text-[#F5F2EB] font-mono">admin@zavrex.com</span>
                </div>
                <div>
                  <span className="text-[#8E8B84] block mb-0.5">Authentication Engine:</span>
                  <span className="font-medium text-[#D4AF37]">
                    {isSupabaseConfigured ? 'Supabase Cloud Authentication' : 'Zero-Knowledge Cryptographic Vault (Salted SHA-256)'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8E8B84] block mb-0.5">Frontend Security:</span>
                  <span className="font-medium text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>No Plaintext Passwords in Code</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-[#121216] border border-[#25252B] p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                <KeyRound className="w-4 h-4" />
                <span>Change Administrator Password</span>
              </div>
              <p className="text-xs text-[#8E8B84]">
                Update your password securely. The change will take effect immediately across all future logins.
              </p>

              {passwordChangeStatus && (
                <div
                  className={`p-3 text-xs flex items-center gap-2 ${
                    passwordChangeStatus.success
                      ? 'bg-emerald-950/50 border border-emerald-500/50 text-emerald-300'
                      : 'bg-red-950/50 border border-red-500/50 text-red-300'
                  }`}
                >
                  {passwordChangeStatus.success ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  )}
                  <span>{passwordChangeStatus.message}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-xs">
                {/* Current Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#F5F2EB] uppercase tracking-wider font-semibold">
                      Current Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-[#D4AF37] hover:underline text-[11px] font-normal"
                    >
                      Forgot Current Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 bg-[#0E0E12] border border-[#25252B] text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8B84] hover:text-[#F5F2EB] transition-colors p-1"
                      title={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirm Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#F5F2EB] uppercase tracking-wider font-semibold">
                        New Password *
                      </label>
                      {newPassword.length > 0 && (
                        <span
                          className={`text-[10px] font-semibold flex items-center gap-1 ${
                            newPassword.length >= 8 ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {newPassword.length >= 8 ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Valid length</span>
                            </>
                          ) : (
                            <span>{newPassword.length}/8 min</span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Minimum 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-3 py-2.5 pr-10 bg-[#0E0E12] border text-sm text-[#F5F2EB] focus:outline-none ${
                          newPassword.length > 0 && newPassword.length < 8
                            ? 'border-amber-500/60 focus:border-amber-400'
                            : 'border-[#25252B] focus:border-[#D4AF37]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8B84] hover:text-[#F5F2EB] transition-colors p-1"
                        title={showNewPassword ? 'Hide new password' : 'Show new password'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#F5F2EB] uppercase tracking-wider font-semibold">
                        Confirm New Password *
                      </label>
                      {confirmPassword.length > 0 && (
                        <span
                          className={`text-[10px] font-semibold flex items-center gap-1 ${
                            newPassword === confirmPassword ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {newPassword === confirmPassword ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Passwords match</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              <span>Do not match</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2.5 pr-10 bg-[#0E0E12] border text-sm text-[#F5F2EB] focus:outline-none ${
                          confirmPassword.length > 0 && newPassword !== confirmPassword
                            ? 'border-red-500/60 focus:border-red-400'
                            : 'border-[#25252B] focus:border-[#D4AF37]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8B84] hover:text-[#F5F2EB] transition-colors p-1"
                        title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Validation helper alert if mismatch or too short */}
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>The confirmation password does not match the new password.</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    isChangingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    newPassword.length < 8
                  }
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold uppercase tracking-wider text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <span>Updating Credentials...</span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Update Administrator Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 7: SUPABASE & DEPLOYMENT GUIDE ================= */}
        {activeTab === 'supabase' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h3 className="font-serif text-2xl text-[#F5F2EB]">Supabase Integration &amp; Deployment Guide</h3>
              <p className="text-xs text-[#8E8B84]">
                Full database synchronization, Row Level Security (RLS) policies, and Netlify deployment readiness.
              </p>
            </div>

            {/* Connection Status Card */}
            <div className="p-6 bg-[#121216] border border-[#25252B]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-[#D4AF37]" />
                  <div>
                    <h4 className="font-semibold text-sm text-[#F5F2EB]">Database Engine Status</h4>
                    <p className="text-xs text-[#8E8B84]">
                      {isSupabaseConfigured
                        ? 'Connected to live Supabase project'
                        : 'Operating in High-Performance Local Storage mode (Zero-setup out-of-the-box)'}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded ${
                    isSupabaseConfigured
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                      : 'bg-[#1C1C24] text-[#D4AF37] border border-[#D4AF37]/30'
                  }`}
                >
                  {isSupabaseConfigured ? 'Supabase Active' : 'Self-Contained Mode'}
                </span>
              </div>

              <p className="text-xs text-[#C8C5BD] leading-relaxed mb-4">
                The application currently runs seamlessly with persistent local storage. When you are ready to connect your production Supabase database, run the SQL script below in your Supabase SQL editor and set your project environment variables.
              </p>
            </div>

            {/* SQL Blueprint Schema Box */}
            <div className="bg-[#121216] border border-[#25252B] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-[#F5F2EB]">
                    PostgreSQL Tables &amp; RLS Policies DDL
                  </h4>
                  <p className="text-xs text-[#8E8B84]">
                    Creates `products`, `orders`, `reviews`, `settings`, and `inquiries` tables.
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C378] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy SQL Blueprint</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-[#0A0A0C] border border-[#1F1F26] text-[11px] text-[#A68026] font-mono overflow-x-auto max-h-72 leading-relaxed">
                {SQL_SCHEMA_BLUEPRINT}
              </pre>
            </div>

            {/* Netlify Deployment Checklist */}
            <div className="p-6 bg-[#121216] border border-[#25252B] text-xs space-y-3">
              <h4 className="font-semibold text-sm text-[#F5F2EB] uppercase tracking-wider text-[#D4AF37]">
                Netlify Production Deployment Steps
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-[#C8C5BD]">
                <li>
                  <strong>Connect Git Repository:</strong> Push your ZAVREX repository to GitHub or GitLab and link to Netlify.
                </li>
                <li>
                  <strong>Build Settings:</strong> Build Command: <code className="bg-[#0E0E12] px-1 py-0.5 text-[#D4AF37]">npm run build</code>, Publish directory: <code className="bg-[#0E0E12] px-1 py-0.5 text-[#D4AF37]">dist</code>.
                </li>
                <li>
                  <strong>SPA Routing:</strong> Already configured with <code className="bg-[#0E0E12] px-1 py-0.5 text-[#D4AF37]">public/_redirects</code> (<code className="bg-[#0E0E12] px-1 py-0.5">/* /index.html 200</code>) for flawless React navigation.
                </li>
                <li>
                  <strong>Optional Env Vars in Netlify:</strong> Add <code className="bg-[#0E0E12] px-1 py-0.5">VITE_SUPABASE_URL</code> and <code className="bg-[#0E0E12] px-1 py-0.5">VITE_SUPABASE_ANON_KEY</code> in Site settings &gt; Environment variables.
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
