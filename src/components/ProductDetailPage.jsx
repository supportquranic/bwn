import { useState } from 'react';
import { ArrowLeft, Heart, Star, Phone, MessageCircle, ChevronRight, Battery, Shield, AlertTriangle, ShoppingCart, CheckCircle } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_SHOPS } from '../data/mockData';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

const batteryColor = (h) => {
  if (h >= 90) return 'text-green-600 bg-green-50';
  if (h >= 80) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

/* ── Fallback generator to guarantee exactly 3 images ── */
function getThreeImages(product) {
  if (!product) return [];
  const list = product.images && Array.isArray(product.images) && product.images.length > 0
    ? [...product.images]
    : [product.image];

  const pName = (product.name || '').toLowerCase();
  const fallbacks = [];
  if (pName.includes('iphone') || product.category === 'iphone') {
    fallbacks.push('/product images/ip18pblk.png', '/product images/ip 17p.png', '/product images/ip 17pm.png', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80');
  } else if (pName.includes('samsung') || pName.includes('galaxy') || pName.includes('s25')) {
    fallbacks.push('/product images/s25 ultra.png', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80');
  } else if (pName.includes('pixel')) {
    fallbacks.push('/product images/pixel 9.png', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80');
  } else if (pName.includes('glass') || pName.includes('protector')) {
    fallbacks.push('https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80', 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&q=80', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&q=80');
  } else if (pName.includes('case') || pName.includes('cover')) {
    fallbacks.push('https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=600&q=80', 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=80', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&q=80');
  } else {
    fallbacks.push('https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', 'https://images.unsplash.com/photo-1598327105854-7d2e3c822e51?w=800&q=80', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80');
  }

  while (list.length < 3) {
    const next = fallbacks.find(f => !list.includes(f)) || product.image;
    list.push(next);
  }

  return list.slice(0, 3);
}

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
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [addedToast, setAddedToast] = useState(false);
  const isFav = favorites.includes(productId);

  if (!product) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-400">Product not found.</p>
    </div>
  );

  // Guarantee exactly 3 images for the hero section carousel
  const images = (product.images && product.images.length >= 3)
    ? product.images.slice(0, 3)
    : getThreeImages(product);

  const specs = product.specs || {};
  const used = product.usedDetails;
  const relatedItems = getRelatedAccessories(product, INITIAL_PRODUCTS);

  // Swipe support without needing left/right chevron icons
  const minSwipeDistance = 45;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setImgIdx((prev) => (prev + 1) % images.length);
    } else if (distance < -minSwipeDistance) {
      setImgIdx((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleAddToCart = () => {
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const handleBuyNow = () => {
    const msg = `Hi, I want to buy *${product.name}* (${fmt(product.price)}) from *${shop?.name || 'Bahawal Market'}*. Is it available?`;
    window.open(`https://wa.me/${shop?.whatsapp || '923121234567'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 relative">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 pointer-events-none">
          <CheckCircle size={15} className="text-emerald-400" />
          <span>Item added to cart!</span>
        </div>
      )}

      {/* ── Scrollable Content (Carousel + Details) ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-6 smooth-scroll">
        {/* ── Image Carousel (3 Images, Left/Right Icons Removed) ── */}
        <div className="relative bg-white border-b border-gray-100">
          {/* Back button only (Favorite moved under image) */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform shadow-xs"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          {/* Image Display with Touch Swipe */}
          <div
            className="h-72 overflow-hidden flex items-center justify-center bg-gray-50/40 relative cursor-pointer select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={() => setImgIdx((prev) => (prev + 1) % images.length)}
          >
            <img
              src={images[imgIdx]}
              alt={`${product.name} view ${imgIdx + 1}`}
              className="max-h-72 max-w-full object-contain transition-all duration-300"
            />
            {/* Image counter indicator (1/3, 2/3, 3/3) */}
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10.5px] font-bold px-2.5 py-0.5 rounded-full pointer-events-none">
              {imgIdx + 1} / {images.length}
            </div>
          </div>

          {/* 3 Dots Indicator (Interactive) */}
          <div className="flex justify-center items-center gap-2 py-3 bg-white">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImgIdx(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${i === imgIdx ? 'w-6 bg-[#4b47d9]' : 'w-2 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Product Info Card (With Favorite Icon Moved Under Image) */}
        <div className="bg-white px-4 py-4 mt-2 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {product.badge && (
                <span className="text-[11px] bg-gray-100 text-gray-500 font-medium px-2.5 py-0.5 rounded-full">{product.badge}</span>
              )}
              <h1 className="text-lg font-black text-gray-900 mt-2 leading-snug">{product.name}</h1>
            </div>

            {/* ── Moved Add to Favorite Icon Directly Under Image ── */}
            <button
              onClick={() => onToggleFav(productId)}
              className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center active:scale-95 transition-transform flex-shrink-0 mt-1 shadow-xs"
              aria-label={isFav ? 'Remove from Saved' : 'Add to Favorite'}
            >
              <Heart size={20} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
            </button>
          </div>

          {/* Price row */}
          <div className="flex items-center gap-3 mt-2.5">
            <span className="text-2xl font-black text-[#4b47d9]">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-black/40 line-through">{fmt(product.originalPrice)}</span>
            )}
          </div>

          {/* Condition pills */}
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
        <div className="h-6" />
      </div>

      {/* ── Fixed Bottom Action Bar with Add to Cart & Buy Now ── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3 pb-safe flex items-center gap-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
        {/* Contact Icons (WhatsApp & Call) */}
        {shop && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(`Hi, I am interested in buying ${product.name} (${fmt(product.price)}) from ${shop.name}. Is it available?`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-green-200 bg-green-50 text-green-600 flex items-center justify-center active:scale-95 transition-transform"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href={`tel:${shop.phone}`}
              className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 text-gray-700 flex items-center justify-center active:scale-95 transition-transform"
              title="Call Shop"
            >
              <Phone size={17} />
            </a>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 rounded-full border-2 border-[#4b47d9] text-[#4b47d9] hover:bg-[#4b47d9]/5 text-xs font-bold active:scale-95 transition-transform flex items-center justify-center gap-1.5"
        >
          <ShoppingCart size={15} />
          <span>Add to Cart</span>
        </button>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 rounded-full bg-[#4b47d9] hover:bg-[#3d39c6] text-white text-xs font-bold active:scale-95 transition-transform shadow-md shadow-[#4b47d9]/25 flex items-center justify-center gap-1.5"
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
