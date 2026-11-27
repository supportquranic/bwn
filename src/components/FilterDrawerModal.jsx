import { useState } from 'react';
import { X, SlidersHorizontal, Check, RotateCcw, Sparkles } from 'lucide-react';

const BRANDS = ['All', 'Apple', 'Samsung', 'Xiaomi', 'Infinix', 'Tecno', 'Realme', 'Vivo', 'Google'];

const PRICE_PRESETS = [
  { label: 'All', min: 0, max: 1000000 },
  { label: 'Under 30k', min: 0, max: 30000 },
  { label: '30k - 60k', min: 30000, max: 60000 },
  { label: '60k - 120k', min: 60000, max: 120000 },
  { label: 'Above 120k', min: 120000, max: 1000000 },
];

const PTA_OPTIONS = [
  { id: 'all', label: 'All Devices' },
  { id: 'pta', label: 'Official PTA Approved' },
  { id: 'non-pta', label: 'Non-PTA / JV / Sim-Lock' },
];

const CONDITION_OPTIONS = [
  { id: 'all', label: 'Any Condition' },
  { id: 'new', label: 'Brand New / Box Pack' },
  { id: 'used', label: 'Used / Pre-Owned' },
];

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured / Recommended' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Customer Rating' },
];

export default function FilterDrawerModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  totalResultsCount = 0
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!isOpen) return null;

  const handlePricePreset = (min, max) => {
    setLocalFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetValues = {
      brand: 'All',
      minPrice: 0,
      maxPrice: 1000000,
      pta: 'all',
      condition: 'all',
      sortBy: 'featured',
    };
    setLocalFilters(resetValues);
    if (onResetFilters) onResetFilters();
  };

  const isPresetActive = (min, max) => {
    return localFilters.minPrice === min && localFilters.maxPrice === max;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[88vh] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Solid Brand Purple Header ── */}
        <div 
          className="relative px-5 pt-4 pb-4 text-white flex-shrink-0 flex items-center justify-between"
          style={{ background: '#8586f2' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <SlidersHorizontal size={16} />
            </div>
            <div>
              <h2 className="text-base font-black text-white leading-tight">
                Filter & Sort
              </h2>
              <p className="text-white/80 text-[11px] font-medium">
                Bahawal Market · Customize your search
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-white/90 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white transition-colors"
              title="Close"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ── Filter Content (Scrollable) ── */}
        <div className="p-4 overflow-y-auto flex-1 hide-scrollbar space-y-4 bg-[#f8f9fc]">
          {/* 1. Sort By */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5">
              Sort By
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLocalFilters(prev => ({ ...prev, sortBy: opt.id }))}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                    localFilters.sortBy === opt.id
                      ? 'border-[#8586f2] bg-[#8586f2]/10 text-[#8586f2]'
                      : 'border-gray-200 bg-gray-50/70 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Brand Selector */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5">
              Brand
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {BRANDS.map(brand => (
                <button
                  key={brand}
                  onClick={() => setLocalFilters(prev => ({ ...prev, brand }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    localFilters.brand === brand
                      ? 'bg-[#8586f2] text-white border-[#8586f2] shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Price Range Presets & Inputs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5">
              Price Range (PKR)
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PRICE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePricePreset(preset.min, preset.max)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border ${
                    isPresetActive(preset.min, preset.max)
                      ? 'bg-[#8586f2] text-white border-[#8586f2]'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Manual Price Range Inputs */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] text-gray-400 font-semibold block mb-0.5">Min Price</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus-within:border-[#8586f2] focus-within:bg-white transition-colors">
                  <span className="text-[11px] text-gray-400 font-bold mr-1">Rs.</span>
                  <input
                    type="number"
                    value={localFilters.minPrice || ''}
                    onChange={e => setLocalFilters(prev => ({ ...prev, minPrice: Number(e.target.value) || 0 }))}
                    placeholder="0"
                    className="w-full bg-transparent text-xs font-bold text-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-semibold block mb-0.5">Max Price</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus-within:border-[#8586f2] focus-within:bg-white transition-colors">
                  <span className="text-[11px] text-gray-400 font-bold mr-1">Rs.</span>
                  <input
                    type="number"
                    value={localFilters.maxPrice >= 1000000 ? '' : localFilters.maxPrice}
                    onChange={e => setLocalFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) || 1000000 }))}
                    placeholder="No limit"
                    className="w-full bg-transparent text-xs font-bold text-black outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. PTA Approval Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5">
              PTA Status
            </h3>
            <div className="grid grid-cols-1 gap-1.5">
              {PTA_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLocalFilters(prev => ({ ...prev, pta: opt.id }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                    localFilters.pta === opt.id
                      ? 'border-[#8586f2] bg-[#8586f2]/10 text-[#8586f2]'
                      : 'border-gray-200 bg-gray-50/70 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {localFilters.pta === opt.id && <Check size={14} className="text-[#8586f2]" />}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Device Condition */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5">
              Device Condition
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {CONDITION_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLocalFilters(prev => ({ ...prev, condition: opt.id }))}
                  className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all border ${
                    localFilters.condition === opt.id
                      ? 'border-[#8586f2] bg-[#8586f2]/10 text-[#8586f2]'
                      : 'border-gray-200 bg-gray-50/70 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Apply Button Bar ── */}
        <div className="p-3.5 bg-white border-t border-gray-100 flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={handleApply}
            className="w-full py-3 bg-[#8586f2] hover:bg-[#7375e8] active:scale-98 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-transform"
          >
            <Check size={15} />
            <span>Apply Filters {totalResultsCount > 0 ? `(${totalResultsCount} items)` : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
