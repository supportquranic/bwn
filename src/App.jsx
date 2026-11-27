import { useState, useEffect } from 'react';
import { Compass, Store, Headphones, Heart, User, Star, ArrowUpRight } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { INITIAL_PRODUCTS, INITIAL_SHOPS } from './data/mockData';
import { useCustomImages } from './utils/imageStore';
import { Navbar2 } from './components/NavbarOptions';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import AccessoriesPage from './components/AccessoriesPage';
import ShopDetailPage from './components/ShopDetailPage';
import ProductDetailPage from './components/ProductDetailPage';
import AccountPage from './components/AccountPage';
import AdminVisualEditor from './components/AdminVisualEditor';

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
            className="flex-shrink-0 bg-[#4b47d9] hover:bg-[#3d39c6] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
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
function ProductSquareCard({ product, onProduct }) {
  const storage = product.specs?.Storage || (product.condition === 'new' ? 'Box Pack' : 'In Stock');

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
      onClick={() => onProduct(product.id)}
    >
      {/* Taller upper image area — image centered with extra vertical room */}
      <div className="px-3 pt-4 pb-2.5 flex-1 flex items-center justify-center min-h-[156px]">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-36 max-w-full object-contain"
        />
      </div>

      {/* Content area at bottom: title sits near price, storage directly under price */}
      <div className="px-3 pb-3.5 pt-0 flex flex-col justify-end">
        <p className="text-xs font-bold text-black leading-snug line-clamp-2 mb-2">
          {product.name}
        </p>
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#4b47d9]">{fmt(product.price)}</span>
            <span className="text-[10px] font-semibold text-black/45 leading-none mt-1">
              {storage}
            </span>
          </div>
          <button
            className="flex-shrink-0 bg-[#4b47d9] hover:bg-[#3d39c6] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
            onClick={e => { e.stopPropagation(); onProduct(product.id); }}
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Favorites Page (Full-width toggle switch: Saved Products or Saved Shops) ── */
function FavoritesPage({ favorites, onProduct, onShop, onToggleFav }) {
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
                savedTab === 'products' ? 'bg-[#4b47d9] text-white' : 'bg-gray-200 text-black/60'
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
                savedTab === 'shops' ? 'bg-[#4b47d9] text-white' : 'bg-gray-200 text-black/60'
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
                <div className="w-14 h-14 rounded-3xl bg-gray-100 flex items-center justify-center mb-3 text-[#4b47d9]">
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
                  <ProductSquareCard key={p.id} product={p} onProduct={onProduct} />
                ))}
              </div>
            ) : (
              <div className="mt-24 flex flex-col items-center text-center px-8">
                <div className="w-14 h-14 rounded-3xl bg-gray-100 flex items-center justify-center mb-3 text-[#4b47d9]">
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
            className="bg-black hover:bg-black/85 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform"
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
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div className="px-4 pt-4 pb-3.5 text-white flex-shrink-0 z-30" style={{ background: '#8586f2' }}>
        <h2 className="text-white text-lg font-black tracking-tight">All Shops</h2>
        <p className="text-white/80 text-[11px] font-medium">Bahawalnagar, Pakistan · {INITIAL_SHOPS.length} verified retailers</p>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28 bg-[#f8f9fc] smooth-scroll">
        <div className="px-4 mt-4 flex flex-col gap-3.5">
          {INITIAL_SHOPS.map(shop => (
            <ShopShowcaseCard key={shop.id} shop={shop} onShop={onShop} />
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
          onProduct={goProduct}
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
      case 'accessories':
        return (
          <AccessoriesPage
            onProduct={goProduct}
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

  const showNav = !activeProductId; // hide bottom nav when viewing product? keep visible.

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
