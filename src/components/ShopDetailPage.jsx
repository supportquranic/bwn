import { useState } from 'react';
import { ArrowLeft, Heart, Star, MapPin, Phone, MessageCircle, Share2, CheckCircle, Grid, List, ChevronRight } from 'lucide-react';
import { INITIAL_SHOPS, INITIAL_PRODUCTS } from '../data/mockData';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

const TAB_ALL = { id: 'all', label: 'All' };
const TABS = [
  TAB_ALL,
  { id: 'android', label: 'Android' },
  { id: 'iphone', label: 'iPhones' },
  { id: 'ipad', label: 'iPads' },
  { id: 'accessories', label: 'Accessories', cats: ['covers', 'headphones', 'handsfree', 'chargers', 'cables'] },
];

export default function ShopDetailPage({ shopId, onBack, onProduct, favorites, onToggleFav }) {
  const shop = INITIAL_SHOPS.find(s => s.id === shopId);
  const [activeTab, setActiveTab] = useState('all');
  const [gridView, setGridView] = useState(true);
  const isFav = favorites.includes(shopId);

  if (!shop) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-400">Shop not found.</p>
    </div>
  );

  const shopProducts = INITIAL_PRODUCTS.filter(p => p.shopId === shopId);
  const tabDef = TABS.find(t => t.id === activeTab);
  const filteredProducts = activeTab === 'all'
    ? shopProducts
    : tabDef?.cats
      ? shopProducts.filter(p => tabDef.cats.includes(p.category))
      : shopProducts.filter(p => p.category === activeTab);

  const featured = filteredProducts.filter(p => p.badge);
  const regular = filteredProducts.filter(p => !p.badge);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Cover Image ── */}
      <div className="relative h-52 flex-shrink-0">
        <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Back & Fav */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Share2 size={16} className="text-white" />
            </button>
            <button
              onClick={() => onToggleFav(shopId)}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
            >
              <Heart size={18} className={isFav ? 'fill-red-500 text-red-500' : 'text-white'} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Shop Info Card ── */}
      <div className="bg-white px-4 pb-4 flex-shrink-0 shadow-sm">
        <div className="flex items-start gap-3 -mt-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0 bg-white">
            <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
          </div>
          <div className="pt-8 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-lg font-black text-gray-900">{shop.name}</h1>
              {shop.verified && (
                <CheckCircle size={16} className="text-blue-600 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-800">{shop.rating}</span>
                <span className="text-xs text-gray-400">({shop.ratingCount} reviews)</span>
              </div>
              <span className="text-gray-200">·</span>
              <span className={`text-xs font-bold ${shop.status === 'open' ? 'text-green-600' : 'text-red-500'}`}>
                {shop.status === 'open' ? '● Open Now' : '● Closed'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-1.5 mt-2">
          <MapPin size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">{shop.address}</p>
        </div>

        {shop.featuredQuote && (
          <p className="text-xs text-blue-600 font-medium mt-1.5 italic">"{shop.featuredQuote}"</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-3">
          <a
            href={`tel:${shop.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-green-500 text-white text-sm font-bold shadow-sm active:scale-95 transition-transform"
          >
            <Phone size={15} /> Call
          </a>
          <a
            href={`https://wa.me/${shop.whatsapp}`}
            target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full border-2 border-green-500 text-green-600 text-sm font-bold active:scale-95 transition-transform"
          >
            <MessageCircle size={15} /> WhatsApp
          </a>
        </div>
      </div>

      {/* ── Tabs + Products ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar bg-gray-50 pb-28 smooth-scroll">
        {/* Tab pills */}
        <div className="sticky top-0 bg-white z-10 shadow-sm">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'gradient-card text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Grid/List toggle */}
          <div className="flex items-center justify-between px-4 pb-2">
            <span className="text-xs text-gray-400">{filteredProducts.length} items</span>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setGridView(true)}
                className={`p-1.5 rounded-md transition-colors ${gridView ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid size={15} className={gridView ? 'text-blue-600' : 'text-gray-400'} />
              </button>
              <button
                onClick={() => setGridView(false)}
                className={`p-1.5 rounded-md transition-colors ${!gridView ? 'bg-white shadow-sm' : ''}`}
              >
                <List size={15} className={!gridView ? 'text-blue-600' : 'text-gray-400'} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 mt-3">
          {/* Featured */}
          {featured.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-700 mb-2.5">⭐ Featured Deals</h3>
              {featured.map(p => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl card-shadow overflow-hidden mb-2.5 cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => onProduct(p.id)}
                >
                  <div className="flex gap-3 p-3">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      {p.condition === 'used' && (
                        <span className="absolute bottom-0 left-0 right-0 text-center bg-amber-500/90 text-white text-[9px] font-bold py-0.5">Used</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {p.badge && (
                        <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">🔥 {p.badge}</span>
                      )}
                      <p className="text-sm font-bold text-gray-800 leading-tight mt-1 line-clamp-2">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-blue-700">{fmt(p.price)}</span>
                        {p.originalPrice && <span className="text-[11px] text-gray-400 line-through">{fmt(p.originalPrice)}</span>}
                        {p.discount > 0 && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">{p.discount}% off</span>}
                      </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); onToggleFav(p.id); }}>
                      <Heart size={18} className={favorites.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
                    </button>
                  </div>
                  <div className="px-3 pb-2.5 flex justify-end">
                    <button className="text-blue-600 text-xs font-bold flex items-center gap-0.5">Details <ChevronRight size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Regular products */}
          {regular.length > 0 && (
            <div>
              {featured.length > 0 && <h3 className="text-sm font-bold text-gray-700 mb-2.5">All Items</h3>}
              {gridView ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {regular.map(p => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl card-shadow overflow-hidden cursor-pointer active:scale-95 transition-transform"
                      onClick={() => onProduct(p.id)}
                    >
                      <div className="relative h-32">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        {p.badge && (
                          <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">🔥 {p.badge}</span>
                        )}
                        {p.condition === 'used' && (
                          <span className="absolute bottom-1.5 left-1.5 bg-amber-100 text-amber-700 text-[9px] font-semibold px-1.5 py-0.5 rounded-full">Used</span>
                        )}
                        <button
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow"
                          onClick={e => { e.stopPropagation(); onToggleFav(p.id); }}
                        >
                          <Heart size={11} className={favorites.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                        </button>
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{p.name}</p>
                        <p className="text-sm font-bold text-blue-700 mt-1">{fmt(p.price)}</p>
                        {p.originalPrice && <p className="text-[10px] text-gray-400 line-through">{fmt(p.originalPrice)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {regular.map(p => (
                    <div
                      key={p.id}
                      className="flex gap-3 items-center bg-white rounded-2xl card-shadow p-3 cursor-pointer active:scale-[0.98] transition-transform"
                      onClick={() => onProduct(p.id)}
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{p.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-sm font-bold text-blue-700">{fmt(p.price)}</span>
                          {p.originalPrice && <span className="text-[11px] text-gray-400 line-through">{fmt(p.originalPrice)}</span>}
                          {p.discount > 0 && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">{p.discount}% off</span>}
                        </div>
                        {p.condition === 'used' && <span className="text-[10px] text-amber-600 font-semibold">♻️ Used</span>}
                      </div>
                      <button onClick={e => { e.stopPropagation(); onToggleFav(p.id); }}>
                        <Heart size={18} className={favorites.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="mt-16 flex flex-col items-center text-center">
              <span className="text-5xl mb-4">📭</span>
              <p className="text-gray-600 font-semibold">No items in this category</p>
              <p className="text-gray-400 text-sm mt-1">Try a different filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
