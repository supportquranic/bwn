import { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Star, Heart, ChevronRight, Plus, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CATEGORIES, RECENT_SEARCHES, INITIAL_SHOPS, INITIAL_PRODUCTS } from '../data/mockData';
import FilterDrawerModal from './FilterDrawerModal';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

const CAT_3D_ICONS = {
  iphone:     '/icons/categories/iphone.png',
  android:    '/icons/categories/android.png',
  airpods:    '/icons/categories/airpods.png',
  smartwatch: '/icons/categories/smartwatch.png',
  headphones: '/icons/categories/headphones.png',
  handsfree:  '/icons/categories/handsfree.png',
  chargers:   '/icons/categories/chargers.png',
  cases:      '/icons/categories/cases.png',
};

export default function SearchPage({ onShop, onProduct, favorites, onToggleFav, onAddToCart, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: 'All',
    minPrice: 0,
    maxPrice: 1000000,
    pta: 'all',
    condition: 'all',
    sortBy: 'featured',
  });
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const clearSearch = () => { setQuery(''); inputRef.current?.focus(); };
  const clearAll = () => setRecentSearches([]);
  const removeSearch = (s) => setRecentSearches(r => r.filter(x => x !== s));
  const applySearch = (s) => { setQuery(s); };

  const hasActiveFilters = filters.brand !== 'All' || 
    filters.minPrice > 0 || 
    filters.maxPrice < 1000000 || 
    filters.pta !== 'all' || 
    filters.condition !== 'all' || 
    filters.sortBy !== 'featured';

  /* Live search */
  const q = query.toLowerCase().trim();
  const matchedShops = q
    ? INITIAL_SHOPS.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q) || s.categories.some(c => c.includes(q)))
    : [];

  const baseProducts = INITIAL_PRODUCTS.filter(p => {
    // 1. Text Search Match
    if (q) {
      const matchText = p.name.toLowerCase().includes(q) || 
        p.category.includes(q) || 
        (p.specs && Object.values(p.specs).some(val => String(val).toLowerCase().includes(q)));
      if (!matchText) return false;
    }

    // 2. Category Match
    if (activeCategory) {
      const isMatch = p.category === activeCategory || (p.name || '').toLowerCase().includes(activeCategory);
      if (!isMatch) return false;
    }

    // 3. Brand Match
    if (filters.brand !== 'All') {
      const brandLower = filters.brand.toLowerCase();
      const pNameLower = p.name.toLowerCase();
      if (!pNameLower.includes(brandLower) && !(p.specs?.Brand && p.specs.Brand.toLowerCase() === brandLower)) {
        return false;
      }
    }

    // 4. Price Match
    if (p.price < filters.minPrice || p.price > filters.maxPrice) {
      return false;
    }

    // 5. PTA Match
    if (filters.pta !== 'all') {
      const isPTA = p.usedDetails ? p.usedDetails.ptaApproved !== false : !p.name.toLowerCase().includes('non pta') && !p.name.toLowerCase().includes('jv');
      if (filters.pta === 'pta' && !isPTA) return false;
      if (filters.pta === 'non-pta' && isPTA) return false;
    }

    // 6. Condition Match
    if (filters.condition !== 'all') {
      const isUsed = Boolean(p.usedDetails || p.condition === 'used');
      if (filters.condition === 'new' && isUsed) return false;
      if (filters.condition === 'used' && !isUsed) return false;
    }

    return true;
  });

  // Sort
  const matchedProducts = [...baseProducts].sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.price - b.price;
    if (filters.sortBy === 'price-high') return b.price - a.price;
    if (filters.sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8);
    return 0;
  });

  /* Category-filtered shops when no text query */
  const categoryShops = !q && activeCategory
    ? INITIAL_SHOPS.filter(s => s.categories.includes(activeCategory))
    : INITIAL_SHOPS;

  const showResults = Boolean(q || hasActiveFilters || activeCategory);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* ── Search Header ── */}
      <div className="px-4 pt-4 pb-4 text-white flex-shrink-0 z-30" style={{ background: '#8586f2' }}>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-sm">
            <Search size={16} className="text-[#8586f2] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search shops, phones, accessories…"
              className="flex-1 text-sm text-black outline-none bg-transparent placeholder-black/40 font-medium"
              style={{ fontSize: '16px' }}
            />
            {query && (
              <button onClick={clearSearch}>
                <X size={15} className="text-black/40" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 relative shadow-xs flex-shrink-0 ${
              hasActiveFilters ? 'bg-white text-[#8586f2]' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="Filter & Sort"
          >
            <SlidersHorizontal size={17} />
            {hasActiveFilters && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
            )}
          </button>
        </div>

        {/* Active Filter Badges Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto hide-scrollbar pt-0.5">
            <span className="text-[10.5px] font-bold text-white/80 uppercase tracking-wider flex-shrink-0">
              Filters:
            </span>
            {filters.brand !== 'All' && (
              <span className="text-[10px] font-bold bg-white text-[#8586f2] px-2.5 py-0.5 rounded-full flex-shrink-0">
                Brand: {filters.brand}
              </span>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 1000000) && (
              <span className="text-[10px] font-bold bg-white text-[#8586f2] px-2.5 py-0.5 rounded-full flex-shrink-0">
                Rs. {filters.minPrice.toLocaleString()} - {filters.maxPrice >= 1000000 ? 'Max' : filters.maxPrice.toLocaleString()}
              </span>
            )}
            {filters.pta !== 'all' && (
              <span className="text-[10px] font-bold bg-white text-[#8586f2] px-2.5 py-0.5 rounded-full flex-shrink-0">
                {filters.pta === 'pta' ? 'PTA Approved' : 'Non-PTA'}
              </span>
            )}
            {filters.condition !== 'all' && (
              <span className="text-[10px] font-bold bg-white text-[#8586f2] px-2.5 py-0.5 rounded-full flex-shrink-0">
                {filters.condition === 'new' ? 'Brand New' : 'Used'}
              </span>
            )}
            {filters.sortBy !== 'featured' && (
              <span className="text-[10px] font-bold bg-white text-[#8586f2] px-2.5 py-0.5 rounded-full flex-shrink-0">
                Sort: {filters.sortBy}
              </span>
            )}
            <button
              onClick={() => setFilters({
                brand: 'All',
                minPrice: 0,
                maxPrice: 1000000,
                pta: 'all',
                condition: 'all',
                sortBy: 'featured',
              })}
              className="text-[10.5px] font-bold text-white underline ml-1 hover:text-white/80 flex-shrink-0"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28 bg-[#f8f9fc] smooth-scroll">

        {/* ── Category Filter (Clean 3D icons, zero gradients/emojis) ── */}
        <div className="mt-4">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(prev => prev === cat.id ? null : cat.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center p-2 bg-white border transition-all ${
                    activeCategory === cat.id ? 'border-[#8586f2] shadow-xs scale-105' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={CAT_3D_ICONS[cat.id] || `/icons/categories/${cat.id}.png`}
                    alt={cat.label}
                    className="w-full h-full object-contain pointer-events-none"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <span className={`text-[11px] font-semibold ${activeCategory === cat.id ? 'text-[#8586f2] font-bold' : 'text-black/70'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {showResults ? (
          /* ── Search Results ── */
          <div className="px-4 mt-4 flex flex-col gap-6">
            {matchedShops.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-black mb-2.5">Shops ({matchedShops.length})</h3>
                <div className="flex flex-col gap-2.5">
                  {matchedShops.map(shop => (
                    <div
                      key={shop.id}
                      className="bg-white rounded-3xl border border-gray-200 p-3.5 flex items-center gap-3.5 active:scale-[0.99] transition-transform cursor-pointer"
                      onClick={() => onShop(shop.id)}
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                        <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[68px]">
                        <div>
                          <h4 className="text-sm font-bold text-black truncate">{shop.name}</h4>
                          <span className="text-[10px] font-semibold text-gray-500">
                            {shop.verified ? 'Verified Shop' : 'Local Retailer'} · {shop.distance}
                          </span>
                        </div>
                        <p className="text-xs text-black/45 truncate mt-0.5">{shop.address}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-black">{shop.rating}</span>
                          <span className="text-[10px] text-black/40">({shop.ratingCount})</span>
                        </div>
                      </div>
                      <button
                        className="flex-shrink-0 bg-[#8586f2] hover:bg-[#7375e8] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
                        onClick={e => { e.stopPropagation(); onShop(shop.id); }}
                      >
                        Visit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matchedProducts.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-black mb-2.5">Products ({matchedProducts.length})</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {matchedProducts.map(p => {
                    const isAccessory = ['cases', 'covers', 'airpods', 'smartwatch', 'chargers', 'headphones', 'handsfree', 'cables'].includes(p.category) ||
                      ['case', 'cover', 'glass', 'protector', 'charger', 'buds', 'watch', 'handsfree', 'earphone', 'cable'].some(kw => (p.name || '').toLowerCase().includes(kw));
                    const storage = isAccessory ? null : (p.specs?.Storage || (p.condition === 'new' ? 'Box Pack' : 'In Stock'));
                    return (
                      <div
                        key={p.id}
                        className="w-full h-full bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                        onClick={() => onProduct(p.id)}
                      >
                        <div className="px-3 pt-3 pb-1 flex-shrink-0">
                          <div className="w-full aspect-square bg-transparent rounded-2xl overflow-hidden flex items-center justify-center">
                            <img
                              src={p.image}
                              alt={p.name}
                              className={`w-full h-full ${
                                isAccessory ? 'object-cover' : 'object-contain p-2.5'
                              }`}
                            />
                          </div>
                        </div>
                        <div className="px-3 pb-3 pt-1 flex flex-col justify-between flex-1">
                          <p className="text-xs font-bold text-black leading-snug line-clamp-2 h-8 mb-2">
                            {p.name}
                          </p>
                          <div className="flex items-center justify-between gap-1.5 mt-auto">
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-black text-[#8586f2] truncate">{fmt(p.price)}</span>
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
                                onProduct(p.id);
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
                  })}
                </div>
              </div>
            )}

            {matchedShops.length === 0 && matchedProducts.length === 0 && (
              <div className="mt-16 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-black/40 mb-3">
                  <Search size={22} />
                </div>
                <p className="text-black font-semibold text-sm">No results found</p>
                <p className="text-black/40 text-xs mt-1">Try searching "iPhone", "Samsung" or "charger"</p>
              </div>
            )}
          </div>
        ) : (
          /* ── Default State ── */
          <div className="px-4 mt-4 flex flex-col gap-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-black">Recent searches</h3>
                  <button onClick={clearAll} className="text-[#8586f2] text-xs font-semibold">Clear All</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(s => (
                    <div key={s} className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 border border-gray-200">
                      <button onClick={() => applySearch(s)} className="text-xs text-black/80 font-medium">{s}</button>
                      <button onClick={() => removeSearch(s)}>
                        <X size={11} className="text-black/40" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Shops */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-bold text-black">Popular Shops</h3>
                <span className="text-black/40 text-xs font-medium">{categoryShops.length} shops</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {categoryShops.map(shop => (
                  <div
                    key={shop.id}
                    className="bg-white rounded-3xl border border-gray-200 p-3.5 flex items-center gap-3.5 active:scale-[0.99] transition-transform cursor-pointer"
                    onClick={() => onShop(shop.id)}
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                      <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-black truncate">{shop.name}</h4>
                      <p className="text-xs text-black/40 mt-0.5 truncate">{shop.address}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-black">{shop.rating}</span>
                        <span className="text-[10px] text-black/40">({shop.ratingCount}) · {shop.distance}</span>
                      </div>
                    </div>
                    <button
                      className="flex-shrink-0 bg-[#8586f2] hover:bg-[#7375e8] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
                      onClick={e => { e.stopPropagation(); onShop(shop.id); }}
                    >
                      Visit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Sort Drawer Modal */}
      <FilterDrawerModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        onResetFilters={() => setFilters({
          brand: 'All',
          minPrice: 0,
          maxPrice: 1000000,
          pta: 'all',
          condition: 'all',
          sortBy: 'featured',
        })}
        totalResultsCount={matchedProducts.length}
      />
    </div>
  );
}
