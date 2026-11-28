import { useState } from 'react';
import { ArrowLeft, Heart, Star, MapPin, Phone, MessageCircle, Share2, CheckCircle, Grid, List, ChevronRight, Plus, MessageSquare } from 'lucide-react';
import { INITIAL_SHOPS, INITIAL_PRODUCTS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import ReviewModal from './ReviewModal';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

/* ── Authentic Official WhatsApp Brand Logo Component ── */
function WhatsAppIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2Z"
        fill="#25D366"
      />
      <path
        d="M17.36 14.39C17.07 14.24 15.65 13.54 15.38 13.44C15.11 13.34 14.92 13.29 14.73 13.59C14.53 13.88 13.97 14.54 13.8 14.74C13.63 14.94 13.46 14.96 13.17 14.81C12.88 14.66 11.93 14.35 10.81 13.35C9.93 12.57 9.34 11.61 9.17 11.32C9 11.03 9.15 10.87 9.3 10.73C9.43 10.59 9.59 10.38 9.74 10.21C9.88 10.03 9.93 9.91 10.03 9.71C10.13 9.52 10.08 9.35 10.01 9.2C9.93 9.05 9.35 7.63 9.1 7.05C8.87 6.47 8.62 6.55 8.44 6.54H7.87C7.68 6.54 7.35 6.62 7.08 6.91C6.81 7.21 6.03 7.94 6.03 9.42C6.03 10.9 7.11 12.33 7.26 12.53C7.41 12.72 9.38 15.76 12.4 17.06C13.12 17.37 13.68 17.56 14.12 17.7C14.84 17.93 15.5 17.89 16.02 17.82C16.6 17.73 17.8 17.09 18.05 16.38C18.3 15.67 18.3 15.07 18.23 14.94C18.15 14.81 17.65 14.54 17.36 14.39Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

const TAB_ALL = { id: 'all', label: 'All' };
const TABS = [
  TAB_ALL,
  { id: 'android', label: 'Android' },
  { id: 'iphone', label: 'iPhones' },
  { id: 'ipad', label: 'iPads' },
  { id: 'accessories', label: 'Accessories', cats: ['covers', 'headphones', 'handsfree', 'chargers', 'cables'] },
  { id: 'reviews', label: 'Reviews' },
];

export default function ShopDetailPage({ shopId, onBack, onProduct, favorites, onToggleFav, onAddToCart }) {
  const { reviews = [] } = useApp();
  const shop = INITIAL_SHOPS.find(s => s.id === shopId);
  const [activeTab, setActiveTab] = useState('all');
  const [gridView, setGridView] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const isFav = favorites.includes(shopId);

  const shopReviews = reviews.filter(r => r.shopId === shopId);

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
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#8586f2] active:scale-95 transition-transform">
            <ArrowLeft size={18} />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#8586f2] active:scale-95 transition-transform">
              <Share2 size={16} />
            </button>
            <button
              onClick={() => onToggleFav(shopId)}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#8586f2] active:scale-95 transition-transform"
            >
              <Heart size={18} className={isFav ? 'fill-[#8586f2] text-[#8586f2]' : 'text-[#8586f2]'} strokeWidth={1.8} />
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
                <CheckCircle size={16} className="text-gray-700 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <button 
                type="button"
                onClick={() => setActiveTab('reviews')}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-800">{shop.rating}</span>
                <span className="text-xs text-[#8586f2] font-semibold underline underline-offset-2">
                  ({shopReviews.length || shop.ratingCount} reviews)
                </span>
              </button>
              <span className="text-gray-200">·</span>
              <span className={`text-xs font-bold ${shop.status === 'open' ? 'text-gray-700' : 'text-gray-400'}`}>
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
            <WhatsAppIcon size={16} /> WhatsApp
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
                  ? 'bg-[#8586f2] text-white shadow-xs'
                  : 'bg-gray-100 text-black/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Items count */}
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-xs font-medium text-black/40">
            {activeTab === 'reviews' ? `${shopReviews.length} reviews` : `${filteredProducts.length} items`}
          </span>
        </div>
      </div>

      {/* ── Content: Reviews Tab OR Products Grid ── */}
      {activeTab === 'reviews' ? (
        <div className="px-4 mt-3 space-y-3">
          {/* Rating Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Shop Rating</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-black">{shop.rating}</span>
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  Based on {shopReviews.length || shop.ratingCount} verified local reviews
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="py-2 px-3.5 rounded-full bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold active:scale-95 transition-transform flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare size={14} />
                <span>Write Review</span>
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-2.5">
            {shopReviews.length > 0 ? (
              shopReviews.map(rev => (
                <div key={rev.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{rev.userName}</span>
                      <span className="text-[10.5px] text-gray-400 font-medium">{rev.city || 'Bahawalnagar'}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          size={12}
                          className={s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-gray-700 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  )}

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rev.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <p className="text-sm font-bold text-gray-800">No reviews yet for this shop</p>
                <p className="text-xs text-gray-400 mt-1">Have you visited this shop in Bahawalnagar? Share your experience!</p>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(true)}
                  className="mt-3 py-2 px-4 rounded-full bg-[#8586f2] text-white text-xs font-bold"
                >
                  Write the First Review
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="px-4 mt-3 space-y-4">
          {/* Products Grid — Using exact Explore page square product card layout & styling */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredProducts.map(p => {
                const storage = p.specs?.Storage || (p.condition === 'new' ? 'Box Pack' : 'In Stock');
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
                          className="w-full h-full object-contain p-2.5"
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
          ) : (
            <div className="mt-16 flex flex-col items-center text-center">
              <p className="text-black/60 font-semibold text-sm">No items in this category</p>
              <p className="text-black/40 text-xs mt-1">Try selecting a different tab</p>
            </div>
          )}

          {/* Compact Customer Reviews Preview Card under Products */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-gray-900">
                  Customer Reviews ({shopReviews.length || shop.ratingCount})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="text-xs font-bold text-[#8586f2] hover:underline flex items-center gap-1"
              >
                <MessageSquare size={12} />
                <span>Write Review</span>
              </button>
            </div>
            {shopReviews.length > 0 ? (
              <div className="bg-gray-50/70 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">{shopReviews[0].userName}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={10} className={s <= shopReviews[0].rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 line-clamp-2 italic">
                  "{shopReviews[0].comment}"
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="mt-2 text-[10.5px] font-bold text-[#8586f2] hover:underline"
                >
                  View All {shopReviews.length} Reviews →
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">No reviews yet. Be the first to review this retailer!</p>
            )}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        targetType="shop"
        targetTitle={shop.name}
        shopId={shop.id}
      />
    </div>
  );
}
