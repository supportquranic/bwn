'use client';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Bot, Search, Heart, Star, ChevronRight, ChevronDown, ChevronUp, SlidersHorizontal, ArrowUpRight, ShoppingBag, ShoppingCart, ArrowLeft, Plus, X } from 'lucide-react';
import { BANNERS, CATEGORIES, USAGE_SECTIONS, BRANDS, LATEST_POSTERS, INITIAL_SHOPS, INITIAL_PRODUCTS } from '../data/mockData';
import { useCustomImages } from '../utils/imageStore';
import Footer from './Footer';

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
    xiaomi:  <span className="text-sm font-black tracking-tight text-[#8586f2] border-2 border-[#8586f2] rounded-lg px-2 py-0.5">mi</span>,
    oneplus: <span className="text-xs font-black tracking-tight text-black border-2 border-black px-1.5 py-0.5">1+</span>,
    realme:  <span className="text-xs font-black tracking-tight text-black">realme</span>,
    jbl:     <span className="text-sm font-black tracking-tight text-[#8586f2]">JBL</span>,
  };
  return logos[id] || <span className="text-xs font-black text-black">{id}</span>;
}

/* ── Unified Mobile Product Card (Sleek proportions, fixed uniform height, identical dimensions, storage under price, Plus icon button) ── */
function ProductCard({ product, onProduct, customData, onAddToCart }) {
  const finalProduct = {
    ...product,
    ...customData,
    image: customData?.image || product.image,
    name: customData?.name || product.name,
    price: customData?.price !== undefined ? customData.price : product.price,
  };

  const isAccessory = ['cases', 'covers', 'airpods', 'smartwatch', 'chargers', 'headphones', 'handsfree', 'cables'].includes(product.category) ||
    ['case', 'cover', 'glass', 'protector', 'charger', 'buds', 'watch', 'handsfree', 'earphone', 'cable'].some(kw => (product.name || '').toLowerCase().includes(kw));
  const storage = isAccessory ? null : (product.specs?.Storage || (product.condition === 'new' ? 'Box Pack' : 'In Stock'));

  return (
    <div
      className="w-full h-full bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
      onClick={() => onProduct(product.id)}
    >
      {/* Upper image area — uniform square placeholder with rounded corners and exact side spacing */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <div className="w-full aspect-square bg-transparent rounded-2xl overflow-hidden flex items-center justify-center">
          <img
            src={finalProduct.image}
            alt={finalProduct.name}
            className={`w-full h-full ${
              isAccessory ? 'object-cover' : 'object-contain p-2.5'
            }`}
          />
        </div>
      </div>

      {/* Content area at bottom: identical 2-line title height and bottom-aligned price row */}
      <div className="px-3 pb-3 pt-1 flex flex-col justify-between flex-1">
        <p className="text-xs font-bold text-black leading-snug line-clamp-2 h-8 mb-2">
          {finalProduct.name}
        </p>
        <div className="flex items-center justify-between gap-1.5 mt-auto">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-[#8586f2] truncate">{fmt(finalProduct.price)}</span>
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
              onProduct(product.id);
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
}

/* ── Horizontal Product Card (Image 3 layout for Best Under 1 Lakh: clean image, no border, no shape, title, single clean spec, price, Plus button) ── */
function HorizontalProductCard({ product, onProduct, customData, onAddToCart }) {
  const finalProduct = {
    ...product,
    ...customData,
    image: customData?.image || product.image,
    name: customData?.name || product.name,
    price: customData?.price !== undefined ? customData.price : product.price,
  };

  // Only one clean spec to avoid clumping/text issues
  const singleSpec = product.specs?.Storage
    ? `${product.specs.Storage} Storage`
    : (product.specs?.Display || 'Official PTA Approved');

  return (
    <div
      className="bg-white rounded-3xl border border-gray-200 p-3.5 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] active:scale-[0.99] transition-transform cursor-pointer"
      onClick={() => onProduct(product.id)}
    >
      {/* Clean image on left — no border, no background shape */}
      <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
        <img
          src={finalProduct.image}
          alt={finalProduct.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content on right — clean typography without text clipping */}
      <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[88px] py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-black leading-snug truncate">
              {finalProduct.name}
            </h3>
            <span className="text-[10px] font-semibold text-black/60">
              {product.condition === 'new' ? 'Box Pack' : 'In Stock'}
            </span>
          </div>
        </div>

        {/* Exactly one clean spec, properly spaced */}
        <p className="text-xs text-black/50 font-medium truncate mt-0.5">
          {singleSpec}
        </p>

        {/* Price & Plus button */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-sm font-black text-[#8586f2]">{fmt(finalProduct.price)}</span>
          <button
            className="w-7 h-7 flex-shrink-0 bg-[#8586f2] hover:bg-[#7375e8] text-white rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-xs"
            onClick={e => {
              e.stopPropagation();
              onProduct(product.id);
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
}

/* ── Budget list item for Brand Modal ── */
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
        <p className="text-sm font-bold text-[#8586f2] mt-1">{fmt(finalProduct.price)}</p>
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

/* ── Interactive Auto-Scroll Brand Carousel (60% slower, drag left/right with touch or mouse, resumes auto-scroll from exact position on release) ── */
function InteractiveBrandCarousel({ brands, onSelectBrand }) {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);
  const animFrameId = useRef(null);

  // Quadruple brands list for seamless infinite loop
  const list = [...brands, ...brands, ...brands, ...brands];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Slow down 60%: speed = 0.4px per frame (smooth & relaxed)
    const speed = 0.4;

    const step = () => {
      if (!isDragging.current && el) {
        el.scrollLeft += speed;
        // Seamless loop reset
        const loopThreshold = el.scrollWidth / 2;
        if (el.scrollLeft >= loopThreshold) {
          el.scrollLeft -= el.scrollWidth / 4;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += el.scrollWidth / 4;
        }
      }
      animFrameId.current = requestAnimationFrame(step);
    };

    animFrameId.current = requestAnimationFrame(step);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    scrollLeftStart.current = containerRef.current?.scrollLeft || 0;
    dragDistance.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    dragDistance.current = Math.abs(diff);
    containerRef.current.scrollLeft = scrollLeftStart.current - diff;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeftStart.current = containerRef.current?.scrollLeft || 0;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    const diff = e.clientX - startX.current;
    dragDistance.current = Math.abs(diff);
    containerRef.current.scrollLeft = scrollLeftStart.current - diff;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto hide-scrollbar flex gap-2 pl-4 py-1 select-none cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {list.map((brand, i) => (
        <button
          key={`${brand.id}-${i}`}
          onClick={() => {
            if (dragDistance.current < 6) {
              onSelectBrand(brand);
            }
          }}
          className="flex-shrink-0 aspect-square rounded-xl border border-gray-200 overflow-hidden active:scale-95 transition-transform bg-white shadow-2xs"
          style={{ width: '82px' }}
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-full h-full object-cover block pointer-events-none"
            loading="lazy"
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
}

export default function HomePage({ onShop, onProduct, favorites, onToggleFav, onSearchFocus, onOpenCart, cartCount = 0, onAddToCart, onNavigateTab, onOpenAssistant }) {
  const { getImg, getItem } = useCustomImages();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isDocked, setIsDocked] = useState(false);
  const [showAllUnder1Lakh, setShowAllUnder1Lakh] = useState(false);
  const [showAllUnder60k, setShowAllUnder60k] = useState(false);
  const [activeSectionView, setActiveSectionView] = useState(null);
  const [sectionSearchQuery, setSectionSearchQuery] = useState('');
  const scrollRef = useRef(null);
  const sheetRef = useRef(null);

  const touchStartY = useRef(0);
  const lastScrollTop = useRef(0);
  const isBouncing = useRef(false);

  /* Auto-advance banner */
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* Smooth minimal elastic bounce exclusively on the White Sheet (purple top stays solid) */
  const triggerSheetBounce = (deltaY) => {
    const sheet = sheetRef.current;
    if (!sheet || isBouncing.current) return;
    isBouncing.current = true;

    sheet.style.transition = 'transform 0.16s cubic-bezier(0.25, 1, 0.5, 1)';
    sheet.style.transform = `translate3d(0, ${deltaY}px, 0)`;

    setTimeout(() => {
      sheet.style.transition = 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)';
      sheet.style.transform = 'translate3d(0, 0, 0)';
      setTimeout(() => {
        sheet.style.transition = '';
        isBouncing.current = false;
      }, 330);
    }, 110);
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    const el = scrollRef.current;

    // Swiping up when banner is expanded -> dock
    if (!isDocked && diff < -20) {
      setIsDocked(true);
      triggerSheetBounce(-7);
    }
    // Pulling down when at top of sheet -> expand banner
    else if (isDocked && (el?.scrollTop || 0) <= 0 && diff > 40) {
      setIsDocked(false);
      triggerSheetBounce(7);
    }
    // Pulling down when at top of content -> elastic downward bounce on white sheet
    else if ((el?.scrollTop || 0) <= 0 && diff > 15) {
      triggerSheetBounce(Math.min(10, diff * 0.3));
    }
    // Pulling up when at bottom of content -> elastic upward bounce on white sheet
    else if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 3 && diff < -15) {
      triggerSheetBounce(Math.max(-10, diff * 0.3));
    }
  };

  const handleWheel = (e) => {
    const el = scrollRef.current;
    if (!isDocked && e.deltaY > 15) {
      setIsDocked(true);
      triggerSheetBounce(-7);
    } else if (isDocked && (el?.scrollTop || 0) <= 0 && e.deltaY < -20) {
      setIsDocked(false);
      triggerSheetBounce(7);
    } else if ((el?.scrollTop || 0) <= 0 && e.deltaY < -5) {
      triggerSheetBounce(7);
    } else if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 3 && e.deltaY > 5) {
      triggerSheetBounce(-7);
    }
  };

  const handleSheetScroll = (e) => {
    const el = e.currentTarget;
    const st = el.scrollTop;
    const lastSt = lastScrollTop.current;

    if (!isDocked && st > 5) {
      setIsDocked(true);
      triggerSheetBounce(-7);
    }
    // Reaching top of scroll -> elastic bounce
    else if (st <= 0 && lastSt > 0) {
      triggerSheetBounce(7);
    }
    // Reaching bottom of scroll -> elastic bounce
    else if (st + el.clientHeight >= el.scrollHeight - 3 && lastSt + el.clientHeight < el.scrollHeight - 3) {
      triggerSheetBounce(-7);
    }

    lastScrollTop.current = st;
  };

  /* 1. Box Pack Phones */
  const allBoxPackPhones = INITIAL_PRODUCTS.filter(p => p.condition === 'new' && (p.category === 'iphone' || p.category === 'android'));
  const boxPackPhones = activeCategory
    ? INITIAL_PRODUCTS.filter(p => p.category === activeCategory && p.condition === 'new').slice(0, 6)
    : allBoxPackPhones.slice(0, 6);

  /* 2. Used Phones */
  const allUsedPhones = INITIAL_PRODUCTS.filter(p => p.condition === 'used');
  const usedPhones = allUsedPhones.slice(0, 6);

  /* 3. Best Under 1 Lakh */
  const allUnder1LakhPhones = INITIAL_PRODUCTS.filter(p => p.price <= 100000 && (p.category === 'iphone' || p.category === 'android'));
  const under1LakhPhones = [
    INITIAL_PRODUCTS.find(p => p.id === 'p-l1'),
    INITIAL_PRODUCTS.find(p => p.id === 'p-l2'),
    INITIAL_PRODUCTS.find(p => p.id === 'p-l3'),
    INITIAL_PRODUCTS.find(p => p.id === 'p-u3'),
    INITIAL_PRODUCTS.find(p => p.id === 'p-l4'),
    INITIAL_PRODUCTS.find(p => p.id === 'p-u5'),
    INITIAL_PRODUCTS.find(p => p.id === 'p-u6'),
    INITIAL_PRODUCTS.find(p => p.id === 'p-l5'),
  ].filter(Boolean);

  /* 4. Best Under 60k */
  const allUnder60kPhones = INITIAL_PRODUCTS.filter(p => p.price <= 60000 && (p.category === 'iphone' || p.category === 'android'));
  const under60kPhones = allUnder60kPhones.slice(0, 6);

  /* 5. Trending Cases & Accessories */
  const ACCESSORY_CAT_IDS = ['cases', 'covers', 'airpods', 'smartwatch', 'chargers', 'headphones', 'handsfree'];
  const allTrendingAccessories = INITIAL_PRODUCTS.filter(p => ACCESSORY_CAT_IDS.includes(p.category))
    .sort((a, b) => {
      const aIsCase = a.category === 'cases' || a.category === 'covers';
      const bIsCase = b.category === 'cases' || b.category === 'covers';
      if (aIsCase && !bIsCase) return -1;
      if (!aIsCase && bIsCase) return 1;
      return 0;
    });
  const trendingAccessories = allTrendingAccessories.slice(0, 10);

  const rawBanner = BANNERS[bannerIdx];
  const banner = getItem(`banner_${rawBanner.id}`, rawBanner);

  /* Matching products for selected brand modal */
  const brandProducts = selectedBrand
    ? INITIAL_PRODUCTS.filter(p =>
        selectedBrand.keywords.some(kw => p.name.toLowerCase().includes(kw))
      )
    : [];

  /* ── Dedicated Full Page View for any Section when "See all" is clicked ── */
  if (activeSectionView) {
    const rawItems = activeSectionView.items || [];
    const q = sectionSearchQuery.toLowerCase().trim();
    const filteredItems = q
      ? rawItems.filter(item => {
          if (item.name && item.name.toLowerCase().includes(q)) return true;
          if (item.title && item.title.toLowerCase().includes(q)) return true;
          if (item.subtitle && item.subtitle.toLowerCase().includes(q)) return true;
          if (item.desc && item.desc.toLowerCase().includes(q)) return true;
          if (item.specs && Object.values(item.specs).some(v => String(v).toLowerCase().includes(q))) return true;
          return false;
        })
      : rawItems;

    return (
      <div className="h-full flex flex-col overflow-hidden bg-white">
        {/* Fixed Top Purple Header */}
        <div className="px-4 pt-4 pb-3.5 text-white flex-shrink-0 z-30 flex items-center justify-between" style={{ background: '#8586f2' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setActiveSectionView(null); setSectionSearchQuery(''); }}
              className="w-8.5 h-8.5 rounded-full bg-white shadow-xs flex items-center justify-center text-[#8586f2] active:scale-95 transition-transform"
              aria-label="Back to Home"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-white font-black text-base tracking-tight leading-snug">{activeSectionView.title}</h1>
              <p className="text-white/80 text-[11px] font-medium">{filteredItems.length} available · Bahawalnagar</p>
            </div>
          </div>
          <button
            onClick={onOpenCart || onSearchFocus}
            className="w-8.5 h-8.5 rounded-full bg-white shadow-xs flex items-center justify-center text-[#8586f2] active:scale-95 transition-transform relative"
            aria-label="Cart"
          >
            <ShoppingCart size={15} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#8586f2] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Section Inset Search Bar */}
        <div className="px-4 pt-3 pb-2.5 flex items-center gap-2.5 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex-1 bg-gray-50/90 border border-gray-200/90 rounded-full px-4 py-2 flex items-center gap-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
            <Search size={16} className="text-[#8586f2] flex-shrink-0" />
            <input
              type="text"
              value={sectionSearchQuery}
              onChange={e => setSectionSearchQuery(e.target.value)}
              placeholder={`Search in ${activeSectionView.title}...`}
              className="w-full bg-transparent text-xs font-medium text-black placeholder:text-black/40 focus:outline-none"
            />
            {sectionSearchQuery && (
              <button onClick={() => setSectionSearchQuery('')} className="p-0.5 text-black/40 hover:text-black">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-28 bg-[#f8f9fc] smooth-scroll">
          {/* Section Header: Title & Caption on top of section */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-black">{activeSectionView.title}</h2>
                <p className="text-xs text-black/40">Verified inventory available in Bahawalnagar</p>
              </div>
              <span className="text-xs text-black/40 font-semibold self-start mt-0.5">
                {filteredItems.length} items
              </span>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <Search size={32} className="text-black/25 mb-2" />
              <p className="text-sm font-bold text-black">No matching items found</p>
              <p className="text-xs text-black/40 mt-1">Try another search keyword</p>
            </div>
          ) : activeSectionView.type === 'products' ? (
            <div className="grid grid-cols-2 gap-2.5 px-4 pt-1">
              {filteredItems.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onProduct={onProduct}
                  customData={getItem(`product_${p.id}`)}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : activeSectionView.type === 'horizontal-products' ? (
            <div className="flex flex-col gap-2.5 px-4 pt-3.5">
              {filteredItems.map(p => (
                <HorizontalProductCard
                  key={p.id}
                  product={p}
                  onProduct={onProduct}
                  customData={getItem(`product_${p.id}`)}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : activeSectionView.type === 'posters' ? (
            <div className="px-4 pt-3.5 flex flex-col gap-3.5">
              {filteredItems.map(poster => (
                <div key={poster.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                  <img
                    src={getImg(`poster_${poster.id}`, poster.image)}
                    alt=""
                    className="w-full object-cover block"
                    style={{ aspectRatio: '16/8' }}
                  />
                  <div className="p-3.5">
                    <h3 className="text-base font-bold text-black">{poster.title || 'Official Launch'}</h3>
                    <p className="text-xs text-black/50 mt-1">{poster.desc || 'Available at authorized retailers in Bahawal Mobile Market'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : activeSectionView.type === 'usage' ? (
            <div className="px-4 pt-3.5 flex flex-col gap-3.5">
              {filteredItems.map(sec => (
                <div
                  key={sec.id}
                  className="bg-white rounded-3xl border border-gray-200 p-3 overflow-hidden cursor-pointer active:scale-[0.99] transition-all flex flex-col shadow-xs"
                  onClick={onSearchFocus}
                >
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-gray-100">
                    <img src={sec.image} alt={sec.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                    <span className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-full">
                      Curated Collection
                    </span>
                  </div>
                  <div className="pt-2.5 pb-1 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-black leading-snug">{sec.title}</h3>
                    <p className="text-xs font-semibold text-black/50 mt-0.5">{sec.subtitle}</p>
                    <p className="text-xs text-black/40 mt-1 line-clamp-2 leading-relaxed">{sec.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : activeSectionView.type === 'shops' ? (
            <div className="px-4 pt-3.5 flex flex-col gap-3.5">
              {filteredItems.map(shop => (
                <div
                  key={shop.id}
                  className="bg-white rounded-3xl border border-gray-200 p-3 overflow-hidden cursor-pointer active:scale-[0.99] transition-all flex flex-col shadow-xs"
                  onClick={() => onShop(shop.id)}
                >
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-gray-100">
                    <img src={getImg(`shop_${shop.id}_cover`, shop.coverImage)} alt={shop.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                    <span className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-full">
                      {shop.verified ? 'Verified Shop' : 'Best Seller'}
                    </span>
                    <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white p-1 shadow-md flex items-center justify-center overflow-hidden">
                      <img src={getImg(`shop_${shop.id}_logo`, shop.logo)} alt="" className="w-full h-full object-cover rounded-full" />
                    </div>
                  </div>
                  <div className="pt-2.5 pb-1 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-black leading-snug">{shop.name}</h3>
                    <p className="text-xs font-semibold text-black/50 mt-0.5">{shop.featuredQuote || 'Official Retailer in Bahawalnagar'}</p>
                    <p className="text-xs text-black/40 mt-1 line-clamp-2 leading-relaxed">{shop.address}</p>
                    <div className="flex items-center justify-between mt-3 pt-1">
                      <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center gap-1 text-xs font-bold text-black">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>{shop.rating}</span>
                        <span className="text-black/35 font-normal">({shop.ratingCount})</span>
                      </div>
                      <button
                        className="bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform shadow-xs"
                        onClick={e => { e.stopPropagation(); onShop(shop.id); }}
                      >
                        <span>Visit Shop</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col relative overflow-hidden"
      style={{ background: '#8586f2' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
    >

      {/* ── Fixed Top Bar (Always at top, solid #8586f2, z-30, never scrolls, never bounces) ── */}
      <div className="pt-3.5 pb-2 px-4 text-white flex-shrink-0 z-30" style={{ background: '#8586f2' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-[#8586f2]">
              <MapPin size={16} />
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
              onClick={onOpenCart || onSearchFocus}
              className="w-8.5 h-8.5 p-2 rounded-full bg-white shadow-xs flex items-center justify-center text-[#8586f2] active:scale-95 transition-transform relative"
              aria-label="Cart"
            >
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#8586f2] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenAssistant}
              className="w-8.5 h-8.5 p-2 rounded-full bg-white shadow-xs flex items-center justify-center text-[#8586f2] active:scale-95 transition-transform"
              title="Smart Device Matcher & AI Comparison"
              aria-label="Smart Device Matcher"
            >
              <Bot size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Collapsible Hero Banner Carousel (Solid #8586f2, collapses smoothly on scroll/swipe) ── */}
      <div
        style={{
          maxHeight: isDocked ? '0px' : '150px',
          opacity: isDocked ? 0 : 1,
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease',
        }}
        className="flex-shrink-0 px-4 text-white"
      >
        <div className="relative py-1 flex items-center justify-between min-h-[116px]">
          <div className="flex-1 pr-2 z-10">
            <h2 className="text-white text-xl font-black leading-tight tracking-tight">
              {banner.title}
            </h2>
            <p className="text-white/85 text-xs font-medium mt-1 leading-snug line-clamp-1">
              {banner.subtitle}
            </p>
            <div
              className="mt-2.5 flex items-center gap-1 text-white font-bold text-xs underline underline-offset-2 cursor-pointer"
              onClick={() => { setIsDocked(true); triggerSheetBounce(-6); }}
            >
              <span>Shop now</span>
              <ChevronRight size={13} />
            </div>
          </div>
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            <img
              src={getImg(`banner_${banner.id}`, banner.image)}
              alt={banner.title}
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center gap-1.5 pt-2 pb-1">
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

      {/* ── Divider Location on Purple BG (Exact Image 1 breathing room: ~14px of pure solid #8586f2) ── */}
      <div
        className="h-3 flex-shrink-0 cursor-pointer"
        style={{ background: '#8586f2' }}
        onClick={() => {
          if (isDocked) {
            setIsDocked(false);
            triggerSheetBounce(7);
          }
        }}
      />

      {/* ── White Sheet Container — DOCKED at divider location, permanently preserves rounded-t-[34px] ── */}
      <div
        ref={sheetRef}
        className="flex-1 bg-white rounded-t-[34px] overflow-hidden flex flex-col relative"
        style={{
          boxShadow: '0 -8px 30px rgba(0,0,0,0.08)',
          isolation: 'isolate',
        }}
      >
        {/* Scroll indicator pill in center inside top of white sheet */}
        <div
          className="pt-2.5 pb-1 flex justify-center items-center flex-shrink-0 cursor-pointer"
          onClick={() => {
            if (isDocked) {
              setIsDocked(false);
              triggerSheetBounce(7);
            }
          }}
        >
          <div className="w-10 h-1 rounded-full bg-black/15 hover:bg-black/25 transition-colors" />
        </div>

        {/* ── Scrollable Sheet Body (Fluid momentum scrolling, content completely contained inside sheet) ── */}
        <div
          ref={scrollRef}
          onScroll={handleSheetScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar smooth-scroll pb-28 relative"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Search Bar inside scrollable sheet — Image 1: Inset shadow inside (deeper recessed look), no drop-shadow, shorter from right, separate white filter button with purple icon */}
          <div className="px-4 pt-1 pb-2 flex items-center gap-2.5">
            <div
              className="flex-1 bg-gray-50/90 border border-gray-200/90 rounded-full px-4 py-2.5 flex items-center gap-2.5 cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
              onClick={onSearchFocus}
            >
              <Search size={18} className="text-[#8586f2] flex-shrink-0" />
              <span className="text-black/40 text-sm font-medium truncate">
                Search for mobile shops and devices
              </span>
            </div>
            <button
              className="w-10 h-10 rounded-full bg-white border border-gray-200/90 flex items-center justify-center text-[#8586f2] shadow-xs active:scale-95 transition-transform flex-shrink-0"
              onClick={onSearchFocus}
              title="Filter"
            >
              <SlidersHorizontal size={17} />
            </button>
          </div>

        {/* ── 3D Category Icons (no borders, no background shapes) ── */}
        <div className="mt-2 px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-black text-black tracking-tight">Browse Categories</h2>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)} className="text-[#8586f2] text-xs font-bold">
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
                    activeCategory === cat.id ? 'text-[#8586f2] font-bold' : 'text-black/70'
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
              <h2 className="text-base font-black text-black tracking-tight">New Launches</h2>
              <p className="text-xs text-black/40">Official posters in Bahawalnagar</p>
            </div>
            <button
              onClick={() => setActiveSectionView({
                id: 'new-launches',
                title: 'New Launches',
                type: 'posters',
                items: LATEST_POSTERS
              })}
              className="text-[#8586f2] text-xs font-bold flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              See all <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4 smooth-x-scroll">
            {LATEST_POSTERS.map(poster => (
              <div
                key={poster.id}
                className="flex-shrink-0 snap-start rounded-2xl overflow-hidden cursor-pointer active:scale-[0.99] transition-all border border-gray-200"
                style={{ width: '82%', maxWidth: '340px' }}
                onClick={() => setActiveSectionView({
                  id: 'new-launches',
                  title: 'New Launches',
                  type: 'posters',
                  items: LATEST_POSTERS
                })}
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

        {/* ── Box Pack Phones (Enclosed in separate shape background) ── */}
        <div className="mx-4 mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-3.5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Box Pack Phones</h2>
              <p className="text-xs text-black/40">Genuine sealed phones in Bahawalnagar</p>
            </div>
            <button
              onClick={() => setActiveSectionView({
                id: 'box-pack',
                title: 'Box Pack Phones',
                type: 'products',
                items: allBoxPackPhones
              })}
              className="text-[#8586f2] text-xs font-semibold flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              See all <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {boxPackPhones.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onProduct={onProduct}
                customData={getItem(`product_${p.id}`)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>

        {/* ── Used Phones (Enclosed in separate shape background) ── */}
        <div className="mx-4 mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-3.5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Used Phones</h2>
              <p className="text-xs text-black/40">Hand-checked & verified devices</p>
            </div>
            <button
              onClick={() => setActiveSectionView({
                id: 'used-phones',
                title: 'Used Phones',
                type: 'products',
                items: allUsedPhones
              })}
              className="text-[#8586f2] text-xs font-semibold flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              See all <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {usedPhones.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onProduct={onProduct}
                customData={getItem(`product_${p.id}`)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>

        {/* ── Shop by Brand (Interactive auto-scroll: 60% slower, drag left/right with touch/mouse, resumes from exact position) ── */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Shop by Brand</h2>
              <p className="text-xs text-black/40">Tap or drag brands to explore models</p>
            </div>
          </div>

          <InteractiveBrandCarousel brands={BRANDS} onSelectBrand={setSelectedBrand} />
        </div>

        {/* ── Best Under 100k (Enclosed in separate shape background matching Available Covers & Protectors layout) ── */}
        <div className="mx-4 mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-3.5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Best Under 100k</h2>
              <p className="text-xs text-black/40">Top value phones under Rs. 100,000</p>
            </div>
            <button
              onClick={() => setActiveSectionView({
                id: 'under-100k',
                title: 'Best Under 100k',
                type: 'products',
                items: allUnder1LakhPhones
              })}
              className="text-[#8586f2] text-xs font-semibold flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              See all <ChevronRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {under1LakhPhones.slice(0, 4).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onProduct={onProduct}
                customData={getItem(`product_${p.id}`)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>

        {/* ── Best Under 60k (Enclosed in separate shape background matching Best Under 1 Lakh) ── */}
        <div className="mx-4 mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-3.5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Best Under 60k</h2>
              <p className="text-xs text-black/40">Budget-friendly picks under Rs. 60,000</p>
            </div>
            <button
              onClick={() => setActiveSectionView({
                id: 'under-60k',
                title: 'Best Under 60k',
                type: 'products',
                items: allUnder60kPhones
              })}
              className="text-[#8586f2] text-xs font-semibold flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              See all <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {under60kPhones.slice(0, 4).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onProduct={onProduct}
                customData={getItem(`product_${p.id}`)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>

        {/* ── Based on Usage (Image 2 & 3 layout: matching Explore All Shops card style) ── */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Based on Usage</h2>
              <p className="text-xs text-black/40">Handpicked phones curated by your needs</p>
            </div>
            <button
              onClick={() => setActiveSectionView({
                id: 'usage',
                title: 'Based on Usage',
                type: 'usage',
                items: USAGE_SECTIONS
              })}
              className="text-[#8586f2] text-xs font-semibold flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              See all <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4 smooth-x-scroll">
            {USAGE_SECTIONS.map(sec => (
              <div
                key={sec.id}
                className="flex-shrink-0 snap-start bg-white rounded-3xl border border-gray-200 p-3 overflow-hidden cursor-pointer active:scale-[0.99] transition-all flex flex-col"
                style={{ width: 'calc(100vw - 60px)', maxWidth: '360px' }}
                onClick={() => setActiveSectionView({
                  id: 'usage',
                  title: 'Based on Usage',
                  type: 'usage',
                  items: USAGE_SECTIONS
                })}
              >
                {/* Top photo banner with rounded corners, pill, and indicator dots matching Explore All Shops */}
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={sec.image}
                    alt={sec.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                  {/* Top-left pill */}
                  <span className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-full">
                    Curated Collection
                  </span>

                  {/* Image indicator dots at bottom */}
                  <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1">
                    <span className="w-2.5 h-1 rounded-full bg-white" />
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                  </div>
                </div>

                {/* Details matching Explore All Shops typography & layout */}
                <div className="pt-2.5 pb-1 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-black leading-snug truncate">{sec.title}</h3>
                  <p className="text-xs font-semibold text-black/50 mt-0.5 truncate">
                    {sec.subtitle}
                  </p>
                  <p className="text-xs text-black/40 mt-1 line-clamp-2 leading-relaxed">
                    {sec.tagline}
                  </p>

                  {/* Bottom row: Info pill on left, Explore button on right */}
                  <div className="flex items-center justify-between mt-3 pt-1">
                    <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center gap-1 text-xs font-bold text-black">
                      <span className="text-[#8586f2]">Verified</span>
                      <span className="text-black/35 font-normal">Devices</span>
                    </div>
                    <button
                      className="bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform shadow-xs"
                      onClick={e => {
                        e.stopPropagation();
                        setActiveSectionView({
                          id: 'usage',
                          title: 'Based on Usage',
                          type: 'usage',
                          items: USAGE_SECTIONS
                        });
                      }}
                    >
                      <span>Explore</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trending Cases & Accessories (Second Last Section) ── */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Trending Cases & Accessories</h2>
              <p className="text-xs text-black/40">Hot covers, glass protectors & accessories</p>
            </div>
            <button
              onClick={() => {
                if (onNavigateTab) {
                  onNavigateTab('accessories');
                } else {
                  setActiveSectionView({
                    id: 'trending-accessories',
                    title: 'Trending Cases & Accessories',
                    type: 'products',
                    items: allTrendingAccessories
                  });
                }
              }}
              className="text-[#8586f2] text-xs font-semibold flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              See all <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4 smooth-x-scroll">
            {trendingAccessories.map(p => (
              <div key={p.id} className="w-[160px] flex-shrink-0 snap-start flex flex-col">
                <ProductCard
                  product={p}
                  onProduct={onProduct}
                  customData={getItem(`product_${p.id}`)}
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Explore All Shops (Last Section) ── */}
        <div className="mt-6 mb-4">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">Explore All Shops</h2>
              <p className="text-xs text-black/40">Verified mobile retailers in Bahawalnagar</p>
            </div>
            <button
              onClick={() => setActiveSectionView({
                id: 'all-shops',
                title: 'Explore All Shops',
                type: 'shops',
                items: INITIAL_SHOPS
              })}
              className="text-[#8586f2] text-xs font-semibold flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              See all <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4 smooth-x-scroll">
            {INITIAL_SHOPS.map(shop => {
              const isFav = favorites.includes(shop.id);
              return (
                <div
                  key={shop.id}
                  className="flex-shrink-0 snap-start bg-white rounded-3xl border border-gray-200 p-3 overflow-hidden cursor-pointer active:scale-[0.99] transition-all flex flex-col"
                  style={{ width: 'calc(100vw - 60px)', maxWidth: '360px' }}
                  onClick={() => onShop(shop.id)}
                >
                  {/* Top photo banner with rounded corners, verified pill, and circular logo matching Image 2 */}
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={getImg(`shop_${shop.id}_cover`, shop.coverImage)}
                      alt={shop.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                    {/* Top-left: Verified / Best Seller pill */}
                    <span className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-full">
                      {shop.verified ? 'Verified Shop' : 'Best Seller'}
                    </span>

                    {/* Top-right: Clean white circular shop logo badge */}
                    <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white p-1 shadow-md flex items-center justify-center overflow-hidden">
                      <img
                        src={getImg(`shop_${shop.id}_logo`, shop.logo)}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Image indicator dots at bottom matching Image 2 */}
                    <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1">
                      <span className="w-2.5 h-1 rounded-full bg-white" />
                      <span className="w-1 h-1 rounded-full bg-white/50" />
                      <span className="w-1 h-1 rounded-full bg-white/50" />
                    </div>
                  </div>

                  {/* Shop Details matching Image 2 typography & layout */}
                  <div className="pt-2.5 pb-1 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-black leading-snug truncate">{shop.name}</h3>
                    <p className="text-xs font-semibold text-black/50 mt-0.5 truncate">
                      {shop.featuredQuote || 'Official Retailer in Bahawalnagar'}
                    </p>
                    <p className="text-xs text-black/40 mt-1 line-clamp-2 leading-relaxed">
                      {shop.address}
                    </p>

                    {/* Bottom row: Rating pill on left, Visit Shop button on right */}
                    <div className="flex items-center justify-between mt-3 pt-1">
                      <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center gap-1 text-xs font-bold text-black">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>{shop.rating}</span>
                        <span className="text-black/35 font-normal">({shop.ratingCount})</span>
                      </div>
                      <button
                        className="bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform shadow-xs"
                        onClick={e => {
                          e.stopPropagation();
                          onShop(shop.id);
                        }}
                      >
                        <span>Visit Shop</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── All Shops Near You List (Redesigned matching Horizontal Card style) ── */}
        <div className="mt-4 mb-4">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-black">All Shops Near You</h2>
              <p className="text-xs text-black/40">Verified local shops with active inventory</p>
            </div>
            <button
              onClick={() => setActiveSectionView({
                id: 'all-shops',
                title: 'All Shops Near You',
                type: 'shops',
                items: INITIAL_SHOPS
              })}
              className="text-[#8586f2] text-xs font-semibold flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              See all <ChevronRight size={13} />
            </button>
          </div>
          <div className="px-4 flex flex-col gap-2.5">
            {INITIAL_SHOPS.map(shop => (
              <div
                key={shop.id}
                className="bg-white rounded-3xl border border-gray-200 p-3.5 flex items-center gap-3.5 active:scale-[0.99] transition-transform cursor-pointer"
                onClick={() => onShop(shop.id)}
              >
                {/* Shop Image / Logo on left — clean rounded square */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                  <img
                    src={getImg(`shop_${shop.id}_logo`, shop.logo)}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content in middle */}
                <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[76px] py-0.5">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-black leading-snug truncate">
                        {shop.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {shop.verified ? 'Verified Shop' : 'Local Retailer'} · {shop.distance}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-black/45 truncate mt-0.5">
                    {shop.address}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-black">{shop.rating}</span>
                      <span className="text-[10.5px] text-black/40">({shop.ratingCount})</span>
                    </div>
                    <button
                      className="flex-shrink-0 bg-[#8586f2] hover:bg-[#7375e8] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
                      onClick={e => {
                        e.stopPropagation();
                        onShop(shop.id);
                      }}
                    >
                      Visit Shop
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* ── Footer ── */}
          <Footer onNavigateTab={onNavigateTab} />

          <div className="h-4" />
        </div>
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
                  <div className="w-10 h-10 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img src={selectedBrand.logo} alt={selectedBrand.name} className="w-full h-full object-cover" />
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
                <p className="text-xs font-bold text-[#8586f2] uppercase tracking-wider mb-2">New in Market</p>
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