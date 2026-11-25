import { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Star, Heart, ChevronRight } from 'lucide-react';
import { CATEGORIES, RECENT_SEARCHES, INITIAL_SHOPS, INITIAL_PRODUCTS } from '../data/mockData';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

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
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Search Header ── */}
      <div className="gradient-hero px-4 pt-4 pb-4">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-md">
          <Search size={16} className="text-blue-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shops, phones, accessories…"
            className="flex-1 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-400"
          />
          {query && (
            <button onClick={clearSearch}>
              <X size={15} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28 bg-gray-50 smooth-scroll">

        {/* ── Category Filter ── */}
        <div className="mt-4">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(prev => prev === cat.id ? null : cat.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow transition-all duration-200 ${activeCategory === cat.id ? 'ring-2 ring-blue-600 scale-110' : ''}`}
                  style={{ background: cat.color + '22' }}
                >
                  {cat.emoji}
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {showResults ? (
          /* ── Search Results ── */
          <div className="px-4 mt-4 flex flex-col gap-6">
            {matchedShops.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2.5">🏪 Shops ({matchedShops.length})</h3>
                <div className="flex flex-col gap-2.5">
                  {matchedShops.map(shop => (
                    <div
                      key={shop.id}
                      className="flex gap-3 items-center bg-white rounded-2xl p-3 card-shadow cursor-pointer active:scale-[0.98] transition-transform"
                      onClick={() => onShop(shop.id)}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-bold text-gray-800 truncate">{shop.name}</p>
                          {shop.verified && <span className="text-[10px] text-blue-600 font-bold">✓</span>}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span className="text-xs">{shop.rating}</span>
                          <span className="text-[11px] text-gray-400">· {shop.distance}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{shop.address}</p>
                      </div>
                      <Heart
                        size={18}
                        className={favorites.includes(shop.id) ? 'fill-red-500 text-red-500 cursor-pointer' : 'text-gray-300 cursor-pointer'}
                        onClick={e => { e.stopPropagation(); onToggleFav(shop.id); }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matchedProducts.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2.5">📱 Products ({matchedProducts.length})</h3>
                <div className="flex flex-col gap-2.5">
                  {matchedProducts.map(p => {
                    const shop = INITIAL_SHOPS.find(s => s.id === p.shopId);
                    return (
                      <div
                        key={p.id}
                        className="flex gap-3 items-center bg-white rounded-2xl p-3 card-shadow cursor-pointer active:scale-[0.98] transition-transform"
                        onClick={() => onProduct(p.id)}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{p.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 truncate">🏪 {shop?.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm font-bold text-blue-700">{fmt(p.price)}</span>
                            {p.originalPrice && <span className="text-[11px] text-gray-400 line-through">{fmt(p.originalPrice)}</span>}
                            {p.discount > 0 && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">{p.discount}% off</span>}
                          </div>
                        </div>
                        <Heart
                          size={18}
                          className={favorites.includes(p.id) ? 'fill-red-500 text-red-500 cursor-pointer' : 'text-gray-300 cursor-pointer'}
                          onClick={e => { e.stopPropagation(); onToggleFav(p.id); }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {matchedShops.length === 0 && matchedProducts.length === 0 && (
              <div className="mt-16 flex flex-col items-center text-center">
                <span className="text-5xl mb-4">🔍</span>
                <p className="text-gray-700 font-semibold">No results found</p>
                <p className="text-gray-400 text-sm mt-1">Try searching "iPhone", "Samsung" or "charger"</p>
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
                  <h3 className="text-sm font-bold text-gray-800">Recent searches</h3>
                  <button onClick={clearAll} className="text-blue-600 text-xs font-semibold">Clear All</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(s => (
                    <div key={s} className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
                      <button onClick={() => applySearch(s)} className="text-xs text-gray-700 font-medium">{s}</button>
                      <button onClick={() => removeSearch(s)}>
                        <X size={11} className="text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Shops */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-bold text-gray-800">Popular Shops</h3>
                <button className="text-blue-600 text-xs font-semibold flex items-center gap-0.5">See all <ChevronRight size={13} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {categoryShops.map(shop => (
                  <div
                    key={shop.id}
                    className="bg-white rounded-2xl card-shadow overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => onShop(shop.id)}
                  >
                    <div className="relative h-20">
                      <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover" />
                      {shop.verified && (
                        <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">✓ Verified</span>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-bold text-gray-800 truncate">{shop.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-semibold text-gray-700">{shop.rating}</span>
                        <span className="text-[10px] text-gray-400">· {shop.distance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured on Bahawal Market */}
            <div>
              <div className="mb-2.5">
                <h3 className="text-sm font-bold text-gray-800">Featured on Bahawal Market</h3>
                <p className="text-xs text-gray-400">Sponsored</p>
              </div>
              <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
                {INITIAL_PRODUCTS.filter(p => p.badge).slice(0, 5).map(p => {
                  const shop = INITIAL_SHOPS.find(s => s.id === p.shopId);
                  return (
                    <div
                      key={p.id}
                      className="flex-shrink-0 w-36 bg-white rounded-2xl card-shadow overflow-hidden cursor-pointer active:scale-95 transition-transform"
                      onClick={() => onProduct(p.id)}
                    >
                      <div className="relative h-24">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Ad</span>
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-semibold text-gray-800 leading-tight line-clamp-2">{p.name}</p>
                        <p className="text-xs font-bold text-blue-700 mt-1">{fmt(p.price)}</p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{shop?.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
