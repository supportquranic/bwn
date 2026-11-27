import { useState } from 'react';
import { Search, SlidersHorizontal, Plus, X } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/mockData';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

const ACCESSORY_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'glass', label: 'Glass' },
  { id: 'cases', label: 'Cases' },
  { id: 'airpods', label: 'Earbuds' },
  { id: 'smartwatch', label: 'Smart Watch' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'chargers', label: 'Chargers' },
  { id: 'handsfree', label: 'Handsfree' },
];

const ACCESSORY_CAT_IDS = ['airpods', 'smartwatch', 'headphones', 'chargers', 'cases', 'handsfree', 'cables', 'covers', 'glass'];

const isGlass = p => p.category === 'glass' || (p.name || '').toLowerCase().includes('glass') || (p.name || '').toLowerCase().includes('protector');
const isCase = p => (p.category === 'cases' || p.category === 'covers' || (p.name || '').toLowerCase().includes('case') || (p.name || '').toLowerCase().includes('cover')) && !isGlass(p);

/* ── Square Product Card (Exact match of Explore Page ProductCard) ── */
function AccessoryProductCard({ product, onProduct, onAddToCart }) {
  return (
    <div
      className="w-full h-full bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
      onClick={() => onProduct(product.id)}
    >
      {/* Upper image area — uniform square placeholder with rounded corners and exact side spacing */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <div className="w-full aspect-square bg-transparent rounded-2xl overflow-hidden flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content area at bottom: identical 2-line title height and bottom-aligned price row */}
      <div className="px-3 pb-3 pt-1 flex flex-col justify-between flex-1">
        <p className="text-xs font-bold text-black leading-snug line-clamp-2 h-8 mb-2">
          {product.name}
        </p>
        <div className="flex items-center justify-between gap-1.5 mt-auto">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-[#8586f2] truncate">{fmt(product.price)}</span>
            <span className="text-[10px] text-transparent select-none leading-none mt-1">
              -
            </span>
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

export default function AccessoriesPage({ onProduct, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products belonging to accessories including screen glasses
  const allAccessories = INITIAL_PRODUCTS.filter(p => ACCESSORY_CAT_IDS.includes(p.category) || isGlass(p));

  const filteredAccessories = allAccessories.filter(p => {
    let matchesCat = activeCategory === 'all';
    if (activeCategory === 'glass') {
      matchesCat = isGlass(p);
    } else if (activeCategory === 'cases') {
      matchesCat = isCase(p);
    } else {
      matchesCat = p.category === activeCategory;
    }
    if (!matchesCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.specs && Object.values(p.specs).some(val => String(val).toLowerCase().includes(q))) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* ── Brand Header (Solid #8586f2, z-30) ── */}
      <div className="px-4 pt-4 pb-3.5 text-white flex-shrink-0 z-30" style={{ background: '#8586f2' }}>
        <h2 className="text-white text-lg font-black tracking-tight">Accessories</h2>
        <p className="text-white/80 text-[11px] font-medium">
          Bahawalnagar, Pakistan · {allAccessories.length} verified accessories
        </p>
      </div>

      {/* ── Same Style Search Bar from Explore Page ── */}
      <div className="px-4 pt-3 pb-2 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="w-full bg-gray-50/90 border border-gray-200/90 rounded-full px-4 py-2.5 flex items-center gap-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
          <Search size={18} className="text-[#8586f2] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search accessories, chargers, earbuds..."
            className="w-full bg-transparent text-sm font-medium text-black placeholder:text-black/40 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-0.5 text-black/40 hover:text-black">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28 bg-[#f8f9fc] smooth-scroll">
        {/* Section Header: Title & Caption on top of section */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-black">
                {activeCategory === 'all'
                  ? 'Cases & Accessories'
                  : activeCategory === 'glass'
                  ? 'Glass Protectors'
                  : ACCESSORY_CATEGORIES.find(c => c.id === activeCategory)?.label}
              </h2>
              <p className="text-xs text-black/40">
                {activeCategory === 'all'
                  ? 'Hot covers, glass protectors, fast chargers & audio essentials'
                  : activeCategory === 'glass'
                  ? '9D, 11D, ceramic & UV tempered glass screen protectors in Bahawalnagar'
                  : `Browse genuine ${ACCESSORY_CATEGORIES.find(c => c.id === activeCategory)?.label.toLowerCase()} in Bahawalnagar`}
              </p>
            </div>
            <span className="text-xs text-black/40 font-semibold self-start mt-0.5">
              {filteredAccessories.length} items
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-gray-100 py-2.5 px-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {ACCESSORY_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#8586f2] text-white shadow-xs'
                    : 'bg-gray-100 text-black/70 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 mt-3">
          {filteredAccessories.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredAccessories.map(p => (
                <AccessoryProductCard
                  key={p.id}
                  product={p}
                  onProduct={onProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center text-center">
              <p className="text-black font-semibold text-sm">No items found</p>
              <p className="text-black/40 text-xs mt-1">Check back later for new inventory</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
