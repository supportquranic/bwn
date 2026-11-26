import { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Star, Heart, ChevronRight } from 'lucide-react';
import { CATEGORIES, RECENT_SEARCHES, INITIAL_SHOPS, INITIAL_PRODUCTS } from '../data/mockData';

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

export default function SearchPage({ onShop, onProduct, favorites, onToggleFav, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [activeCategory, setActiveCategory] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const clearSearch = () => { setQuery(''); inputRef.current?.focus(); };
  const clearAll = () => setRecentSearches([]);
  const removeSearch = (s) => setRecentSearches(r => r.filter(x => x !== s));
  const applySearch = (s) => { setQuery(s); };

  /* Live search */
  const q = query.toLowerCase().trim();
  const matchedShops = q
    ? INITIAL_SHOPS.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q) || s.categories.some(c => c.includes(q)))
    : [];
  const matchedProducts = q
    ? INITIAL_PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q))
    : [];

  /* Category-filtered shops when no text query */
  const categoryShops = !q && activeCategory
    ? INITIAL_SHOPS.filter(s => s.categories.includes(activeCategory))
    : INITIAL_SHOPS;

  const showResults = !!q;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* ── Search Header ── */}
      <div className="px-4 pt-4 pb-4 text-white flex-shrink-0 z-30" style={{ background: '#8586f2' }}>
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-sm">
          <Search size={16} className="text-[#4b47d9] flex-shrink-0" />
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
                    activeCategory === cat.id ? 'border-[#4b47d9] shadow-xs scale-105' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={CAT_3D_ICONS[cat.id] || `/icons/categories/${cat.id}.png`}
                    alt={cat.label}
                    className="w-full h-full object-contain pointer-events-none"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <span className={`text-[11px] font-semibold ${activeCategory === cat.id ? 'text-[#4b47d9] font-bold' : 'text-black/70'}`}>
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
                          <span className="text-[10px] font-semibold text-emerald-600">
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
                        className="flex-shrink-0 bg-[#4b47d9] hover:bg-[#3d39c6] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
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
                    const storage = p.specs?.Storage || (p.condition === 'new' ? 'Box Pack' : 'In Stock');
                    return (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                        onClick={() => onProduct(p.id)}
                      >
                        <div className="px-3 pt-4 pb-2.5 flex-1 flex items-center justify-center min-h-[156px]">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="max-h-36 max-w-full object-contain"
                          />
                        </div>
                        <div className="px-3 pb-3.5 pt-0 flex flex-col justify-end">
                          <p className="text-xs font-bold text-black leading-snug line-clamp-2 mb-2">
                            {p.name}
                          </p>
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-[#4b47d9]">{fmt(p.price)}</span>
                              <span className="text-[10px] font-semibold text-black/45 leading-none mt-1">
                                {storage}
                              </span>
                            </div>
                            <button
                              className="flex-shrink-0 bg-[#4b47d9] hover:bg-[#3d39c6] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
                              onClick={e => { e.stopPropagation(); onProduct(p.id); }}
                            >
                              Buy now
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
                  <button onClick={clearAll} className="text-[#4b47d9] text-xs font-semibold">Clear All</button>
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
                      className="flex-shrink-0 bg-[#4b47d9] hover:bg-[#3d39c6] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
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
    </div>
  );
}
