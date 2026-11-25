'use client';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Bot, Search, Heart, Star, ChevronRight, X } from 'lucide-react';
import { BANNERS, CATEGORIES, USAGE_SECTIONS, BUDGET_SECTIONS, BRANDS, LATEST_POSTERS, INITIAL_SHOPS, INITIAL_PRODUCTS } from '../data/mockData';
import { useCustomImages } from '../utils/imageStore';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

/* 3D category icon images — no borders, no container shapes */
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

/* Clean monochrome brand logo marks */
function BrandLogo({ id }) {
  const logos = {
    apple: (
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-black">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.33c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.72 1.4-.58.68-1.1 1.78-.96 2.84 1.04.08 2.08-.52 2.72-1.3z" />
      </svg>
    ),
    samsung: <span className="text-[11px] font-black tracking-wider text-black">SAMSUNG</span>,
    xiaomi:  <span className="text-sm font-black tracking-tight text-[#4b47d9] border-2 border-[#4b47d9] rounded-lg px-2 py-0.5">mi</span>,
    oneplus: <span className="text-xs font-black tracking-tight text-black border-2 border-black px-1.5 py-0.5">1+</span>,
    realme:  <span className="text-xs font-black tracking-tight text-black">realme</span>,
    jbl:     <span className="text-sm font-black tracking-tight text-[#4b47d9]">JBL</span>,
  };
  return logos[id] || <span className="text-xs font-black text-black">{id}</span>;
}

