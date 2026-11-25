'use client';
import { useState, useEffect, useRef } from 'react';
import {
  MapPin, Bot, Search, Heart, Star, ChevronRight,
  Smartphone, Apple, Tablet, Headphones, Mic2, Zap, Cable, Shield,
} from 'lucide-react';
import { BANNERS, CATEGORIES, USAGE_SECTIONS, BUDGET_SECTIONS, INITIAL_SHOPS, INITIAL_PRODUCTS } from '../data/mockData';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

/* Category icon map — Lucide only, no emojis */
const CAT_ICONS = {
  android:    <Smartphone size={22} strokeWidth={1.8} />,
  iphone:     <Apple size={22} strokeWidth={1.8} />,
  ipad:       <Tablet size={22} strokeWidth={1.8} />,
  headphones: <Headphones size={22} strokeWidth={1.8} />,
  handsfree:  <Mic2 size={22} strokeWidth={1.8} />,
  chargers:   <Zap size={22} strokeWidth={1.8} />,
  cables:     <Cable size={22} strokeWidth={1.8} />,
  covers:     <Shield size={22} strokeWidth={1.8} />,
};

/* ── Product card — matches reference: 2-col grid, stroke border, gray pill, black Buy now ── */
function ProductCard({ product, onProduct }) {
  const badge = product.condition === 'used' ? 'Used' : 'Box Pack';
  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col"
      onClick={() => onProduct(product.id)}
    >
      {/* Badge + image */}
      <div className="p-3 pb-0">
        <span className="inline-block bg-gray-100 text-gray-500 text-[11px] font-medium px-2.5 py-0.5 rounded-full mb-2">
          {badge}
        </span>
        <div className="h-28 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 pt-2 flex flex-col gap-2 flex-1">
        <p className="text-sm font-bold text-black leading-snug line-clamp-2">{product.name}</p>
        <div className="flex items-center justify-between gap-1 mt-auto">
          <span className="text-sm font-bold text-black">{fmt(product.price)}</span>
          <button
            className="flex-shrink-0 bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform"
            onClick={e => { e.stopPropagation(); onProduct(product.id); }}
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Budget list item — white card style: border, shadow, purple price, strikethrough ── */
function BudgetItem({ product, shop, onProduct, onToggleFav, isFav }) {
  return (
    <div
      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => onProduct(product.id)}
    >
      {/* Square image — object-contain, gray bg */}
      <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-black leading-tight line-clamp-2">{product.name}</p>
        <p className="text-[11px] text-black/40 mt-0.5 truncate">{shop?.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-bold text-[#4b47d9]">{fmt(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-black/35 line-through">{fmt(product.originalPrice)}</span>
          )}
        </div>
      </div>

      {/* Heart */}
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
  const [bannerIdx, setBannerIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const scrollRef = useRef(null);

  /* Auto-advance banner */
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* Filtered products by category */
  const displayedProducts = activeCategory
    ? INITIAL_PRODUCTS.filter(p => p.category === activeCategory)
    : INITIAL_PRODUCTS;

  const banner = BANNERS[bannerIdx];

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden hide-scrollbar gradient-bg-top-light relative">

      {/* ── Top Hero Area ── */}
      <div className="relative pt-3.5 pb-3.5 px-4 text-white">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-sm">
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
              className="w-8.5 h-8.5 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <Heart size={15} className="text-white fill-white" />
            </button>
            <button className="w-8.5 h-8.5 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-sm active:scale-95 transition-transform">
              <Bot size={17} />
            </button>
          </div>
        </div>

        {/* Hero Banner Carousel */}
        <div className="relative py-1 flex items-center justify-between min-h-[116px]">
          <div className="flex-1 pr-2 z-10">
            <span className="inline-block bg-white/20 text-white backdrop-blur-md border border-white/25 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold mb-1.5 shadow-sm">
              {banner.tag}
            </span>
            <h2 className="text-white text-xl font-black leading-tight drop-shadow-sm tracking-tight">
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
          {/* Overlapping product image */}
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-75" />
            <img
              src={banner.image}
              alt={banner.title}
              className="relative z-10 w-24 h-24 object-cover rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300 border-2 border-white/40"
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
                i === bannerIdx ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Lower White Sheet ── */}
      <div className="relative z-10 bg-white rounded-t-[34px] shadow-[0_-14px_40px_rgba(0,0,0,0.18)] min-h-screen pt-3.5 pb-28">

        {/* Sticky search bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 pb-3 pt-1 rounded-t-[36px]">
          <button
            className="w-full bg-gray-100 hover:bg-gray-200/70 rounded-full px-4 py-3 flex items-center gap-2.5 shadow-inner active:scale-[0.99] transition-all text-left"
            onClick={onSearchFocus}
          >
            <Search size={18} className="text-[#4b47d9] flex-shrink-0" />
            <span className="text-black/40 text-sm font-medium">Search for mobile shops and devices</span>
          </button>
        </div>

        {/* ── Category Icons (Lucide, no emojis) ── */}
        <div className="mt-2 px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-black text-black tracking-tight">Browse Categories</h2>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)} className="text-[#4b47d9] text-xs font-bold">
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(prev => (prev === cat.id ? null : cat.id))}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
              >
                <div
                  className={`icon-3d w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 shadow-md border border-gray-100 transition-all duration-200 ${
                    activeCategory === cat.id ? 'ring-2 ring-[#4b47d9] scale-105 bg-indigo-50' : ''
                  }`}
                >
                  <span className={activeCategory === cat.id ? 'text-[#4b47d9]' : 'text-black/60'}>
                    {CAT_ICONS[cat.id]}
                  </span>
                </div>
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

        {/* ── Based on Usage — Wide snap-scroll cards matching reference ── */}
        {/*
          Reference analysis:
          - Card occupies ~87% of screen width
          - Next card peek ~8% (~28-32px at 390px screen)
          - Left margin = 16px, gap = 12px
          - Card width = 100vw - 16px(left) - 44px(right peek + gap) = calc(100vw - 60px)
        */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-black text-black tracking-tight">Based on Usage</h2>
              <p className="text-xs text-black/40">Curated shops by phone purpose</p>
            </div>
            <button className="text-[#4b47d9] text-xs font-bold flex items-center gap-0.5">
              See all <ChevronRight size={13} />
            </button>
          </div>

          {/* Scroll container: pl-4 left pad, pr-4 right pad, gap-3 */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4">
            {USAGE_SECTIONS.map((sec, idx) => {
              const shopIdMap = { gaming: 'shop-4', camera: 'shop-1', daily: 'shop-2', gift: 'shop-3' };
              const targetId = shopIdMap[sec.id] || INITIAL_SHOPS[idx % INITIAL_SHOPS.length].id;
              const shop = INITIAL_SHOPS.find(s => s.id === targetId) || INITIAL_SHOPS[0];
              const isFav = favorites.includes(shop.id);

              return (
                <div
                  key={sec.id}
                  /* Width: screen - left pad(16) - right peek(44) = calc(100vw - 60px), capped at 360px */
                  className="flex-shrink-0 snap-start bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer active:scale-[0.99] transition-all"
                  style={{ width: 'calc(100vw - 60px)', maxWidth: '360px' }}
                  onClick={() => onShop(shop.id)}
                >
                  {/* Cover image */}
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    <img
                      src={shop.coverImage}
                      alt={shop.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Usage label — glass pill, no emoji */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/20 text-white backdrop-blur-md border border-white/30 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {sec.label}
                      </span>
                    </div>

                    {/* Heart */}
                    <button
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                      onClick={e => { e.stopPropagation(); onToggleFav(shop.id); }}
                    >
                      <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                    </button>
                  </div>

                  {/* Card footer — rating + name + View */}
                  <div className="p-3.5">
                    {/* Rating row */}
                    <div className="flex items-center gap-1 mb-1.5">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black text-black">{shop.rating}</span>
                      <span className="text-xs text-black/40">({shop.ratingCount})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-3">
                        <h3 className="text-base font-black text-black truncate leading-snug">{shop.name}</h3>
                        <p className="text-xs text-black/40 mt-0.5 flex items-center gap-1 truncate">
                          <MapPin size={12} className="text-[#4b47d9] flex-shrink-0" />
                          <span>{shop.distance}</span>
                          <span className="text-black/20">·</span>
                          <span className="truncate">{shop.address}</span>
                        </p>
                      </div>
                      <button className="flex-shrink-0 px-3.5 py-2 rounded-full bg-indigo-50 text-[#4b47d9] text-xs font-bold flex items-center gap-1">
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

        {/* ── Featured & Unique — 2-column grid ── */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Featured & Unique</h2>
              <p className="text-xs text-black/40">Hand-checked in Bahawalnagar</p>
            </div>
            <button className="text-[#4b47d9] text-xs font-semibold flex items-center gap-0.5">
              See all <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4">
            {displayedProducts.slice(0, 6).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onProduct={onProduct}
              />
            ))}
          </div>
        </div>

        {/* ── Budget Sections ── */}
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
                <button className="text-[#4b47d9] text-xs font-semibold flex items-center gap-0.5">
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
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── All Shops ── */}
        <div className="mt-6 mb-4">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-black">All Shops Near You</h2>
            <span className="text-xs text-black/40">{INITIAL_SHOPS.length} shops</span>
          </div>
          <div className="px-4 flex flex-col gap-3">
            {INITIAL_SHOPS.map(shop => (
              <div
                key={shop.id}
                className="flex gap-3 items-center bg-white rounded-2xl card-shadow p-3 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => onShop(shop.id)}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
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
    </div>
  );
}
