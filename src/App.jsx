import { useState, useEffect, useRef } from 'react';
import { Compass, Store, Headphones, Heart, User, Star, ArrowUpRight, Search, SlidersHorizontal, X, Plus, LogOut } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { INITIAL_PRODUCTS, INITIAL_SHOPS } from './data/mockData';
import { useCustomImages } from './utils/imageStore';
import { Navbar2 } from './components/NavbarOptions';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import AccessoriesPage from './components/AccessoriesPage';
import ShopDetailPage from './components/ShopDetailPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import AccountPage from './components/AccountPage';
import AdminVisualEditor from './components/AdminVisualEditor';
import AuthModal from './components/AuthModal';
import ShopRegistrationModal from './components/ShopRegistrationModal';
import MyOrdersModal from './components/MyOrdersModal';
import AddressesModal from './components/AddressesModal';
import ShopkeeperDashboardModal from './components/ShopkeeperDashboardModal';
import SmartAssistantModal from './components/SmartAssistantModal';

const NAV_TABS = [
  { id: 'home', label: 'Explore', Icon: Compass },
  { id: 'shops', label: 'Shops', Icon: Store },
  { id: 'accessories', label: 'Accessories', Icon: Headphones },
  { id: 'favorites', label: 'Saved', Icon: Heart },
  { id: 'account', label: 'Account', Icon: User },
];

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