/* ── Compact Product card — 2x3 grid (6 on screen), border only, NO shadow, NO cutting price ── */
function ProductCard({ product, onProduct, customData }) {
  const finalProduct = {
    ...product,
    ...customData,
    image: customData?.image || product.image,
    name: customData?.name || product.name,
    price: customData?.price !== undefined ? customData.price : product.price,
    condition: customData?.condition || (product.condition === 'used' ? 'Used' : 'Box Pack'),
    ptaStatus: customData?.ptaStatus || 'PTA Approved',
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col"
      onClick={() => onProduct(product.id)}
    >
      <div className="px-2.5 pt-2.5">
        <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5">
          {finalProduct.condition}
        </span>
        <div className="h-28 flex items-center justify-center">
          <img
            src={finalProduct.image}
            alt={finalProduct.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      <div className="p-2.5 pt-2 flex flex-col gap-1.5 flex-1">
        <p className="text-xs font-bold text-black leading-tight line-clamp-2">{finalProduct.name}</p>
        <div className="flex items-center justify-between gap-1 mt-auto">
          <span className="text-xs font-bold text-[#4b47d9]">{fmt(finalProduct.price)}</span>
          <button
            className="flex-shrink-0 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full active:scale-95 transition-transform"
            onClick={e => { e.stopPropagation(); onProduct(product.id); }}
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Budget list item — border only, NO shadow, NO cutting price ── */
function BudgetItem({ product, shop, onProduct, onToggleFav, isFav, customData }) {
  const finalProduct = {
    ...product,
    ...customData,
    image: customData?.image || product.image,
    name: customData?.name || product.name,
    price: customData?.price !== undefined ? customData.price : product.price,
  };

  return (
    <div
      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => onProduct(product.id)}
    >
      <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
        <img src={finalProduct.image} alt={finalProduct.name} className="w-full h-full object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-black leading-tight line-clamp-2">{finalProduct.name}</p>
        <p className="text-[11px] text-black/40 mt-0.5 truncate">{shop?.name}</p>
        <p className="text-sm font-bold text-[#4b47d9] mt-1">{fmt(finalProduct.price)}</p>
      </div>

      <button
        className="flex-shrink-0 p-1"
        onClick={e => { e.stopPropagation(); onToggleFav(product.id); }}
      >
        <Heart size={18} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
      </button>
    </div>
  );
}

export default function HomePage({ onShop, onProduct, favorites, onToggleFav, onSearchFocus }) {
  const { getImg, getItem } = useCustomImages();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const scrollRef = useRef(null);

  /* Auto-advance banner */
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* Latest phones for top poster carousel */
  const latestPhones = INITIAL_PRODUCTS.filter(p => p.category === 'iphone' || p.category === 'android');

  /* Featured & Unique: phones only (or filtered by active category), 6 cards = 2x3 on screen */
  const featuredPhones = activeCategory
    ? INITIAL_PRODUCTS.filter(p => p.category === activeCategory)
    : latestPhones;

  const rawBanner = BANNERS[bannerIdx];
  const banner = getItem(`banner_${rawBanner.id}`, rawBanner);

  /* Matching products for selected brand modal */
  const brandProducts = selectedBrand
    ? INITIAL_PRODUCTS.filter(p =>
        selectedBrand.keywords.some(kw => p.name.toLowerCase().includes(kw))
      )
    : [];

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden hide-scrollbar gradient-bg-top-light relative smooth-scroll">

      {/* ── Sticky Top Bar — always stays visible at the very top ── */}
      <div className="sticky top-0 z-30 pt-3.5 pb-2.5 px-4 text-white bg-gradient-to-b from-[#8586f2] to-[#7c7deb] gpu-layer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center">
              <MapPin size={16} className="text-white" />
            </div>
            <div>
              <span className="text-white font-black text-sm tracking-tight block truncate max-w-[210px]">
                Bahawalnagar, Pakistan
              </span>
              <span className="text-white/80 text-[10.5px] font-medium block">
                Bahawal Mobile Market
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchFocus}
              className="w-8.5 h-8.5 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center active:scale-95 transition-transform"
            >
              <Heart size={15} className="text-white fill-white" />
            </button>
            <button className="w-8.5 h-8.5 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white active:scale-95 transition-transform">
              <Bot size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Hero Banner Carousel — stays behind white sheet as it slides up ── */}
      <div className="sticky top-[58px] z-0 pt-1 pb-4 px-4 text-white gpu-layer">
        <div className="relative py-1 flex items-center justify-between min-h-[116px]">
          <div className="flex-1 pr-2 z-10">
            <span className="inline-block bg-white/20 text-white backdrop-blur-md border border-white/25 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold mb-1.5">
              {banner.tag}
            </span>
            <h2 className="text-white text-xl font-black leading-tight tracking-tight">
              {banner.title}
            </h2>
            <p className="text-white/85 text-xs font-medium mt-1 leading-snug line-clamp-1">
              {banner.subtitle}
            </p>
            <div className="mt-2 flex items-center gap-1 text-white font-bold text-xs underline underline-offset-2">
              <span>Shop now</span>
              <ChevronRight size={13} />
            </div>
          </div>
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-75" />
            <img
              src={getImg(`banner_${banner.id}`, banner.image)}
              alt={banner.title}
              className="relative z-10 w-24 h-24 object-cover rounded-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300 border-2 border-white/40"
            />
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center gap-1.5 pt-2 pb-0.5">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === bannerIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Lower White Sheet — slides up over hero, stops right below top bar ── */}
      <div className="relative z-10 bg-white rounded-t-[34px] min-h-screen pb-28 gpu-layer">

        {/* ── Sticky search bar — docks at top-[58px] right below the top bar */}
        <div className="sticky top-[58px] z-20 gpu-layer">
          <div className="bg-white rounded-t-[34px] px-4 pt-3.5 pb-3">
            <button
              className="w-full bg-gray-100 hover:bg-gray-200/70 rounded-full px-4 py-3 flex items-center gap-2.5 active:scale-[0.99] transition-all text-left"
              onClick={onSearchFocus}
            >
              <Search size={18} className="text-[#4b47d9] flex-shrink-0" />
              <span className="text-black/40 text-sm font-medium">Search for mobile shops and devices</span>
            </button>
          </div>
        </div>

        {/* ── 3D Category Icons (no borders, no background shapes) ── */}
        <div className="mt-2 px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-black text-black tracking-tight">Browse Categories</h2>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)} className="text-[#4b47d9] text-xs font-bold">
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1 smooth-x-scroll">
            {CATEGORIES.filter(cat => CAT_3D_ICONS[cat.id]).map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(prev => (prev === cat.id ? null : cat.id))}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
              >
                <img
                  src={getImg(`cat_${cat.id}`, CAT_3D_ICONS[cat.id])}
                  alt={cat.label}
                  className={`icon-3d w-14 h-14 object-contain transition-transform duration-200 ${
                    activeCategory === cat.id ? 'scale-110' : ''
                  }`}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    activeCategory === cat.id ? 'text-[#4b47d9] font-bold' : 'text-black/70'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Latest Models — full-bleed landscape poster cards, no text, no border ── */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-black text-black tracking-tight">Latest Models</h2>
              <p className="text-xs text-black/40">Newest phones available in Bahawalnagar</p>
            </div>
            <button onClick={onSearchFocus} className="text-[#4b47d9] text-xs font-bold flex items-center gap-0.5">
              See all <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4 smooth-x-scroll">
            {LATEST_POSTERS.map(poster => (
              <div
                key={poster.id}
                className="flex-shrink-0 snap-start rounded-2xl overflow-hidden cursor-pointer active:scale-[0.99] transition-all border border-gray-200"
                style={{ width: '82%', maxWidth: '340px' }}
              >
                <img
                  src={getImg(`poster_${poster.id}`, poster.image)}
                  alt=""
                  className="w-full h-full object-cover block"
                  style={{ aspectRatio: '16/7' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Featured & Unique — Phones 2x3 Grid (6 on screen, compact height, no shadow) ── */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Featured & Unique</h2>
              <p className="text-xs text-black/40">Hand-checked phones in Bahawalnagar</p>
            </div>
            <button onClick={onSearchFocus} className="text-[#4b47d9] text-xs font-semibold flex items-center gap-0.5">
              See all <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5 px-4">
            {featuredPhones.slice(0, 6).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onProduct={onProduct}
                customData={getItem(`product_${p.id}`)}
              />
            ))}
          </div>
        </div>

        {/* ── Shop by Brand (Square Logos Only, 3 horizontal x 2 vertical, auto scrolling right to left) ── */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Shop by Brand</h2>
              <p className="text-xs text-black/40">Tap a brand to explore all models</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 overflow-hidden py-1">
            {/* Row 1 */}
            <div className="animate-marquee-left flex gap-2.5 pl-4">
              {[...BRANDS.slice(0, 6), ...BRANDS.slice(0, 6)].map((brand, i) => (
                <button
                  key={`${brand.id}-r1-${i}`}
                  onClick={() => setSelectedBrand(brand)}
                  className="flex-shrink-0 aspect-square bg-white rounded-2xl border border-gray-200 p-3.5 flex items-center justify-center active:scale-95 transition-transform"
                  style={{ width: 'calc((min(100vw, 448px) - 52px) / 3)', maxWidth: '128px' }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain pointer-events-none"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {/* Row 2 */}
            <div className="animate-marquee-left flex gap-2.5 pl-4" style={{ animationDuration: '24s' }}>
              {[...BRANDS.slice(6), BRANDS[0], ...BRANDS.slice(6), BRANDS[0]].map((brand, i) => (
                <button
                  key={`${brand.id}-r2-${i}`}
                  onClick={() => setSelectedBrand(brand)}
                  className="flex-shrink-0 aspect-square bg-white rounded-2xl border border-gray-200 p-3.5 flex items-center justify-center active:scale-95 transition-transform"
                  style={{ width: 'calc((min(100vw, 448px) - 52px) / 3)', maxWidth: '128px' }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain pointer-events-none"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Budget Sections (Best under 100,000 / Best under 65,000 / Used Devices — no cutting price, no shadow) ── */}
        {BUDGET_SECTIONS.map(sec => {
          let items = sec.used
            ? INITIAL_PRODUCTS.filter(p => p.condition === 'used')
            : INITIAL_PRODUCTS.filter(p => p.price <= sec.max);
          items = items.slice(0, 3);
          if (!items.length) return null;
          return (
            <div key={sec.id} className="mt-6">
              <div className="px-4 flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-black">{sec.label}</h2>
                <button onClick={onSearchFocus} className="text-[#4b47d9] text-xs font-semibold flex items-center gap-0.5">
                  See all <ChevronRight size={13} />
                </button>
              </div>
              <div className="px-4 flex flex-col gap-2.5">
                {items.map(p => {
                  const shop = INITIAL_SHOPS.find(s => s.id === p.shopId);
                  return (
                    <BudgetItem
                      key={p.id}
                      product={p}
                      shop={shop}
                      onProduct={onProduct}
                      onToggleFav={onToggleFav}
                      isFav={favorites.includes(p.id)}
                      customData={getItem(`product_${p.id}`)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── Based on Usage (moved to bottom, reduced height, no shadow) ── */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Based on Usage</h2>
              <p className="text-xs text-black/40">Curated shops by phone purpose</p>
            </div>
            <button onClick={onSearchFocus} className="text-[#4b47d9] text-xs font-semibold flex items-center gap-0.5">
              See all <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4 smooth-x-scroll">
            {USAGE_SECTIONS.map((sec, idx) => {
              const shopIdMap = { gaming: 'shop-4', camera: 'shop-1', daily: 'shop-2', gift: 'shop-3' };
              const targetId = shopIdMap[sec.id] || INITIAL_SHOPS[idx % INITIAL_SHOPS.length].id;
              const shop = INITIAL_SHOPS.find(s => s.id === targetId) || INITIAL_SHOPS[0];
              const isFav = favorites.includes(shop.id);

              return (
                <div
                  key={sec.id}
                  className="flex-shrink-0 snap-start bg-white rounded-3xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.99] transition-all"
                  style={{ width: 'calc(100vw - 60px)', maxWidth: '360px' }}
                  onClick={() => onShop(shop.id)}
                >
                  <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                    <img src={getImg(`shop_${shop.id}_cover`, shop.coverImage)} alt={shop.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-white/20 text-white backdrop-blur-md border border-white/30 text-[11px] font-bold px-2.5 py-1 rounded-full">
                        {sec.label}
                      </span>
                    </div>
                    <button
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center active:scale-90 transition-transform"
                      onClick={e => { e.stopPropagation(); onToggleFav(shop.id); }}
                    >
                      <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                    </button>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black text-black">{shop.rating}</span>
                      <span className="text-xs text-black/40">({shop.ratingCount})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-3">
                        <h3 className="text-sm font-black text-black truncate leading-snug">{shop.name}</h3>
                        <p className="text-xs text-black/40 mt-0.5 flex items-center gap-1 truncate">
                          <MapPin size={12} className="text-[#4b47d9] flex-shrink-0" />
                          <span>{shop.distance}</span>
                          <span className="text-black/20">·</span>
                          <span className="truncate">{shop.address}</span>
                        </p>
                      </div>
                      <button className="flex-shrink-0 px-3 py-1.5 rounded-full bg-indigo-50 text-[#4b47d9] text-xs font-bold flex items-center gap-1">
                        <span>View</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── All Shops Near You (border only, NO shadow) ── */}
        <div className="mt-6 mb-4">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-black">All Shops Near You</h2>
            <span className="text-xs text-black/40">{INITIAL_SHOPS.length} shops</span>
          </div>
          <div className="px-4 flex flex-col gap-3">
            {INITIAL_SHOPS.map(shop => (
              <div
                key={shop.id}
                className="flex gap-3 items-center bg-white rounded-2xl border border-gray-200 p-3 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => onShop(shop.id)}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={getImg(`shop_${shop.id}_logo`, shop.logo)} alt={shop.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black truncate">{shop.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-black">{shop.rating}</span>
                    <span className="text-[11px] text-black/40">({shop.ratingCount})</span>
                    <span className="text-black/20 mx-1">·</span>
                    <span className="text-[11px] text-black/40">{shop.distance}</span>
                  </div>
                  <p className="text-[11px] text-black/40 mt-0.5 truncate">{shop.address}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); onToggleFav(shop.id); }}>
                  <Heart size={18} className={favorites.includes(shop.id) ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* ── Brand Models Bottom Sheet Modal ── */}
      {selectedBrand && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center max-w-md mx-auto"
          onClick={() => setSelectedBrand(null)}
        >
          <div
            className="w-full bg-white rounded-t-[28px] max-h-[82vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {selectedBrand.logo ? (
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 p-1.5 flex items-center justify-center flex-shrink-0">
                    <img src={selectedBrand.logo} alt={selectedBrand.name} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <BrandLogo id={selectedBrand.id} />
                )}
                <div>
                  <h3 className="text-base font-black text-black">{selectedBrand.name} Models</h3>
                  <p className="text-xs text-black/40">{selectedBrand.tagline} · Available in Bahawalnagar</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBrand(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black/60"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-4 smooth-scroll hide-scrollbar">
              {/* New in Market models list */}
              <div>
                <p className="text-xs font-bold text-[#4b47d9] uppercase tracking-wider mb-2">New in Market</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBrand.newModels.map(model => (
                    <span
                      key={model}
                      className="text-xs font-semibold text-black bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available listings in Bahawalnagar */}
              <div>
                <p className="text-xs font-bold text-black/50 uppercase tracking-wider mb-2">
                  Available Listings ({brandProducts.length})
                </p>
                {brandProducts.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {brandProducts.map(p => {
                      const shop = INITIAL_SHOPS.find(s => s.id === p.shopId);
                      return (
                        <BudgetItem
                          key={p.id}
                          product={p}
                          shop={shop}
                          onProduct={id => {
                            setSelectedBrand(null);
                            onProduct(id);
                          }}
                          onToggleFav={onToggleFav}
                          isFav={favorites.includes(p.id)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-black/40 py-4 text-center border border-gray-200 rounded-2xl">
                    Ask nearby shops for latest {selectedBrand.name} stock.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
