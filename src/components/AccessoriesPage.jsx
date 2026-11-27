import { useState } from 'react';
import { INITIAL_PRODUCTS } from '../data/mockData';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

const ACCESSORY_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'airpods', label: 'Earbuds' },
  { id: 'smartwatch', label: 'Smart Watch' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'chargers', label: 'Chargers' },
  { id: 'cases', label: 'Cases' },
  { id: 'handsfree', label: 'Handsfree' },
];

const ACCESSORY_CAT_IDS = ['airpods', 'smartwatch', 'headphones', 'chargers', 'cases', 'handsfree', 'cables', 'covers'];

/* ── Square Product Card (Exact match of Explore Page ProductCard) ── */
function AccessoryProductCard({ product, onProduct }) {
  const storage = product.specs?.Storage || (product.condition === 'new' ? 'Box Pack' : 'In Stock');

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
      onClick={() => onProduct(product.id)}
    >
      {/* Taller upper image area — image centered with extra vertical room */}
      <div className="px-3 pt-4 pb-2.5 flex-1 flex items-center justify-center min-h-[156px]">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-36 max-w-full object-contain"
        />
      </div>

      {/* Content area at bottom: title sits near price, spec directly under price */}
      <div className="px-3 pb-3.5 pt-0 flex flex-col justify-end">
        <p className="text-xs font-bold text-black leading-snug line-clamp-2 mb-2">
          {product.name}
        </p>
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#4b47d9]">{fmt(product.price)}</span>
            <span className="text-[10px] font-semibold text-black/45 leading-none mt-1">
              {storage}
            </span>
          </div>
          <button
            className="flex-shrink-0 bg-[#4b47d9] hover:bg-[#3d39c6] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
            onClick={e => { e.stopPropagation(); onProduct(product.id); }}
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccessoriesPage({ onProduct }) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter products belonging to accessories
  const allAccessories = INITIAL_PRODUCTS.filter(p => ACCESSORY_CAT_IDS.includes(p.category));

  const filteredAccessories = activeCategory === 'all'
    ? allAccessories
    : allAccessories.filter(p => p.category === activeCategory);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* ── Brand Header (Solid #8586f2, z-30) ── */}
      <div className="px-4 pt-4 pb-3.5 text-white flex-shrink-0 z-30" style={{ background: '#8586f2' }}>
        <h2 className="text-white text-lg font-black tracking-tight">Accessories</h2>
        <p className="text-white/80 text-[11px] font-medium">
          Genuine earbuds, smartwatches, chargers & cases in Bahawalnagar
        </p>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28 bg-[#f8f9fc] smooth-scroll">
        {/* Category Filter Pills */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-gray-100 py-2.5 px-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {ACCESSORY_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#4b47d9] text-white shadow-xs'
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
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-black">
              {activeCategory === 'all' ? 'All Accessories' : ACCESSORY_CATEGORIES.find(c => c.id === activeCategory)?.label}
            </span>
            <span className="text-xs text-black/40 font-medium">
              {filteredAccessories.length} items
            </span>
          </div>

          {filteredAccessories.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredAccessories.map(p => (
                <AccessoryProductCard
                  key={p.id}
                  product={p}
                  onProduct={onProduct}
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
