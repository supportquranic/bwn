import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, RotateCcw, Upload, Link as LinkIcon, Check, 
  X, Info, Image as ImageIcon, Sparkles, ChevronRight, MapPin, 
  Heart, Bot, Star, Lock, LogOut
} from 'lucide-react';
import { 
  BANNERS, CATEGORIES, USAGE_SECTIONS, BUDGET_SECTIONS, 
  BRANDS, LATEST_POSTERS, INITIAL_SHOPS, INITIAL_PRODUCTS 
} from '../data/mockData';
import { useCustomImages } from '../utils/imageStore';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

/* 3D category fallback icons */
const CAT_3D_ICONS = {
  android:    '/icons/categories/android.png',
  iphone:     '/icons/categories/iphone.png',
  ipad:       '/icons/categories/ipad.png',
  headphones: '/icons/categories/headphones.png',
  handsfree:  '/icons/categories/handsfree.png',
  cables:     '/icons/categories/cables.png',
};

/* Brand logos */
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
 * AdminImageWrapper
 * Measures its exact rendered width & height in pixels and shows them below the image.
 * Supports: Single Click, Long Press (500ms), and Right Click to change image.
 */
function AdminImageWrapper({ 
  imageKey, 
  label, 
  currentSrc, 
  aspectHint, 
  onSelectForEdit, 
  children,
  className = "" 
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const timerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setDimensions({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const triggerEdit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onSelectForEdit({
      imageKey,
      label,
      currentSrc,
      aspectHint,
      width: dimensions.width,
      height: dimensions.height,
    });
  };

  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      triggerEdit();
    }, 450);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseDown = () => {
    timerRef.current = setTimeout(() => {
      triggerEdit();
    }, 450);
  };

  const handleMouseUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div className={`relative flex flex-col group ${className}`}>
      {/* Target Container */}
      <div
        ref={containerRef}
        onClick={triggerEdit}
        onContextMenu={triggerEdit}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="relative cursor-pointer transition-all duration-150 hover:ring-2 hover:ring-[#4b47d9] hover:ring-offset-1 rounded-2xl select-none"
        title="Click, Right-Click, or Long-Press to change image"
      >
        {children}

        {/* Small Edit Badge */}
        <div className="absolute top-1.5 left-1.5 z-20 bg-black/75 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 opacity-90 group-hover:opacity-100 shadow">
          <span>✏️ Edit</span>
        </div>
      </div>

      {/* Dimension Label (Horizontal width & Vertical height in pixels) */}
      <div className="mt-1 flex items-center justify-between text-[9.5px] font-semibold text-gray-600 bg-gray-100/90 border border-gray-200/80 rounded-md px-1.5 py-0.5 leading-tight">
        <span className="text-black font-bold truncate max-w-[130px]">{label}</span>
        <span className="font-mono text-[#4b47d9] font-bold whitespace-nowrap ml-1">
          ↔ {dimensions.width}px × ↕ {dimensions.height}px
        </span>
      </div>
    </div>
  );
}

/**
 * Image Edit Modal
 */
