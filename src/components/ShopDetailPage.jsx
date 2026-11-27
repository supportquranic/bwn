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
    <div className="h-full overflow-y-auto hide-scrollbar bg-[#f8f9fc] pb-28 smooth-scroll">
      {/* ── Cover Image ── */}
      <div className="relative h-52">
        <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Back & Fav */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
              <Share2 size={16} className="text-white" />
            </button>
            <button
              onClick={() => onToggleFav(shopId)}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
            >
              <Heart size={18} className={isFav ? 'fill-[#4b47d9] text-[#4b47d9]' : 'text-white'} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Shop Info Card ── */}
      <div className="bg-white px-4 pb-4 shadow-sm">
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

      {/* ── Tabs (Sticky at top when scrolled) ── */}
      <div className="sticky top-0 bg-white z-20 border-b border-gray-100 shadow-xs">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#4b47d9] text-white shadow-xs'
                  : 'bg-gray-100 text-black/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Items count */}
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-xs font-medium text-black/40">{filteredProducts.length} items</span>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div className="px-4 mt-3">
          {/* Products Grid — Using exact Explore page square product card layout & styling */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredProducts.map(p => {
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
          ) : (
            <div className="mt-16 flex flex-col items-center text-center">
              <p className="text-black/60 font-semibold text-sm">No items in this category</p>
              <p className="text-black/40 text-xs mt-1">Try selecting a different tab</p>
            </div>
          )}
        </div>
      </div>
  );
}
