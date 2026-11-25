import { useState } from 'react';
import { ArrowLeft, Heart, Star, Phone, MessageCircle, ChevronRight, Battery, Shield, AlertTriangle } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_SHOPS } from '../data/mockData';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

const batteryColor = (h) => {
  if (h >= 90) return 'text-green-600 bg-green-50';
  if (h >= 80) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

export default function ProductDetailPage({ productId, onBack, onShop, favorites, onToggleFav }) {
  const product = INITIAL_PRODUCTS.find(p => p.id === productId);
  const shop = product ? INITIAL_SHOPS.find(s => s.id === product.shopId) : null;
  const [imgIdx, setImgIdx] = useState(0);
  const isFav = favorites.includes(productId);

  if (!product) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-400">Product not found.</p>
    </div>
  );

  const images = product.images || [product.image];
  const specs = product.specs || {};
  const used = product.usedDetails;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50">
      {/* ── Image Carousel ── */}
      <div className="relative bg-white flex-shrink-0">
        {/* Back + Fav */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <button
            onClick={() => onToggleFav(productId)}
            className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <Heart size={18} className={isFav ? 'fill-red-500 text-red-500' : 'text-white'} />
          </button>
        </div>

        {/* Image */}
        <div className="h-72 overflow-hidden">
          <img
            src={images[imgIdx]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 py-2.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === imgIdx ? 'w-5 bg-[#4b47d9]' : 'w-1.5 bg-gray-200'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Scrollable Details ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28">
        {/* Product Info */}
        <div className="bg-white px-4 py-4 mt-2 shadow-sm">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              {product.badge && (
                <span className="text-[11px] bg-gray-100 text-gray-500 font-medium px-2.5 py-0.5 rounded-full">{product.badge}</span>
              )}
              <h1 className="text-lg font-black text-gray-900 mt-2 leading-snug">{product.name}</h1>
            </div>
          </div>

          {/* Price row */}
          <div className="flex items-center gap-3 mt-2.5">
            <span className="text-2xl font-black text-[#4b47d9]">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-black/40 line-through">{fmt(product.originalPrice)}</span>
            )}
          </div>

          {/* Condition pills — gray only */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {product.condition === 'new' ? 'New' : 'Used'}
            </span>
            {product.condition === 'new' && (
              <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Shield size={11} /> Genuine
              </span>
            )}
          </div>

          {/* Shop link */}
          {shop && (
            <button
              onClick={() => onShop(shop.id)}
              className="mt-3 w-full flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 active:scale-[0.98] transition-transform"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-gray-800">{shop.name}</p>
                <div className="flex items-center gap-1">
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                  <span className="text-[11px] text-gray-500">{shop.rating} · {shop.distance}</span>
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Used Device Condition Box */}
        {used && (
          <div className="mx-4 mt-3 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-black/50" />
              <h3 className="text-sm font-black text-black">Used Device Condition</h3>
              <span className="ml-auto text-[10px] text-black/40 font-medium bg-gray-100 px-2 py-0.5 rounded-full">Shopkeeper Filled</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-black/40 font-medium">Usage Days</p>
                <p className="text-lg font-black text-black">{used.usageDays}</p>
                <p className="text-[10px] text-black/30">days used</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                <p className="text-[10px] font-medium text-black/40 flex items-center justify-center gap-1"><Battery size={10} /> Battery Health</p>
                <p className="text-lg font-black text-black">{used.batteryHealth}%</p>
                <p className="text-[10px] text-black/30">{used.batteryHealth >= 90 ? 'Excellent' : used.batteryHealth >= 80 ? 'Good' : 'Fair'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-black/40 font-medium">Battery Cycles</p>
                <p className="text-lg font-black text-black">{used.batteryCycles}</p>
                <p className="text-[10px] text-black/30">charge cycles</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-black/40 font-medium">Warranty</p>
                <p className="text-sm font-black text-black">{used.warrantyRemaining}</p>
                <p className="text-[10px] text-black/30">remaining</p>
              </div>
            </div>
            {used.description && (
              <div className="mt-2.5 bg-gray-50 rounded-xl p-2.5">
                <p className="text-[10px] text-black/40 font-medium mb-1">Shopkeeper's Note</p>
                <p className="text-xs text-black/70">{used.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Specs Table */}
        {Object.keys(specs).length > 0 && (
          <div className="mx-4 mt-3 bg-white rounded-2xl card-shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-black text-black">Specifications</h3>
            </div>
            {Object.entries(specs).map(([key, val], i) => (
              <div key={key} className={`flex items-start px-4 py-2.5 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <span className="text-xs font-semibold text-gray-500 w-32 flex-shrink-0">{key}</span>
                <span className="text-xs text-gray-800 font-medium flex-1">{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="h-4" />
      </div>

      {/* ── Action Buttons ── */}
      {shop && (
        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3 pb-safe flex gap-2.5">
          <a
            href={`tel:${shop.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full bg-black text-white text-sm font-bold active:scale-95 transition-transform"
          >
            <Phone size={16} /> Call
          </a>
          <a
            href={`https://wa.me/${shop.whatsapp}`}
            target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full border border-gray-200 text-black text-sm font-bold active:scale-95 transition-transform"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
          <button
            onClick={() => onShop(shop.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full bg-[#4b47d9] text-white text-sm font-bold active:scale-95 transition-transform"
          >
            View Shop
          </button>
        </div>
      )}
    </div>
  );
}