function ImageEditModal({ target, onClose, onSave, onReset }) {
  const [urlInput, setUrlInput] = useState(target?.currentSrc || '');
  const [previewSrc, setPreviewSrc] = useState(target?.currentSrc || '');
  const [isDataUrl, setIsDataUrl] = useState(false);
  const fileInputRef = useRef(null);

  if (!target) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setPreviewSrc(result);
        setUrlInput('');
        setIsDataUrl(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (val) => {
    setUrlInput(val);
    setPreviewSrc(val);
    setIsDataUrl(false);
  };

  const handleApply = () => {
    const finalVal = isDataUrl ? previewSrc : (urlInput.trim() || previewSrc);
    if (!finalVal) {
      alert('Please provide an image URL or choose a file.');
      return;
    }
    onSave(target.imageKey, finalVal);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Reset this image to default original?')) {
      onReset(target.imageKey);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-black text-black">Change Image</h3>
            <p className="text-xs text-black/50 mt-0.5">{target.label}</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black"
          >
            <X size={16} />
          </button>
        </div>

        {/* Pixel Dimensions Banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#4b47d9] block">Card / Image Dimensions</span>
            <span className="text-black/60 text-[11px]">Rendered on current screen</span>
          </div>
          <div className="text-right font-mono font-bold text-[#4b47d9]">
            <div>Horizontal (Width): {target.width} px</div>
            <div>Vertical (Height): {target.height} px</div>
          </div>
        </div>

        {/* Image Preview */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Live Preview</label>
          <div className="w-full h-44 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center relative">
            {previewSrc ? (
              <img 
                src={previewSrc} 
                alt="Preview" 
                className="w-full h-full object-contain"
                onError={() => alert('Could not load image. Check the URL.')}
              />
            ) : (
              <div className="text-gray-400 text-xs flex flex-col items-center gap-1">
                <ImageIcon size={28} />
                <span>No image selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Option 1: Upload from Device */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Option 1: Upload from Phone / PC</label>
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
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold rounded-xl border border-gray-300 border-dashed flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Upload size={15} />
            <span>Select Image File from Device</span>
          </button>
          {isDataUrl && (
            <p className="text-[10px] text-green-600 font-bold mt-1 text-center">✓ Device image loaded into preview</p>
          )}
        </div>

        {/* Option 2: Image Web URL */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Option 2: Or Paste Image Web URL</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="url"
                placeholder="https://..."
                value={urlInput}
                onChange={e => handleUrlChange(e.target.value)}
                className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#4b47d9]"
              />
            </div>
            {urlInput && (
              <button 
                type="button" 
                onClick={() => handleUrlChange('')}
                className="text-gray-400 hover:text-black p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 px-3 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl active:scale-95 transition-transform"
          >
            Reset Default
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-2 py-2.5 px-4 bg-[#4b47d9] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow"
          >
            <Check size={14} />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main AdminVisualEditor
 * Clones the HomePage layout with pixel inspectors and image editor modal.
 */
export default function AdminVisualEditor({ onExit }) {
  const { overrides, getImg, setImage, resetImage, resetAllImages } = useCustomImages();
  const [activeModalTarget, setActiveModalTarget] = useState(null);
  const [bannerIdx, setBannerIdx] = useState(0);
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
            Enter the admin password to manage and change images.
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

  const banner = BANNERS[bannerIdx];
  const latestPhones = INITIAL_PRODUCTS.filter(p => p.category === 'iphone' || p.category === 'android');

  const handleSave = (key, val) => {
    setImage(key, val);
  };

  const handleResetAll = () => {
    if (confirm('Reset ALL custom images across the entire website back to original defaults?')) {
      resetAllImages();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-black font-sans relative">
      {/* ── Admin Top Bar Banner ── */}
      <div className="bg-[#1f1d4f] text-white px-4 py-2.5 flex items-center justify-between z-40 border-b border-indigo-900 shadow-md">
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
              <span>Admin Studio: Live Image Editor</span>
              <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full">ADMIN</span>
            </h1>
            <p className="text-[10px] text-white/70">Tap, Right-Click, or Long-press any card to change its image</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetAll}
            className="text-[10px] font-bold bg-white/10 hover:bg-red-500/80 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
            title="Reset all image overrides"
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

      {/* ── Scrollable Exact Clone of HomePage with Inspectors ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar gradient-bg-top-light pb-24">
        
        {/* Sticky Top Bar Mock */}
        <div className="pt-3.5 pb-2.5 px-4 text-white bg-gradient-to-b from-[#8586f2] to-[#7c7deb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>
              <div>
                <span className="text-white font-black text-sm tracking-tight block">Bahawalnagar, Pakistan</span>
                <span className="text-white/80 text-[10.5px] font-medium block">Bahawal Mobile Market</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8.5 h-8.5 p-2 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Heart size={15} className="text-white fill-white" />
              </div>
              <div className="w-8.5 h-8.5 p-2 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
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
                {banner.tag}
              </span>
              <h2 className="text-white text-xl font-black leading-tight tracking-tight">
                {banner.title}
              </h2>
              <p className="text-white/85 text-xs font-medium mt-1 leading-snug line-clamp-1">
                {banner.subtitle}
              </p>
            </div>
            
            {/* Banner Image with Inspector */}
            <AdminImageWrapper
              imageKey={`banner_${banner.id}`}
              label={`Hero Banner ${bannerIdx + 1}`}
              currentSrc={getImg(`banner_${banner.id}`, banner.image)}
              onSelectForEdit={setActiveModalTarget}
              className="flex-shrink-0"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/40 bg-white/10">
                <img
                  src={getImg(`banner_${banner.id}`, banner.image)}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            </AdminImageWrapper>
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

        {/* ── Lower White Sheet ── */}
        <div className="bg-white rounded-t-[34px] min-h-screen pb-24 pt-4">

          {/* Search Bar Visual */}
          <div className="px-4 pb-2">
            <div className="w-full bg-gray-100 rounded-full px-4 py-3 flex items-center gap-2.5">
              <span className="text-[#4b47d9] font-bold">🔍</span>
              <span className="text-black/40 text-sm font-medium">Search for mobile shops and devices</span>
            </div>
          </div>

          {/* ── 3D Categories with Dimensions ── */}
          <div className="mt-4 px-4">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-sm font-black text-black tracking-tight">Browse Categories (3D Icons)</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {CATEGORIES.filter(cat => CAT_3D_ICONS[cat.id]).map(cat => {
                const defaultIcon = CAT_3D_ICONS[cat.id];
                const activeSrc = getImg(`cat_${cat.id}`, defaultIcon);
                return (
                  <div key={cat.id} className="flex-shrink-0 flex flex-col items-center">
                    <AdminImageWrapper
                      imageKey={`cat_${cat.id}`}
                      label={cat.label}
                      currentSrc={activeSrc}
                      onSelectForEdit={setActiveModalTarget}
                    >
                      <div className="w-14 h-14 flex items-center justify-center p-1 bg-gray-50/60 rounded-xl">
                        <img
                          src={activeSrc}
                          alt={cat.label}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    </AdminImageWrapper>
                    <span className="text-[11px] font-semibold text-black/70 mt-1">{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Latest Models Posters with Dimensions ── */}
          <div className="mt-6">
            <div className="px-4 flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-black text-black tracking-tight">Latest Models Posters</h2>
                <p className="text-xs text-black/40">Horizontal poster cards with rendered pixel size</p>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4">
              {LATEST_POSTERS.map((poster, index) => {
                const currentImg = getImg(`poster_${poster.id}`, poster.image);
                return (
                  <div key={poster.id} className="flex-shrink-0 snap-start" style={{ width: '82%', maxWidth: '340px' }}>
                    <AdminImageWrapper
                      imageKey={`poster_${poster.id}`}
                      label={`Poster #${index + 1}`}
                      currentSrc={currentImg}
                      aspectHint="16:7"
                      onSelectForEdit={setActiveModalTarget}
                    >
                      <div className="rounded-2xl overflow-hidden border border-gray-200">
                        <img
                          src={currentImg}
                          alt={`Poster ${index + 1}`}
                          className="w-full h-full object-cover block"
                          style={{ aspectRatio: '16/7' }}
                        />
                      </div>
                    </AdminImageWrapper>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Featured & Unique 2x3 Phones Grid with Dimensions ── */}
          <div className="mt-6">
            <div className="px-4 flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-black">Featured & Unique (2×3 Grid)</h2>
                <p className="text-xs text-black/40">Compact mobile phone cards</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 px-4">
              {latestPhones.slice(0, 6).map(product => {
                const currentImg = getImg(`product_${product.id}`, product.image);
                const badge = product.condition === 'used' ? 'Used' : 'Box Pack';
                return (
                  <div key={product.id} className="bg-white rounded-2xl border border-gray-200 p-2.5 flex flex-col">
                    <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-medium px-2 py-0.5 rounded-full mb-1 self-start">
                      {badge}
                    </span>
                    
                    <AdminImageWrapper
                      imageKey={`product_${product.id}`}
                      label={product.name}
                      currentSrc={currentImg}
                      onSelectForEdit={setActiveModalTarget}
                      className="my-1"
                    >
                      <div className="h-28 w-full flex items-center justify-center p-1 bg-gray-50/50 rounded-xl">
                        <img
                          src={currentImg}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </AdminImageWrapper>

                    <p className="text-xs font-bold text-black leading-tight line-clamp-1 mt-1">{product.name}</p>
                    <div className="flex items-center justify-between gap-1 mt-2">
                      <span className="text-xs font-bold text-[#4b47d9]">{fmt(product.price)}</span>
                      <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Buy now</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Budget Sections with Dimensions ── */}
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
                    const currentImg = getImg(`product_${p.id}`, p.image);
                    return (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200">
                        <AdminImageWrapper
                          imageKey={`product_${p.id}`}
                          label={p.name}
                          currentSrc={currentImg}
                          onSelectForEdit={setActiveModalTarget}
                          className="flex-shrink-0"
                        >
                          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={currentImg} alt={p.name} className="w-full h-full object-contain" />
                          </div>
                        </AdminImageWrapper>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-black leading-tight line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-black/40 mt-0.5 truncate">{shop?.name}</p>
                          <p className="text-sm font-bold text-[#4b47d9] mt-0.5">{fmt(p.price)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ── Based on Usage Shops with Dimensions ── */}
          <div className="mt-6">
            <div className="px-4 mb-2">
              <h2 className="text-base font-bold text-black">Based on Usage (Shop Covers)</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pl-4 pr-4 pb-2 snap-x snap-mandatory scroll-pl-4">
              {USAGE_SECTIONS.slice(0, 2).map((sec, idx) => {
                const shop = INITIAL_SHOPS[idx % INITIAL_SHOPS.length];
                const coverImg = getImg(`shop_${shop.id}_cover`, shop.coverImage);
                return (
                  <div key={sec.id} className="flex-shrink-0 snap-start bg-white rounded-3xl border border-gray-200 overflow-hidden" style={{ width: 'calc(100vw - 60px)', maxWidth: '340px' }}>
                    <AdminImageWrapper
                      imageKey={`shop_${shop.id}_cover`}
                      label={`${shop.name} Cover`}
                      currentSrc={coverImg}
                      onSelectForEdit={setActiveModalTarget}
                    >
                      <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                        <img src={coverImg} alt={shop.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="bg-white/20 text-white backdrop-blur-md border border-white/30 text-[11px] font-bold px-2.5 py-1 rounded-full">
                            {sec.label}
                          </span>
                        </div>
                      </div>
                    </AdminImageWrapper>
                    <div className="p-3">
                      <h3 className="text-sm font-black text-black truncate">{shop.name}</h3>
                      <p className="text-xs text-black/40">{shop.address}</p>
                    </div>
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
                const logoImg = getImg(`shop_${shop.id}_logo`, shop.logo);
                return (
                  <div key={shop.id} className="flex gap-3 items-center bg-white rounded-2xl border border-gray-200 p-3">
                    <AdminImageWrapper
                      imageKey={`shop_${shop.id}_logo`}
                      label={`${shop.name} Logo`}
                      currentSrc={logoImg}
                      onSelectForEdit={setActiveModalTarget}
                      className="flex-shrink-0"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                        <img src={logoImg} alt={shop.name} className="w-full h-full object-cover" />
                      </div>
                    </AdminImageWrapper>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black truncate">{shop.name}</p>
                      <p className="text-[11px] text-black/40 truncate">{shop.address}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Image Replacement Modal ── */}
      {activeModalTarget && (
        <ImageEditModal
          target={activeModalTarget}
          onClose={() => setActiveModalTarget(null)}
          onSave={handleSave}
          onReset={resetImage}
        />
      )}
    </div>
  );
}