/* ── Horizontal Shop Card (Exact match of Explore Page card) ── */
function HorizontalShopCard({ shop, onShop }) {
  return (
    <div
      key={shop.id}
      className="bg-white rounded-3xl border border-gray-200 p-3.5 flex items-center gap-3.5 active:scale-[0.99] transition-transform cursor-pointer"
      onClick={() => onShop(shop.id)}
    >
      {/* Shop Image / Logo on left — clean rounded square */}
      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
        <img
          src={shop.logo}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content in middle */}
      <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[76px] py-0.5">
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-black leading-snug truncate">
              {shop.name}
            </h3>
            <span className="text-[10px] font-semibold text-gray-500">
              {shop.verified ? 'Verified Shop' : 'Local Retailer'} · {shop.distance}
            </span>
          </div>
        </div>

        <p className="text-xs text-black/45 truncate mt-0.5">
          {shop.address}
        </p>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-1">
            <span className="text-amber-400 text-xs">★</span>
            <span className="text-xs font-bold text-black">{shop.rating}</span>
            <span className="text-[10.5px] text-black/40">({shop.ratingCount})</span>
          </div>
          <button
            className="flex-shrink-0 bg-[#8586f2] hover:bg-[#7375e8] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
            onClick={e => {
              e.stopPropagation();
              onShop(shop.id);
            }}
          >
            Visit Shop
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Square Product Card (Exact match of Explore Page ProductCard) ── */
function ProductSquareCard({ product, onProduct, onAddToCart }) {
  const isAccessory = ['cases', 'covers', 'airpods', 'smartwatch', 'chargers', 'headphones', 'handsfree', 'cables'].includes(product.category) ||
    ['case', 'cover', 'glass', 'protector', 'charger', 'buds', 'watch', 'handsfree', 'earphone', 'cable'].some(kw => (product.name || '').toLowerCase().includes(kw));
  const storage = isAccessory ? null : (product.specs?.Storage || (product.condition === 'new' ? 'Box Pack' : 'In Stock'));

  return (
    <div
      className="w-full h-full bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
      onClick={() => onProduct(product.id)}
    >
      {/* Upper image area — uniform square placeholder with rounded corners and exact side spacing */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <div className="w-full aspect-square bg-transparent rounded-2xl overflow-hidden flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full ${
              isAccessory ? 'object-cover' : 'object-contain p-2.5'
            }`}
          />
        </div>
      </div>

      {/* Content area at bottom: identical 2-line title height and bottom-aligned price row */}
      <div className="px-3 pb-3 pt-1 flex flex-col justify-between flex-1">
        <p className="text-xs font-bold text-black leading-snug line-clamp-2 h-8 mb-2">
          {product.name}
        </p>
        <div className="flex items-center justify-between gap-1.5 mt-auto">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-[#8586f2] truncate">{fmt(product.price)}</span>
            {storage ? (
              <span className="text-[10px] font-semibold text-black/45 leading-none mt-1 truncate">
                {storage}
              </span>
            ) : (
              <span className="text-[10px] text-transparent select-none leading-none mt-1">
                -
              </span>
            )}
          </div>
          <button
            className="w-7 h-7 flex-shrink-0 bg-[#8586f2] hover:bg-[#7375e8] text-white rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-xs"
            onClick={e => {
              e.stopPropagation();
              onProduct(product.id);
            }}
            title="View details"
            aria-label="View details"
          >
            <Plus size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Favorites Page (Full-width toggle switch: Saved Products or Saved Shops) ── */
function FavoritesPage({ favorites, onProduct, onShop, onToggleFav, onAddToCart }) {
  const [savedTab, setSavedTab] = useState('products'); // 'products' | 'shops'
  const favProducts = INITIAL_PRODUCTS.filter(p => favorites.includes(p.id));
  const favShops = INITIAL_SHOPS.filter(s => favorites.includes(s.id));

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* ── Top Header ── */}
      <div className="px-4 pt-4 pb-3.5 text-white flex-shrink-0 z-30" style={{ background: '#8586f2' }}>
        <h2 className="text-white text-lg font-black tracking-tight">Saved</h2>
        <p className="text-white/80 text-[11px] font-medium">{favorites.length} total saved items</p>
      </div>

      {/* ── Full-Width Segmented Toggle Switch (Saved Products on left, Saved Shops on right) ── */}
      <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="w-full bg-gray-100 p-1 rounded-2xl flex items-center">
          <button
            onClick={() => setSavedTab('products')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              savedTab === 'products'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-black/60 hover:text-black'
            }`}
          >
            <span>Saved Products</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                savedTab === 'products' ? 'bg-[#8586f2] text-white' : 'bg-gray-200 text-black/60'
              }`}
            >
              {favProducts.length}
            </span>
          </button>

          <button
            onClick={() => setSavedTab('shops')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              savedTab === 'shops'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-black/60 hover:text-black'
            }`}
          >
            <span>Saved Shops</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                savedTab === 'shops' ? 'bg-[#8586f2] text-white' : 'bg-gray-200 text-black/60'
              }`}
            >
              {favShops.length}
            </span>
          </button>
        </div>
      </div>

      {/* ── Content View ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28 bg-[#f8f9fc] smooth-scroll">
        {savedTab === 'shops' ? (
          <div className="px-4 mt-3">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-black">Bookmarked Retailers</span>
              <span className="text-xs text-black/40 font-medium">{favShops.length} shops</span>
            </div>

            {favShops.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {favShops.map(shop => (
                  <HorizontalShopCard key={shop.id} shop={shop} onShop={onShop} />
                ))}
              </div>
            ) : (
              <div className="mt-24 flex flex-col items-center text-center px-8">
                <div className="w-14 h-14 rounded-3xl bg-gray-100 flex items-center justify-center mb-3 text-[#8586f2]">
                  <Store size={24} />
                </div>
                <p className="text-black font-bold text-base">No saved shops yet</p>
                <p className="text-black/40 text-xs mt-1 max-w-xs">
                  Tap the save icon on any shop to easily revisit its catalog here.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 mt-3">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-black">Wishlist Items</span>
              <span className="text-xs text-black/40 font-medium">{favProducts.length} items</span>
            </div>

            {favProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {favProducts.map(p => (
                  <ProductSquareCard key={p.id} product={p} onProduct={onProduct} onAddToCart={onAddToCart} />
                ))}
              </div>
            ) : (
              <div className="mt-24 flex flex-col items-center text-center px-8">
                <div className="w-14 h-14 rounded-3xl bg-gray-100 flex items-center justify-center mb-3 text-[#8586f2]">
                  <Heart size={24} />
                </div>
                <p className="text-black font-bold text-base">No saved products yet</p>
                <p className="text-black/40 text-xs mt-1 max-w-xs">
                  Save your favorite phones and accessories to compare and review anytime.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Shop Showcase Card (Exact match of Explore Page "Explore All Shops" card) ── */
function ShopShowcaseCard({ shop, onShop }) {
  const { getImg } = useCustomImages();

  return (
    <div
      key={shop.id}
      className="bg-white rounded-3xl border border-gray-200 p-3 overflow-hidden cursor-pointer active:scale-[0.99] transition-all flex flex-col"
      onClick={() => onShop(shop.id)}
    >
      {/* Top photo banner with rounded corners, verified pill, and circular logo matching Explore page */}
      <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={getImg(`shop_${shop.id}_cover`, shop.coverImage)}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Top-left: Verified / Best Seller pill */}
        <span className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-full">
          {shop.verified ? 'Verified Shop' : 'Best Seller'}
        </span>

        {/* Top-right: Clean white circular shop logo badge */}
        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white p-1 shadow-md flex items-center justify-center overflow-hidden">
          <img
            src={getImg(`shop_${shop.id}_logo`, shop.logo)}
            alt=""
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Image indicator dots at bottom matching Explore page */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1">
          <span className="w-2.5 h-1 rounded-full bg-white" />
          <span className="w-1 h-1 rounded-full bg-white/50" />
          <span className="w-1 h-1 rounded-full bg-white/50" />
        </div>
      </div>

      {/* Shop Details matching Explore page typography & layout */}
      <div className="pt-2.5 pb-1 flex flex-col flex-1">
        <h3 className="text-base font-bold text-black leading-snug truncate">{shop.name}</h3>
        <p className="text-xs font-semibold text-black/50 mt-0.5 truncate">
          {shop.featuredQuote || 'Official Retailer in Bahawalnagar'}
        </p>
        <p className="text-xs text-black/40 mt-1 line-clamp-2 leading-relaxed">
          {shop.address}
        </p>

        {/* Bottom row: Rating pill on left, Visit Shop button on right */}
        <div className="flex items-center justify-between mt-3 pt-1">
          <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center gap-1 text-xs font-bold text-black">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{shop.rating}</span>
            <span className="text-black/35 font-normal">({shop.ratingCount})</span>
          </div>
          <button
            className="bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform shadow-xs"
            onClick={e => {
              e.stopPropagation();
              onShop(shop.id);
            }}
          >
            <span>Visit Shop</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Shops Page (All shops rendered in Explore page's showcase card style) ── */
function ShopsPage({ onShop, favorites, onToggleFav }) {
  const { shops } = useApp();
  const shopList = shops && shops.length > 0 ? shops : INITIAL_SHOPS;
  const [query, setQuery] = useState('');

  const filteredShops = shopList.filter(shop => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      shop.name.toLowerCase().includes(q) ||
      shop.address.toLowerCase().includes(q) ||
      (shop.featuredQuote && shop.featuredQuote.toLowerCase().includes(q)) ||
      (shop.categories && shop.categories.some(c => c.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Brand Header */}
      <div className="px-4 pt-4 pb-3.5 text-white flex-shrink-0 z-30" style={{ background: '#8586f2' }}>
        <h2 className="text-white text-lg font-black tracking-tight">All Shops</h2>
        <p className="text-white/80 text-[11px] font-medium">Bahawalnagar, Pakistan · {shopList.length} verified retailers</p>
      </div>

      {/* Same Style Search Bar from Explore Page */}
      <div className="px-4 pt-3 pb-2 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="w-full bg-gray-50/90 border border-gray-200/90 rounded-full px-4 py-2.5 flex items-center gap-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
          <Search size={18} className="text-[#8586f2] flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for mobile shops in Bahawalnagar..."
            className="w-full bg-transparent text-sm font-medium text-black placeholder:text-black/40 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-0.5 text-black/40 hover:text-black">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28 bg-[#f8f9fc] smooth-scroll">
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-base font-bold text-black">Mobile Shops & Retailers</h2>
              <p className="text-xs text-black/40">Verified mobile retailers and official stores in Bahawalnagar</p>
            </div>
            <span className="text-xs text-black/40 font-semibold self-start mt-0.5">
              {filteredShops.length} shops
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {filteredShops.length > 0 ? (
              filteredShops.map(shop => (
                <ShopShowcaseCard key={shop.id} shop={shop} onShop={onShop} />
              ))
            ) : (
              <div className="mt-16 flex flex-col items-center text-center">
                <p className="text-black font-semibold text-sm">No shops found</p>
                <p className="text-black/40 text-xs mt-1">Try searching for a different shop or market name</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main App Shell ── */
function AppShell() {
  const { role, setRole, currentUser, loginUser, logoutUser, registerShop } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [activeShopId, setActiveShopId] = useState(null);
  const [activeProductId, setActiveProductId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Auth & Shop Registration modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');
  const [isShopRegModalOpen, setIsShopRegModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isAddressesModalOpen, setIsAddressesModalOpen] = useState(false);
  const [isShopDashboardOpen, setIsShopDashboardOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const allowExitRef = useRef(false);

  const openAuth = (mode = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const openShopRegistration = () => {
    setIsShopRegModalOpen(true);
  };

  // Cart state with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('bm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('bm_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  const addToCart = (productId) => {
    const prod = INITIAL_PRODUCTS.find(p => p.id === productId);
    if (!prod) return;
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === productId);
      if (idx > -1) {
        return prev.map((item, i) => i === idx ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      }
      return [...prev, { ...prod, quantity: 1 }];
    });
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const nextQty = (item.quantity || 1) + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Android & Mobile Phone Physical/Gesture Back Button Interceptor
  useEffect(() => {
    const checkAdmin = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin' || params.get('admin') === 'true') {
        setIsAdminMode(true);
      }
    };
    checkAdmin();
    window.addEventListener('hashchange', checkAdmin);

    // Push initial history state to capture Android back button
    window.history.pushState({ app: 'bahawal-market' }, '');

    const handlePopState = () => {
      if (allowExitRef.current) return;

      // 1. If Exit Confirm dialog is open, cancel and close it
      if (showExitConfirm) {
        setShowExitConfirm(false);
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }

      // 2. If Smart Assistant is open, close it
      if (isAssistantOpen) {
        setIsAssistantOpen(false);
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }

      // 3. If any modal is open, close that modal first
      if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }
      if (isShopRegModalOpen) {
        setIsShopRegModalOpen(false);
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }
      if (isOrdersModalOpen) {
        setIsOrdersModalOpen(false);
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }
      if (isAddressesModalOpen) {
        setIsAddressesModalOpen(false);
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }
      if (isShopDashboardOpen) {
        setIsShopDashboardOpen(false);
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }

      // 3. If Cart page is open, close cart
      if (isCartOpen) {
        setIsCartOpen(false);
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }

      // 4. If Product detail view is active, navigate back
      if (activeProductId) {
        setActiveProductId(null);
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }

      // 5. If Shop detail view is active, navigate back
      if (activeShopId) {
        setActiveShopId(null);
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }

      // 6. If on any tab other than Explore (Home), return to Explore
      if (activeTab !== 'home') {
        setActiveTab('home');
        window.history.pushState({ app: 'bahawal-market' }, '');
        return;
      }

      // 7. If on root Explore page with nothing open, ask Exit Confirmation!
      setShowExitConfirm(true);
      window.history.pushState({ app: 'bahawal-market' }, '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('hashchange', checkAdmin);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [
    isAuthModalOpen,
    isShopRegModalOpen,
    isOrdersModalOpen,
    isAddressesModalOpen,
    isShopDashboardOpen,
    isCartOpen,
    activeProductId,
    activeShopId,
    activeTab,
    showExitConfirm
  ]);

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleConfirmExit = () => {
    allowExitRef.current = true;
    setShowExitConfirm(false);
    window.history.back();
  };

  const toggleFav = (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setActiveShopId(null);
    setActiveProductId(null);
    setIsCartOpen(false);
  };

  const goShop = (id) => { setActiveShopId(id); setActiveProductId(null); setIsCartOpen(false); };
  const goProduct = (id) => { setActiveProductId(id); setIsCartOpen(false); };
  const goBackFromProduct = () => setActiveProductId(null);
  const goBackFromShop = () => setActiveShopId(null);
  const goShopFromProduct = (id) => { setActiveProductId(null); setActiveShopId(id); setIsCartOpen(false); };

  const handleSearchFocus = () => { setActiveTab('search'); setActiveShopId(null); setActiveProductId(null); setIsCartOpen(false); };

  /* Render page content */
  const renderPage = () => {
    // Dedicated Cart Page
    if (isCartOpen) {
      return (
        <CartPage
          cart={cart}
          onBack={() => setIsCartOpen(false)}
          onProduct={(id) => {
            setIsCartOpen(false);
            goProduct(id);
          }}
          onUpdateQty={updateCartQty}
          onRemove={removeFromCart}
          onClear={clearCart}
          onOpenOrders={() => setIsOrdersModalOpen(true)}
        />
      );
    }

    // Product detail — takes priority
    if (activeProductId) {
      return (
        <ProductDetailPage
          productId={activeProductId}
          onBack={goBackFromProduct}
          onShop={goShopFromProduct}
          onProduct={goProduct}
          favorites={favorites}
          onToggleFav={toggleFav}
          onAddToCart={addToCart}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenOrders={() => setIsOrdersModalOpen(true)}
        />
      );
    }
    // Shop detail
    if (activeShopId) {
      return (
        <ShopDetailPage
          shopId={activeShopId}
          onBack={goBackFromShop}
          onProduct={goProduct}
          favorites={favorites}
          onToggleFav={toggleFav}
          onAddToCart={addToCart}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            onShop={goShop}
            onProduct={goProduct}
            favorites={favorites}
            onToggleFav={toggleFav}
            onSearchFocus={handleSearchFocus}
            onOpenCart={() => setIsCartOpen(true)}
            cartCount={cartCount}
            onAddToCart={addToCart}
            onNavigateTab={handleNavClick}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
      case 'shops':
        return (
          <ShopsPage
            onShop={goShop}
            favorites={favorites}
            onToggleFav={toggleFav}
          />
        );
      case 'accessories':
        return (
          <AccessoriesPage
            onProduct={goProduct}
            onAddToCart={addToCart}
          />
        );
      case 'search':
        return (
          <SearchPage
            onShop={goShop}
            onProduct={goProduct}
            favorites={favorites}
            onToggleFav={toggleFav}
            onAddToCart={addToCart}
            initialQuery={searchQuery}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            favorites={favorites}
            onProduct={goProduct}
            onShop={goShop}
            onToggleFav={toggleFav}
            onAddToCart={addToCart}
          />
        );
      case 'account':
        return (
          <AccountPage
            role={role}
            currentUser={currentUser}
            onLogout={() => logoutUser()}
            onOpenAdmin={() => setIsAdminMode(true)}
            onOpenAuth={openAuth}
            onOpenShopRegistration={openShopRegistration}
            onOpenShop={goShop}
            onOpenOrders={() => setIsOrdersModalOpen(true)}
            onOpenAddresses={() => setIsAddressesModalOpen(true)}
            onOpenShopDashboard={() => setIsShopDashboardOpen(true)}
            onNavigateTab={handleNavClick}
          />
        );
      default:
        return null;
    }
  };

  if (isAdminMode) {
    return (
      <div className="fixed inset-0 flex flex-col bg-[#4440cf] overflow-hidden max-w-md mx-auto">
        <div className="flex-1 overflow-hidden relative">
          <AdminVisualEditor 
            onExit={() => {
              setIsAdminMode(false);
              if (window.location.pathname.toLowerCase().startsWith('/admin')) {
                window.history.pushState(null, '', '/');
              } else if (window.location.hash === '#admin') {
                window.history.replaceState(null, '', ' ');
              }
            }} 
          />
        </div>
      </div>
    );
  }

  const showNav = !activeProductId && !isCartOpen; // hide bottom nav when viewing product or full cart

  return (
    <div className="fixed inset-0 flex flex-col bg-[#4440cf] overflow-hidden max-w-md mx-auto">
      {/* Page */}
      <div className="flex-1 overflow-hidden relative">
        {renderPage()}
      </div>

      {/* Bottom Nav */}
      {showNav && (
        <div className="absolute bottom-4 left-4 right-4 z-40">
          <Navbar2
            navTab={activeTab}
            favorites={favorites}
            handleNavClick={handleNavClick}
            role={role}
          />
        </div>
      )}

      {/* Auth Modal (Phone & OTP Verification) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(userData) => loginUser(userData)}
        initialMode={authModalMode}
      />

      {/* Shop Registration Modal (Sell on Bahawal Market) */}
      <ShopRegistrationModal
        isOpen={isShopRegModalOpen}
        onClose={() => setIsShopRegModalOpen(false)}
        currentUser={currentUser}
        onRegisterShopSuccess={(shopData, cnic) => registerShop(shopData, cnic)}
        onOpenShop={goShop}
      />

      {/* My Orders Modal (Tracking & History) */}
      <MyOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        onExplore={() => {
          setIsOrdersModalOpen(false);
          handleNavClick('home');
        }}
      />

      {/* Saved Delivery Addresses Modal */}
      <AddressesModal
        isOpen={isAddressesModalOpen}
        onClose={() => setIsAddressesModalOpen(false)}
      />

      {/* Shopkeeper Dashboard Modal (Inventory & Incoming Orders) */}
      <ShopkeeperDashboardModal
        isOpen={isShopDashboardOpen}
        onClose={() => setIsShopDashboardOpen(false)}
        onOpenShop={goShop}
      />

      {/* Smart Device Assistant & Side-by-Side Comparison Modal */}
      <SmartAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onProduct={goProduct}
        onShop={goShop}
      />

      {/* ── Android/Mobile Phone Physical & Gesture Back Button Exit Confirmation Dialog ── */}
      {showExitConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={handleCancelExit}
        >
          <div 
            className="w-full max-w-[340px] bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-13 h-13 rounded-2xl bg-[#8586f2]/10 text-[#8586f2] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <LogOut size={24} />
            </div>

            <h3 className="text-base font-black text-black">Exit Bahawal Market?</h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Are you sure you want to close the app? Your cart and saved items will remain saved on your phone.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                type="button"
                onClick={handleCancelExit}
                className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold rounded-xl active:scale-95 transition-all"
              >
                Stay on App
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="py-2.5 px-3 bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-xs"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
