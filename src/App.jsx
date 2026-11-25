import { useState, useEffect } from 'react';
import { Compass, Store, Search, Heart, User } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { INITIAL_PRODUCTS, INITIAL_SHOPS } from './data/mockData';
import { Navbar2 } from './components/NavbarOptions';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import ShopDetailPage from './components/ShopDetailPage';
import ProductDetailPage from './components/ProductDetailPage';
import AccountPage from './components/AccountPage';
import AdminVisualEditor from './components/AdminVisualEditor';

const NAV_TABS = [
  { id: 'home', label: 'Explore', Icon: Compass },
  { id: 'shops', label: 'Shops', Icon: Store },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'favorites', label: 'Saved', Icon: Heart },
  { id: 'account', label: 'Account', Icon: User },
];

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

/* ── Favorites Page (inline) ── */
function FavoritesPage({ favorites, onProduct, onShop, onToggleFav }) {
  const favProducts = INITIAL_PRODUCTS.filter(p => favorites.includes(p.id));
  const favShops = INITIAL_SHOPS.filter(s => favorites.includes(s.id));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="gradient-hero px-4 pt-5 pb-5">
        <h2 className="text-white text-xl font-black">Saved</h2>
        <p className="text-blue-200 text-xs mt-0.5">{favorites.length} saved items</p>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28 bg-gray-50 smooth-scroll">
        {favShops.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-gray-700 px-4 mb-2.5">🏪 Saved Shops</h3>
            <div className="px-4 flex flex-col gap-2.5">
              {favShops.map(shop => (
                <div
                  key={shop.id}
                  className="flex gap-3 items-center bg-white rounded-2xl p-3 card-shadow cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => onShop(shop.id)}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{shop.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{shop.address}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); onToggleFav(shop.id); }}>
                    <Heart size={18} className="fill-red-500 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {favProducts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-gray-700 px-4 mb-2.5">📱 Saved Products</h3>
            <div className="px-4 flex flex-col gap-2.5">
              {favProducts.map(p => {
                const shop = INITIAL_SHOPS.find(s => s.id === p.shopId);
                return (
                  <div
                    key={p.id}
                    className="flex gap-3 items-center bg-white rounded-2xl p-3 card-shadow cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => onProduct(p.id)}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">🏪 {shop?.name}</p>
                      <p className="text-sm font-bold text-blue-700 mt-0.5">{fmt(p.price)}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); onToggleFav(p.id); }}>
                      <Heart size={18} className="fill-red-500 text-red-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {favorites.length === 0 && (
          <div className="mt-24 flex flex-col items-center text-center px-8">
            <span className="text-6xl mb-4">❤️</span>
            <p className="text-gray-700 font-bold text-lg">Nothing saved yet</p>
            <p className="text-gray-400 text-sm mt-2">Tap the heart icon on any shop or product to save it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Shops Page (all shops list) ── */
function ShopsPage({ onShop, favorites, onToggleFav }) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="gradient-hero px-4 pt-5 pb-5">
        <h2 className="text-white text-xl font-black">All Shops</h2>
        <p className="text-blue-200 text-xs mt-0.5">Bahawalnagar, Pakistan · {INITIAL_SHOPS.length} shops</p>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28 bg-gray-50 smooth-scroll">
        <div className="px-4 mt-4 flex flex-col gap-3">
          {INITIAL_SHOPS.map(shop => (
            <div
              key={shop.id}
              className="bg-white rounded-2xl card-shadow overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => onShop(shop.id)}
            >
              <div className="relative h-32">
                <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {shop.verified && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Verified</span>
                )}
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${shop.status === 'open' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {shop.status === 'open' ? '● Open' : '● Closed'}
                </span>
                <button
                  className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow"
                  onClick={e => { e.stopPropagation(); onToggleFav(shop.id); }}
                >
                  <Heart size={13} className={favorites.includes(shop.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5">
                  <img src={shop.logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{shop.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-amber-400">★</span>
                      <span className="text-xs font-semibold text-gray-700">{shop.rating}</span>
                      <span className="text-xs text-gray-400">({shop.ratingCount}) · {shop.distance}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 truncate">{shop.address}</p>
                {shop.featuredQuote && (
                  <p className="text-xs text-blue-600 italic mt-1 truncate">"{shop.featuredQuote}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main App Shell ── */
function AppShell() {
  const { role, setRole } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [activeShopId, setActiveShopId] = useState(null);
  const [activeProductId, setActiveProductId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

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
    window.addEventListener('popstate', checkAdmin);
    return () => {
      window.removeEventListener('hashchange', checkAdmin);
      window.removeEventListener('popstate', checkAdmin);
    };
  }, []);

  const toggleFav = (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setActiveShopId(null);
    setActiveProductId(null);
  };

  const goShop = (id) => { setActiveShopId(id); setActiveProductId(null); };
  const goProduct = (id) => setActiveProductId(id);
  const goBackFromProduct = () => setActiveProductId(null);
  const goBackFromShop = () => setActiveShopId(null);
  const goShopFromProduct = (id) => { setActiveProductId(null); setActiveShopId(id); };

  const handleSearchFocus = () => { setActiveTab('search'); setActiveShopId(null); setActiveProductId(null); };

  /* Render page content */
  const renderPage = () => {
    // Product detail — takes priority
    if (activeProductId) {
      return (
        <ProductDetailPage
          productId={activeProductId}
          onBack={goBackFromProduct}
          onShop={goShopFromProduct}
          favorites={favorites}
          onToggleFav={toggleFav}
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
      case 'search':
        return (
          <SearchPage
            onShop={goShop}
            onProduct={goProduct}
            favorites={favorites}
            onToggleFav={toggleFav}
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
          />
        );
      case 'account':
        return (
          <AccountPage
            role={role}
            onLogout={() => setRole('customer')}
            onOpenAdmin={() => setIsAdminMode(true)}
          />
        );
      default:
        return null;
    }
  };

  if (isAdminMode) {
    return (
      <div className="fixed inset-0 flex flex-col bg-[#4440cf] overflow-hidden max-w-md mx-auto overscroll-none">
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

  const showNav = !activeProductId; // hide bottom nav when viewing product? keep visible.

  return (
    <div className="fixed inset-0 flex flex-col bg-[#4440cf] overflow-hidden max-w-md mx-auto overscroll-none">
      {/* Page */}
      <div className="flex-1 overflow-hidden relative">
        {renderPage()}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-4 left-4 right-4 z-40">
        <Navbar2
          navTab={activeTab}
          favorites={favorites}
          handleNavClick={handleNavClick}
          role={role}
        />
      </div>
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
