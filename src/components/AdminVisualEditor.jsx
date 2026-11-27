import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, RotateCcw, Upload, Check, X, 
  Image as ImageIcon, ChevronRight, MapPin, 
  Heart, Bot, Star, Lock, LogOut, Edit3, DollarSign, Tag, Type, ShieldCheck
} from 'lucide-react';
import { 
  BANNERS, CATEGORIES, USAGE_SECTIONS, BUDGET_SECTIONS, 
  BRANDS, LATEST_POSTERS, INITIAL_SHOPS, INITIAL_PRODUCTS 
} from '../data/mockData';
import { useCustomContent } from '../utils/imageStore';

const fmt = n => {
  const num = Number(n) || 0;
  return 'Rs. ' + num.toLocaleString('en-PK');
};

/* 3D category fallback icons */
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

/* Clean brand logo marks */
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

/**
 * Card Inspector Wrapper:
 * - Only clicking the pencil button triggers edit.
 * - Measures and displays the length and width of the IMAGE itself (not the whole card).
 */
function CardInspectorWrapper({
  itemKey,
  itemType = 'product', // 'product' | 'banner' | 'poster' | 'category' | 'shop'
  cardData,
  onEdit,
  children,
  className = ""
}) {
  const imageContainerRef = useRef(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    // Measure the image container width & height safely once
    const timer = setTimeout(() => {
      const el = imageContainerRef.current?.querySelector('img') || imageContainerRef.current;
      if (el) {
        const w = Math.round(el.offsetWidth);
        const h = Math.round(el.offsetHeight);
        if (w > 0 && h > 0) {
          setImgSize({ w, h });
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handlePencilClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit({
      itemKey,
      itemType,
      cardData,
      width: imgSize.w || 0,
      height: imgSize.h || 0,
    });
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Card Content - Normal Non-clickable Body */}
      <div className="relative rounded-2xl">
        <div ref={imageContainerRef}>
          {children}
        </div>

        {/* Dedicated Pencil Button: ONLY THIS BUTTON OPENS THE EDIT PANEL */}
        <button
          type="button"
          onClick={handlePencilClick}
          className="absolute top-2 right-2 z-30 bg-[#4b47d9] hover:bg-[#3d3ab8] text-white px-2 py-1 rounded-full shadow-lg border border-white/40 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
          title="Click to edit image, text, PTA status, and condition"
        >
          <Edit3 size={11} className="text-amber-300" />
          <span className="text-[10px] font-bold">Edit</span>
        </button>
      </div>

      {/* Stable Dimensions Strip: Shows Length & Width of the IMAGE */}
      <div className="mt-1 h-5 px-1.5 flex items-center justify-between text-[9.5px] font-semibold text-gray-600 bg-gray-100 rounded-md border border-gray-200 select-none">
        <span className="truncate text-black font-bold max-w-[125px]">
          {cardData?.name || cardData?.title || cardData?.label || itemKey}
        </span>
        <span className="font-mono text-[#4b47d9] font-bold whitespace-nowrap ml-1">
          {imgSize.w > 0 ? `Image: ↔ ${imgSize.w}px × ↕ ${imgSize.h}px` : 'Image Size Ready'}
        </span>
      </div>
    </div>
  );
}

/**
 * Full Card Editor Modal
 * Fields:
 * 1. Image (Upload from phone/PC or URL)
 * 2. Image Dimensions (Length & Width)
 * 3. Title / Name
 * 4. Price (PKR)
 * 5. Condition (Dropdown: Box Pack / Used)
 * 6. PTA / BT Status (PTA Approved / Non-PTA)
 */
function CardEditorModal({ target, onClose, onSave, onReset }) {
  const { cardData, itemKey, itemType, width, height } = target || {};

  const [imageUrl, setImageUrl] = useState(cardData?.image || '');
  const [imagePreview, setImagePreview] = useState(cardData?.image || '');
  const [name, setName] = useState(cardData?.name || cardData?.title || cardData?.label || '');
  const [price, setPrice] = useState(cardData?.price !== undefined ? String(cardData.price) : '');
  const [condition, setCondition] = useState(
    cardData?.condition === 'used' || cardData?.badge === 'Used' ? 'Used' : 'Box Pack'
  );
  const [ptaStatus, setPtaStatus] = useState(cardData?.ptaStatus || 'PTA Approved');
  const [subtitle, setSubtitle] = useState(cardData?.subtitle || '');
  const [tag, setTag] = useState(cardData?.tag || '');
  const [isDataUrl, setIsDataUrl] = useState(false);
  const fileInputRef = useRef(null);

  if (!target) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result;
      if (typeof res === 'string') {
        setImagePreview(res);
        setImageUrl('');
        setIsDataUrl(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updated = {};

    // 1. Image
    const finalImg = isDataUrl ? imagePreview : (imageUrl.trim() || imagePreview);
    if (finalImg) {
      updated.image = finalImg;
    }

    // 2. Name / Title / Label
    if (itemType === 'product' || itemType === 'shop') {
      updated.name = name.trim();
    } else if (itemType === 'banner') {
      updated.title = name.trim();
      updated.subtitle = subtitle.trim();
      updated.tag = tag.trim();
    } else if (itemType === 'category') {
      updated.label = name.trim();
    }

    // 3. Product Specific: Price, Condition & PTA Status
    if (itemType === 'product') {
      const cleanPrice = Number(price.replace(/[^0-9]/g, ''));
      if (!isNaN(cleanPrice) && cleanPrice > 0) {
        updated.price = cleanPrice;
      }
      updated.condition = condition; // 'Box Pack' or 'Used'
      updated.badge = condition;     // Reflect in badge as well
      updated.ptaStatus = ptaStatus; // 'PTA Approved' or 'Non-PTA'
    }

    onSave(itemKey, updated);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Reset this card to its original default values?')) {
      onReset(itemKey);
      onClose();
    }
  };

  const isProduct = itemType === 'product';
  const isBanner = itemType === 'banner';

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom duration-200 text-black font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-black text-black">Edit Card Details</h3>
            <p className="text-xs text-black/50 mt-0.5">Edit image, text, PTA status, and condition</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black active:scale-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Image Dimensions Banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
          <span className="font-bold text-[#4b47d9]">Image Dimensions (Length & Width)</span>
          <span className="font-mono font-bold text-[#4b47d9]">
            ↔ {width}px × ↕ {height}px
          </span>
        </div>

        {/* Image Preview & Upload */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Image Preview</label>
          <div className="w-full h-36 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center relative">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-contain p-2"
                onError={() => alert('Could not load image URL')}
              />
            ) : (
              <div className="text-gray-400 text-xs flex flex-col items-center gap-1">
                <ImageIcon size={24} />
                <span>No Image Selected</span>
              </div>
            )}
          </div>

          <div className="mt-2 flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold rounded-xl border border-gray-300 border-dashed flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Upload size={14} />
              <span>Select Photo from Device</span>
            </button>
          </div>
          
          <div className="mt-2">
            <input
              type="url"
              placeholder="Or paste web image link..."
              value={imageUrl}
              onChange={e => {
                setImageUrl(e.target.value);
                setImagePreview(e.target.value);
                setIsDataUrl(false);
              }}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-[#4b47d9]"
            />
          </div>
        </div>

        {/* Name / Title Field */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
            <Type size={12} className="text-[#4b47d9]" />
            <span>Card Title / Name</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Apple iPhone 15 Pro 128GB"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-black focus:outline-none focus:border-[#4b47d9]"
          />
        </div>

        {/* Product Specific: Price, Condition Dropdown, PTA/BT Status */}
        {isProduct && (
          <div className="flex flex-col gap-3">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <DollarSign size={12} className="text-emerald-600" />
                <span>Price (PKR)</span>
              </label>
              <input
                type="number"
                placeholder="365000"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-black focus:outline-none focus:border-[#4b47d9]"
              />
              <span className="text-[10px] text-black/50 mt-0.5 block">{fmt(price)}</span>
            </div>

            {/* Condition Dropdown (Exactly 2 options: Box Pack or Used) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Tag size={12} className="text-[#4b47d9]" />
                <span>Condition</span>
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-black focus:outline-none focus:border-[#4b47d9]"
              >
                <option value="Box Pack">Box Pack</option>
                <option value="Used">Used</option>
              </select>
            </div>

            {/* PTA / BT Status Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <ShieldCheck size={12} className="text-indigo-600" />
                <span>PTA / BT Status</span>
              </label>
              <select
                value={ptaStatus}
                onChange={e => setPtaStatus(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-black focus:outline-none focus:border-[#4b47d9]"
              >
                <option value="PTA Approved">PTA Approved</option>
                <option value="Non-PTA">Non-PTA</option>
                <option value="">None / Hide</option>
              </select>
            </div>
          </div>
        )}

        {/* Banner Specific: Subtitle & Tag */}
        {isBanner && (
          <div className="flex flex-col gap-2.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                placeholder="e.g. Now available at Suleman Hub"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-[#4b47d9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tag</label>
              <input
                type="text"
                placeholder="e.g. New Arrival"
                value={tag}
                onChange={e => setTag(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-[#4b47d9]"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 px-3 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl active:scale-95 transition-transform"
          >
            Reset Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-2 py-2.5 px-4 bg-[#4b47d9] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow"
          >
            <Check size={14} />
            <span>Save & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main AdminVisualEditor
 */
export default function AdminVisualEditor({ onExit }) {
  const { getItem, setItemData, resetItem, resetAllContent } = useCustomContent();
  const [modalTarget, setModalTarget] = useState(null);
  const [bannerIdx, setBannerIdx] = useState(0);

  // Authentication Gate (Password 3344)
  const [isAuthed, setIsAuthed] = useState(() => sessionStorage.getItem('bm_admin_authed') === 'true');
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState('');

  const handleUnlock = (e) => {
    e?.preventDefault();
    if (passInput.trim() === '3344') {
      sessionStorage.setItem('bm_admin_authed', 'true');
      setIsAuthed(true);
      setPassError('');
    } else {
      setPassError('Incorrect password. Please enter 3344.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bm_admin_authed');
    setIsAuthed(false);
    onExit();
  };

  if (!isAuthed) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#0f0e26] p-6 text-white text-center">
        <div className="w-full max-w-sm bg-[#1a1838] border border-indigo-900/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4b47d9] to-indigo-500 flex items-center justify-center shadow-lg mb-4 text-white">
            <Lock size={26} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">Admin Studio</h2>
          <p className="text-xs text-indigo-200/70 mt-1 mb-5">
            Enter the admin password to edit images, text, PTA status, and conditions.
          </p>

          <form onSubmit={handleUnlock} className="w-full flex flex-col gap-3">
            <div>
              <input
                type="password"
                autoFocus
                placeholder="Password (3344)"
                value={passInput}
                onChange={e => { setPassInput(e.target.value); setPassError(''); }}
                className="w-full text-center text-base tracking-widest font-black bg-black/40 border border-indigo-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#4b47d9]"
              />
              {passError && (
                <p className="text-xs text-rose-400 font-bold mt-1.5">{passError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#4b47d9] hover:bg-[#3d3ab8] text-white font-bold text-sm rounded-xl shadow-lg active:scale-95 transition-transform"
            >
              Unlock Admin Studio
            </button>

            <button
              type="button"
              onClick={onExit}
              className="w-full py-2.5 text-xs text-indigo-300/80 hover:text-white font-medium transition-colors"
            >
              ← Back to Bahawal Market
            </button>
          </form>
        </div>
      </div>
    );
  }

  const rawBanner = BANNERS[bannerIdx];
  const activeBanner = getItem(`banner_${rawBanner.id}`, rawBanner);
  const latestPhones = INITIAL_PRODUCTS.filter(p => p.category === 'iphone' || p.category === 'android');

  const handleResetAll = () => {
    if (confirm('Reset ALL custom images, names, and prices back to original defaults?')) {
      resetAllContent();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-black font-sans relative">
      {/* ── Admin Top Bar Banner ── */}
      <div className="bg-[#1f1d4f] text-white px-4 py-2.5 flex items-center justify-between z-40 border-b border-indigo-900 shadow-md flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-transform"
            title="Back to Website"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xs font-black flex items-center gap-1.5">
              <span>Admin Studio: Live Editor</span>
              <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full">ADMIN</span>
            </h1>
            <p className="text-[10px] text-white/70">Click the pencil icon on any card to edit it</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetAll}
            className="text-[10px] font-bold bg-white/10 hover:bg-red-500/80 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
            title="Reset all overrides"
          >
            <RotateCcw size={11} />
            <span>Reset All</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-indigo-200 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
            title="Log out of Admin"
          >
            <LogOut size={11} />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* ── Scrollable UI Clone ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar gradient-bg-top-light pb-24">
        
        {/* Sticky Top Bar Mock */}
        <div className="pt-3.5 pb-2.5 px-4 text-white bg-gradient-to-b from-[#8586f2] to-[#7c7deb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-[#4b47d9]">
                <MapPin size={16} />
              </div>
              <div>
                <span className="text-white font-black text-sm tracking-tight block">Bahawalnagar, Pakistan</span>
                <span className="text-white/80 text-[10.5px] font-medium block">Bahawal Mobile Market</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8.5 h-8.5 p-2 rounded-full bg-white shadow-xs flex items-center justify-center text-[#4b47d9]">
                <ShoppingCart size={16} />
              </div>
              <div className="w-8.5 h-8.5 p-2 rounded-full bg-white shadow-xs flex items-center justify-center text-[#4b47d9]">
                <Bot size={17} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Hero Banner Carousel ── */}
        <div className="pt-1 pb-4 px-4 text-white">
          <div className="relative py-1 flex items-center justify-between min-h-[116px]">
            <div className="flex-1 pr-2 z-10">
              <span className="inline-block bg-white/20 text-white backdrop-blur-md border border-white/25 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold mb-1.5">
                {activeBanner.tag}
              </span>
              <h2 className="text-white text-xl font-black leading-tight tracking-tight">
                {activeBanner.title}
              </h2>
              <p className="text-white/85 text-xs font-medium mt-1 leading-snug line-clamp-1">
                {activeBanner.subtitle}
              </p>
            </div>
            
            <CardInspectorWrapper
              itemKey={`banner_${rawBanner.id}`}
              itemType="banner"
              cardData={activeBanner}
              onEdit={setModalTarget}
              className="flex-shrink-0"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/40 bg-white/10">
                <img
                  src={activeBanner.image}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardInspectorWrapper>
          </div>

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

        {/* ── Lower White Sheet ── */}
        <div className="bg-white rounded-t-[34px] min-h-screen pb-24 pt-4">

          {/* Search Bar Visual */}
          <div className="px-4 pb-2">
            <div className="w-full bg-gray-100 rounded-full px-4 py-3 flex items-center gap-2.5">
              <span className="text-[#4b47d9] font-bold">🔍</span>
              <span className="text-black/40 text-sm font-medium">Search for mobile shops and devices</span>
            </div>
          </div>

          {/* ── 3D Categories ── */}
          <div className="mt-4 px-4">
            <h2 className="text-sm font-black text-black tracking-tight mb-2.5">Browse Categories (3D Icons)</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {CATEGORIES.filter(cat => CAT_3D_ICONS[cat.id]).map(cat => {
                const defaultIcon = CAT_3D_ICONS[cat.id];
                const activeCat = getItem(`cat_${cat.id}`, { ...cat, image: defaultIcon });
                return (
                  <div key={cat.id} className="flex-shrink-0 flex flex-col items-center">
                    <CardInspectorWrapper
                      itemKey={`cat_${cat.id}`}
                      itemType="category"
                      cardData={activeCat}
                      onEdit={setModalTarget}
                    >
                      <div className="w-14 h-14 flex items-center justify-center p-1 bg-gray-50/60 rounded-xl">
                        <img
                          src={activeCat.image}
                          alt={activeCat.label}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    </CardInspectorWrapper>
                    <span className="text-[11px] font-semibold text-black/70 mt-1">{activeCat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Latest Models Posters ── */}
          <div className="mt-6">
            <div className="px-4 mb-3">
              <h2 className="text-base font-black text-black tracking-tight">Latest Models Posters</h2>
              <p className="text-xs text-black/40">Landscape marketing poster cards</p>
            </div>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4">
              {LATEST_POSTERS.map((poster, index) => {
                const activePoster = getItem(`poster_${poster.id}`, { ...poster, name: `Poster #${index + 1}` });
                return (
                  <div key={poster.id} className="flex-shrink-0 snap-start" style={{ width: '82%', maxWidth: '340px' }}>
                    <CardInspectorWrapper
                      itemKey={`poster_${poster.id}`}
                      itemType="poster"
                      cardData={activePoster}
                      onEdit={setModalTarget}
                    >
                      <div className="rounded-2xl overflow-hidden border border-gray-200">
                        <img
                          src={activePoster.image}
                          alt={`Poster ${index + 1}`}
                          className="w-full h-full object-cover block"
                          style={{ aspectRatio: '16/7' }}
                        />
                      </div>
                    </CardInspectorWrapper>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Featured & Unique 2x3 Phones Grid (Editable Image, Name, Price, Condition, PTA Status) ── */}
          <div className="mt-6">
            <div className="px-4 mb-3">
              <h2 className="text-base font-bold text-black">Featured & Unique (2×3 Grid)</h2>
              <p className="text-xs text-black/40">Click the pencil icon to edit photo, text, PTA status, or condition</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 px-4">
              {latestPhones.slice(0, 6).map(product => {
                const activeProduct = getItem(`product_${product.id}`, product);
                const conditionText = activeProduct.condition || (activeProduct.badge === 'Used' ? 'Used' : 'Box Pack');
                const ptaText = activeProduct.ptaStatus || 'PTA Approved';

                return (
                  <CardInspectorWrapper
                    key={product.id}
                    itemKey={`product_${product.id}`}
                    itemType="product"
                    cardData={activeProduct}
                    onEdit={setModalTarget}
                  >
                    <div className="bg-white rounded-2xl border border-gray-200 p-2.5 flex flex-col h-full">
                      {/* Condition Badge */}
                      <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 self-start">
                        {conditionText}
                      </span>
                      
                      {/* Measured Image Area */}
                      <div className="h-28 w-full flex items-center justify-center p-1 bg-gray-50/50 rounded-xl my-1">
                        <img
                          src={activeProduct.image}
                          alt={activeProduct.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <p className="text-xs font-bold text-black leading-tight line-clamp-2 mt-1">{activeProduct.name}</p>
                      <div className="flex items-center justify-between gap-1 mt-auto pt-2">
                        <span className="text-xs font-bold text-[#4b47d9]">{fmt(activeProduct.price)}</span>
                        <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Buy now</span>
                      </div>
                    </div>
                  </CardInspectorWrapper>
                );
              })}
            </div>
          </div>

          {/* ── Budget Sections ── */}
          {BUDGET_SECTIONS.map(sec => {
            let items = sec.used
              ? INITIAL_PRODUCTS.filter(p => p.condition === 'used')
              : INITIAL_PRODUCTS.filter(p => p.price <= sec.max);
            items = items.slice(0, 2);
            if (!items.length) return null;

            return (
              <div key={sec.id} className="mt-6">
                <div className="px-4 mb-2">
                  <h2 className="text-base font-bold text-black">{sec.label}</h2>
                </div>
                <div className="px-4 flex flex-col gap-2.5">
                  {items.map(p => {
                    const shop = INITIAL_SHOPS.find(s => s.id === p.shopId);
                    const activeP = getItem(`product_${p.id}`, p);
                    return (
                      <CardInspectorWrapper
                        key={p.id}
                        itemKey={`product_${p.id}`}
                        itemType="product"
                        cardData={activeP}
                        onEdit={setModalTarget}
                      >
                        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200">
                          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img src={activeP.image} alt={activeP.name} className="w-full h-full object-contain" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-black leading-tight line-clamp-1">{activeP.name}</p>
                            <p className="text-[11px] text-black/40 mt-0.5 truncate">{shop?.name}</p>
                            <p className="text-sm font-bold text-[#4b47d9] mt-0.5">{fmt(activeP.price)}</p>
                          </div>
                        </div>
                      </CardInspectorWrapper>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ── Based on Usage Shop Covers ── */}
          <div className="mt-6">
            <div className="px-4 mb-2">
              <h2 className="text-base font-bold text-black">Based on Usage (Shop Covers)</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4">
              {USAGE_SECTIONS.slice(0, 2).map((sec, idx) => {
                const shop = INITIAL_SHOPS[idx % INITIAL_SHOPS.length];
                const activeShop = getItem(`shop_${shop.id}_cover`, { ...shop, image: shop.coverImage });
                return (
                  <div key={sec.id} className="flex-shrink-0 snap-start" style={{ width: 'calc(100vw - 60px)', maxWidth: '340px' }}>
                    <CardInspectorWrapper
                      itemKey={`shop_${shop.id}_cover`}
                      itemType="shop"
                      cardData={activeShop}
                      onEdit={setModalTarget}
                    >
                      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                        <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                          <img src={activeShop.image} alt={activeShop.name} className="w-full h-full object-cover" />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="bg-white/20 text-white backdrop-blur-md border border-white/30 text-[11px] font-bold px-2.5 py-1 rounded-full">
                              {sec.label}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-black text-black truncate">{activeShop.name}</h3>
                          <p className="text-xs text-black/40">{activeShop.address}</p>
                        </div>
                      </div>
                    </CardInspectorWrapper>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── All Shops Near You Logos ── */}
          <div className="mt-6 mb-8">
            <div className="px-4 mb-2">
              <h2 className="text-base font-bold text-black">All Shops (Shop Logos)</h2>
            </div>
            <div className="px-4 flex flex-col gap-3">
              {INITIAL_SHOPS.slice(0, 2).map(shop => {
                const activeShop = getItem(`shop_${shop.id}_logo`, { ...shop, image: shop.logo });
                return (
                  <CardInspectorWrapper
                    key={shop.id}
                    itemKey={`shop_${shop.id}_logo`}
                    itemType="shop"
                    cardData={activeShop}
                    onEdit={setModalTarget}
                  >
                    <div className="flex gap-3 items-center bg-white rounded-2xl border border-gray-200 p-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={activeShop.image} alt={activeShop.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-black truncate">{activeShop.name}</p>
                        <p className="text-[11px] text-black/40 truncate">{activeShop.address}</p>
                      </div>
                    </div>
                  </CardInspectorWrapper>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Card Content Editor Modal ── */}
      {modalTarget && (
        <CardEditorModal
          target={modalTarget}
          onClose={() => setModalTarget(null)}
          onSave={setItemData}
          onReset={resetItem}
        />
      )}
    </div>
  );
}
