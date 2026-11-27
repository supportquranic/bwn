import { useState } from 'react';
import { ArrowLeft, Heart, Star, Phone, MessageCircle, ChevronRight, ChevronLeft, Battery, Shield, AlertTriangle } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_SHOPS } from '../data/mockData';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

const batteryColor = (h) => {
  if (h >= 90) return 'text-green-600 bg-green-50';
  if (h >= 80) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

/* ── Helper: Related Covers & Glass Protectors (Checks current shop first, then others) ── */
function getRelatedAccessories(currentProduct, allProducts) {
  if (!currentProduct) return [];
  const productNameLower = (currentProduct.name || '').toLowerCase();
  
  const terms = [];
  if (productNameLower.includes('iphone') || currentProduct.category === 'iphone') terms.push('iphone', 'apple');
  if (productNameLower.includes('s25') || productNameLower.includes('s21') || productNameLower.includes('samsung') || productNameLower.includes('galaxy')) terms.push('samsung', 'galaxy', 's25', 's21');
  if (productNameLower.includes('pixel')) terms.push('pixel', 'google');
  if (productNameLower.includes('redmi') || productNameLower.includes('xiaomi')) terms.push('redmi', 'xiaomi');
  if (productNameLower.includes('tecno') || productNameLower.includes('camon') || productNameLower.includes('spark')) terms.push('tecno', 'camon', 'spark');
  if (productNameLower.includes('infinix') || productNameLower.includes('hot') || productNameLower.includes('gt')) terms.push('infinix', 'gt', 'hot');
  if (productNameLower.includes('realme')) terms.push('realme');
  if (productNameLower.includes('vivo')) terms.push('vivo');
  if (productNameLower.includes('itel')) terms.push('itel');
  if (productNameLower.includes('oneplus')) terms.push('oneplus');

  const isCoverOrGlass = (p) => {
    const name = (p.name || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    return cat === 'cases' || name.includes('case') || name.includes('cover') || name.includes('glass') || name.includes('protector');
  };

  const matchesPhone = (p) => {
    if (p.compatibleModels && Array.isArray(p.compatibleModels)) {
      return p.compatibleModels.some(model => {
        const m = model.toLowerCase();
        return terms.some(t => m.includes(t) || t.includes(m)) || productNameLower.includes(m);
      });
    }
    const name = (p.name || '').toLowerCase();
    return terms.some(t => name.includes(t));
  };

  // 1. From current shop first
  const fromThisShop = allProducts.filter(p =>
    p.id !== currentProduct.id &&
    p.shopId === currentProduct.shopId &&
    isCoverOrGlass(p) &&
    matchesPhone(p)
  );

  // 2. From other shops for the same phone
  const fromOtherShops = allProducts.filter(p =>
    p.id !== currentProduct.id &&
    p.shopId !== currentProduct.shopId &&
    isCoverOrGlass(p) &&
    matchesPhone(p)
  );

  // 3. Fallback covers & protectors if specific device match is low
  const fallbackCovers = allProducts.filter(p =>
    p.id !== currentProduct.id &&
    isCoverOrGlass(p) &&
    !fromThisShop.includes(p) &&
    !fromOtherShops.includes(p)
  );

  const combined = [...fromThisShop, ...fromOtherShops, ...fallbackCovers];

  const glassProtectors = combined.filter(p => {
    const n = (p.name || '').toLowerCase();
    return n.includes('glass') || n.includes('protector');
  });
  const covers = combined.filter(p => {
    const n = (p.name || '').toLowerCase();
    return n.includes('case') || n.includes('cover') || (!n.includes('glass') && !n.includes('protector'));
  });

  const selected = [];
  let g = 0, c = 0;
  // Ensure a diverse mix of 3-4 options (both covers and protectors)
  while (selected.length < 4 && (g < glassProtectors.length || c < covers.length)) {
    if (c < covers.length && !selected.includes(covers[c])) {
      selected.push(covers[c++]);
    }
    if (selected.length < 4 && g < glassProtectors.length && !selected.includes(glassProtectors[g])) {
      selected.push(glassProtectors[g++]);
    }
  }

  for (const item of combined) {
    if (selected.length >= 4) break;
    if (!selected.includes(item)) selected.push(item);
  }

  return selected.slice(0, 4);
}

export default function ProductDetailPage({ productId, onBack, onShop, onProduct, favorites, onToggleFav }) {
  const product = INITIAL_PRODUCTS.find(p => p.id === productId);
  const shop = product ? INITIAL_SHOPS.find(s => s.id === product.shopId) : null;
  const [imgIdx, setImgIdx] = useState(0);
  const isFav = favorites.includes(productId);

  if (!product) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-400">Product not found.</p>
    </div>
  );

  // Guarantee at least 2 images for the hero section carousel
  const images = (product.images && product.images.length >= 2)
    ? product.images
    : [product.image, product.image];

  const specs = product.specs || {};
  const used = product.usedDetails;
  const relatedItems = getRelatedAccessories(product, INITIAL_PRODUCTS);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50">
      {/* ── Scrollable Content (Carousel + Details) ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-6 smooth-scroll">
        {/* ── Image Carousel ── */}
        <div className="relative bg-white border-b border-gray-100">
          {/* Back + Fav */}
          <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-transform shadow-xs"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => onToggleFav(productId)}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center pointer-events-auto active:scale-95 transition-transform shadow-xs"
            >
              <Heart size={18} className={isFav ? 'fill-red-500 text-red-500' : 'text-white'} />
            </button>
          </div>

          {/* Image */}
          <div className="h-72 overflow-hidden flex items-center justify-center bg-gray-50/40 relative">
            <img
              src={images[imgIdx]}
              alt={product.name}
              className="max-h-72 max-w-full object-contain transition-all duration-300"
            />
            {/* Left / Right chevron buttons */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform shadow-xs"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform shadow-xs"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            {/* Image counter indicator (e.g. 1 / 2, 2 / 2) */}
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full">
              {imgIdx + 1} / {images.length}
            </div>
          </div>

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="flex justify-center items-center gap-1.5 py-2.5 bg-white">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === imgIdx ? 'w-5 bg-[#4b47d9]' : 'w-1.5 bg-gray-200'}`}
                />
              ))}
            </div>
          )}
        </div>

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

        {/* ── Related Covers & Glass Protectors Section (Current Shop First, then Others) ── */}
        {relatedItems.length > 0 && (
          <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-3.5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-black text-black">Available Covers & Protectors</h3>
                <p className="text-[10.5px] font-semibold text-black/45 mt-0.5">Compatible with {product.name}</p>
              </div>
              <span className="text-[10px] font-bold text-[#4b47d9] bg-[#4b47d9]/10 px-2.5 py-0.5 rounded-full">
                {relatedItems.length} Options
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {relatedItems.map(item => {
                const isCurrentShop = item.shopId === product.shopId;
                const itemShop = INITIAL_SHOPS.find(s => s.id === item.shopId);
                const isGlass = (item.name || '').toLowerCase().includes('glass') || (item.name || '').toLowerCase().includes('protector');

                return (
                  <div
                    key={item.id}
                    onClick={() => onProduct && onProduct(item.id)}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                  >
                    {/* Badge: Shop Availability */}
                    <div className="px-2.5 pt-2.5 flex items-center justify-between gap-1">
                      {isCurrentShop ? (
                        <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                          ✓ This Shop
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[95px]" title={itemShop?.name}>
                          {itemShop ? itemShop.name.split(' ')[0] : 'Other Shop'}
                        </span>
                      )}
                      <span className="text-[9.5px] font-bold text-black/40 flex-shrink-0">
                        {isGlass ? 'Glass' : 'Cover'}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="px-2 py-2 flex items-center justify-center min-h-[105px] bg-gray-50/40">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-24 max-w-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="px-3 pb-3 pt-1 flex flex-col justify-between flex-1">
                      <p className="text-xs font-bold text-black leading-snug line-clamp-2 mb-2">
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between gap-1 mt-auto">
                        <span className="text-xs font-black text-[#4b47d9]">{fmt(item.price)}</span>
                        <button
                          type="button"
                          className="flex-shrink-0 bg-[#4b47d9] hover:bg-[#3d39c6] text-white text-[10px] font-bold px-2.5 py-1 rounded-full active:scale-95 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onProduct) onProduct(item.id);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
