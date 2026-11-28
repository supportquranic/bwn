import { useState } from 'react';
import { 
  X, Bot, Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, 
  Layers, CheckCircle2, Star, ChevronRight, ShieldCheck, Flame, Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const fmt = n => 'Rs. ' + (Number(n) || 0).toLocaleString('en-PK');

const USAGE_GOALS = [
  { id: 'gaming', label: '🎮 PUBG & Heavy Gaming', desc: 'Fast chipset, 120Hz display, 8GB+ RAM' },
  { id: 'camera', label: '📸 High-End Photography', desc: 'Top camera sensors, 4K video, OIS stabilization' },
  { id: 'battery', label: '🔋 Long Battery & Durability', desc: '5,000mAh+ capacity & fast charging' },
  { id: 'flagship', label: '👑 Premium & Flagship', desc: 'Apple iPhone, Samsung Ultra, titanium build' },
  { id: 'daily', label: '📱 Daily Social & WhatsApp', desc: 'Best value for calling, YouTube, social apps' },
];

const BUDGET_RANGES = [
  { id: 'under-40k', label: 'Under Rs. 40,000', min: 0, max: 40000 },
  { id: '40k-80k', label: 'Rs. 40,000 - 80,000', min: 40000, max: 80000 },
  { id: '80k-150k', label: 'Rs. 80,000 - 150,000', min: 80000, max: 150000 },
  { id: 'above-150k', label: 'Above Rs. 150,000', min: 150000, max: 2000000 },
  { id: 'any', label: 'Any Budget', min: 0, max: 2000000 },
];

const CONDITION_PREFS = [
  { id: 'any', label: 'Any (New or Used)' },
  { id: 'new', label: 'Brand New / Box Pack only' },
  { id: 'used', label: 'Used / Pre-Owned (Top condition)' },
];

export default function SmartAssistantModal({ isOpen, onClose, onProduct, onShop }) {
  const { products = [], shops = [] } = useApp();

  // Wizard state: 1 (Usage) -> 2 (Budget) -> 3 (Condition) -> 4 (Results)
  const [step, setStep] = useState(1);
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('any');
  const [showComparison, setShowComparison] = useState(false);

  if (!isOpen) return null;

  // Filter only smartphones (exclude cases/covers/chargers)
  const phoneList = products.filter(p => {
    const isAccessory = ['cases', 'covers', 'airpods', 'smartwatch', 'chargers', 'headphones', 'handsfree', 'cables'].includes(p.category) ||
      ['case', 'cover', 'glass', 'protector', 'charger', 'buds', 'watch', 'handsfree', 'cable'].some(kw => (p.name || '').toLowerCase().includes(kw));
    return !isAccessory;
  });

  // Smart Matching Algorithm
  const getRecommendations = () => {
    if (!selectedUsage || !selectedBudget) return [];

    const filtered = phoneList.filter(p => {
      // 1. Budget check
      if (p.price < selectedBudget.min || p.price > selectedBudget.max) return false;

      // 2. Condition check
      if (selectedCondition === 'new' && (p.usedDetails || p.condition === 'used')) return false;
      if (selectedCondition === 'used' && !p.usedDetails && p.condition !== 'used') return false;

      return true;
    });

    // Score products based on selected usage
    const scored = filtered.map(p => {
      let score = 50; // base score
      const name = (p.name || '').toLowerCase();
      const specs = p.specs || {};
      const specsStr = JSON.stringify(specs).toLowerCase();

      // Usage specific weighting
      if (selectedUsage.id === 'gaming') {
        if (specsStr.includes('snapdragon') || specsStr.includes('dimensity') || specsStr.includes('bionic')) score += 25;
        if (specsStr.includes('120hz') || specsStr.includes('amoled')) score += 20;
        if (specs.RAM && (specs.RAM.includes('8') || specs.RAM.includes('12') || specs.RAM.includes('16'))) score += 15;
      } else if (selectedUsage.id === 'camera') {
        if (name.includes('iphone') || name.includes('pixel') || name.includes('ultra') || name.includes('pro')) score += 30;
        if (specsStr.includes('ois') || specsStr.includes('200mp') || specsStr.includes('50mp') || specsStr.includes('quad')) score += 25;
      } else if (selectedUsage.id === 'battery') {
        if (specs.Battery && (specs.Battery.includes('5000') || specs.Battery.includes('6000'))) score += 30;
        if (specsStr.includes('fast') || specsStr.includes('watt') || specsStr.includes('67w')) score += 15;
      } else if (selectedUsage.id === 'flagship') {
        if (name.includes('iphone 15') || name.includes('s24') || name.includes('pro max') || name.includes('ultra')) score += 40;
        if (p.price > 120000) score += 20;
      } else if (selectedUsage.id === 'daily') {
        if (p.price <= 60000) score += 30;
        if (p.condition === 'new') score += 15;
      }

      // Bonus for verified shop
      const shop = shops.find(s => s.id === p.shopId);
      if (shop?.verified) score += 10;

      return { product: p, score, shop };
    });

    // Sort by calculated recommendation score
    scored.sort((a, b) => b.score - a.score);

    // Return top 4 best distinct items
    return scored.slice(0, 4);
  };

  const recommendations = getRecommendations();
  const topTwoToCompare = recommendations.slice(0, 2);

  const handleReset = () => {
    setStep(1);
    setSelectedUsage(null);
    setSelectedBudget(null);
    setSelectedCondition('any');
    setShowComparison(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[420px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Solid Brand Purple Header ── */}
        <div 
          className="relative px-5 pt-4 pb-4 text-white flex-shrink-0 flex items-center justify-between"
          style={{ background: '#8586f2' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-xs">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-white leading-tight flex items-center gap-1.5">
                <span>Smart Device Matcher</span>
                <span className="text-[10px] bg-white/25 px-2 py-0.2 rounded-full font-bold">Fast</span>
              </h2>
              <p className="text-white/80 text-[11px] font-medium">
                Bahawal Market · Built-in Recommendation Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={handleReset}
                className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white transition-colors"
                title="Start Over"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white transition-colors"
              title="Close"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-4 overflow-y-auto flex-1 hide-scrollbar bg-[#f8f9fc] space-y-3.5">
          {/* STEP 1: Usage Purpose */}
          {step === 1 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-150">
              <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
                <span className="text-[10px] font-bold text-[#8586f2] uppercase tracking-wider block mb-0.5">
                  Step 1 of 3
                </span>
                <h3 className="text-sm font-black text-black">
                  What will you primarily use the phone for?
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  The matcher will weight processors, camera sensors, and battery accordingly.
                </p>
              </div>

              <div className="space-y-2">
                {USAGE_GOALS.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => {
                      setSelectedUsage(goal);
                      setStep(2);
                    }}
                    className="w-full bg-white rounded-2xl border border-gray-200 p-3.5 text-left active:scale-[0.99] hover:border-[#8586f2] transition-all shadow-xs flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-black group-hover:text-[#8586f2] transition-colors">
                        {goal.label}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{goal.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8586f2] transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Budget Range */}
          {step === 2 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-150">
              <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
                <span className="text-[10px] font-bold text-[#8586f2] uppercase tracking-wider block mb-0.5">
                  Step 2 of 3 · {selectedUsage?.label}
                </span>
                <h3 className="text-sm font-black text-black">
                  What is your target budget range?
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  We will only suggest available devices in Bahawalnagar within this bracket.
                </p>
              </div>

              <div className="space-y-2">
                {BUDGET_RANGES.map(budget => (
                  <button
                    key={budget.id}
                    onClick={() => {
                      setSelectedBudget(budget);
                      setStep(3);
                    }}
                    className="w-full bg-white rounded-2xl border border-gray-200 p-3.5 text-left active:scale-[0.99] hover:border-[#8586f2] transition-all shadow-xs flex items-center justify-between group"
                  >
                    <span className="text-xs font-bold text-black group-hover:text-[#8586f2] transition-colors">
                      {budget.label}
                    </span>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8586f2] transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Condition Preference */}
          {step === 3 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-150">
              <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
                <span className="text-[10px] font-bold text-[#8586f2] uppercase tracking-wider block mb-0.5">
                  Step 3 of 3
                </span>
                <h3 className="text-sm font-black text-black">
                  Do you prefer Brand New or Used devices?
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  All used phones in Bahawal Market include shop check warranty.
                </p>
              </div>

              <div className="space-y-2">
                {CONDITION_PREFS.map(cond => (
                  <button
                    key={cond.id}
                    onClick={() => {
                      setSelectedCondition(cond.id);
                      setStep(4);
                    }}
                    className="w-full bg-white rounded-2xl border border-gray-200 p-3.5 text-left active:scale-[0.99] hover:border-[#8586f2] transition-all shadow-xs flex items-center justify-between group"
                  >
                    <span className="text-xs font-bold text-black group-hover:text-[#8586f2] transition-colors">
                      {cond.label}
                    </span>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8586f2] transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Results & Recommendations */}
          {step === 4 && !showComparison && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
              {/* Header summary */}
              <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[#8586f2]">
                    <Sparkles size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Top Matches Found</span>
                  </div>
                  <h3 className="text-sm font-black text-black mt-0.5">
                    {recommendations.length} Best Phones for You
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {selectedUsage?.label} · {selectedBudget?.label}
                  </p>
                </div>

                {recommendations.length >= 2 && (
                  <button
                    onClick={() => setShowComparison(true)}
                    className="px-3 py-1.5 bg-[#8586f2] hover:bg-[#7375e8] active:scale-95 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 shadow-xs transition-transform flex-shrink-0"
                  >
                    <Scale size={13} />
                    <span>Compare Top 2</span>
                  </button>
                )}
              </div>

              {/* Product Cards */}
              {recommendations.length === 0 ? (
                <div className="py-12 bg-white rounded-2xl border border-gray-200 text-center p-4">
                  <p className="text-xs font-bold text-black">No devices matched this exact budget</p>
                  <p className="text-[11px] text-gray-400 mt-1">Try expanding your budget range or choosing "Any Condition".</p>
                  <button
                    onClick={handleReset}
                    className="mt-3 px-4 py-2 bg-[#8586f2] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                recommendations.map(({ product, shop }, idx) => {
                  const badgeTitles = [
                    '👑 #1 Best Overall Match',
                    '⚡ #2 Top Performance Choice',
                    '💰 #3 Best Value for Money',
                    '✨ #4 Recommended Option',
                  ];

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs space-y-2.5 transition-all hover:border-[#8586f2]"
                    >
                      {/* Ranking Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#8586f2] bg-[#8586f2]/10 px-2 py-0.5 rounded-full">
                          {badgeTitles[idx] || 'Recommended'}
                        </span>
                        <span className="text-xs font-black text-black">
                          {fmt(product.price)}
                        </span>
                      </div>

                      {/* Product Overview */}
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-black truncate leading-snug">
                            {product.name}
                          </h4>
                          <p className="text-[10.5px] text-gray-500 mt-0.5">
                            {shop?.name || 'Bahawal Mobile Market'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10.5px] text-gray-400">
                            <span>{product.specs?.Storage || (product.condition === 'new' ? 'Box Pack' : 'Used')}</span>
                            <span>·</span>
                            <span>{product.specs?.Display || '120Hz AMOLED'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          In Stock in Bahawalnagar
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            if (onProduct) onProduct(product.id);
                          }}
                          className="bg-[#8586f2] hover:bg-[#7375e8] text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
                        >
                          <span>View Device</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* STEP 4 (SUBVIEW): Side-by-Side Comparison */}
          {step === 4 && showComparison && topTwoToCompare.length >= 2 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-150">
              <div className="flex items-center justify-between px-1">
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-xs font-bold text-[#8586f2] hover:underline flex items-center gap-1"
                >
                  <span>← Back to Recommendations</span>
                </button>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Side-by-Side Comparison
                </span>
              </div>

              {/* Comparison Table Card */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                {/* Header with 2 phones */}
                <div className="grid grid-cols-2 p-3 bg-gray-50/80 border-b border-gray-200 gap-2 text-center">
                  {topTwoToCompare.map(({ product }, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-white rounded-xl border border-gray-200 p-1 flex items-center justify-center mb-1 shadow-xs">
                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <p className="text-[11px] font-bold text-black truncate w-full">{product.name}</p>
                      <p className="text-xs font-black text-[#8586f2] mt-0.5">{fmt(product.price)}</p>
                    </div>
                  ))}
                </div>

                {/* Spec Rows */}
                <div className="divide-y divide-gray-100 text-[11px]">
                  <div className="grid grid-cols-2 p-2.5 text-center">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Retailer</span>
                      <strong className="text-black">{topTwoToCompare[0].shop?.name || 'Al-Madina'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Retailer</span>
                      <strong className="text-black">{topTwoToCompare[1].shop?.name || 'Chishti Mobile'}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 p-2.5 text-center bg-gray-50/40">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Storage / RAM</span>
                      <strong className="text-black">{topTwoToCompare[0].product.specs?.Storage || '256GB'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Storage / RAM</span>
                      <strong className="text-black">{topTwoToCompare[1].product.specs?.Storage || '256GB'}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 p-2.5 text-center">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Display</span>
                      <strong className="text-black">{topTwoToCompare[0].product.specs?.Display || '120Hz AMOLED'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Display</span>
                      <strong className="text-black">{topTwoToCompare[1].product.specs?.Display || '120Hz AMOLED'}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 p-2.5 text-center bg-gray-50/40">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Camera</span>
                      <strong className="text-black truncate block">{topTwoToCompare[0].product.specs?.Camera || '50MP OIS'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Camera</span>
                      <strong className="text-black truncate block">{topTwoToCompare[1].product.specs?.Camera || '50MP OIS'}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 p-2.5 text-center">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Condition & PTA</span>
                      <span className="text-emerald-600 font-bold">Official PTA Approved</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Condition & PTA</span>
                      <span className="text-emerald-600 font-bold">Official PTA Approved</span>
                    </div>
                  </div>
                </div>

                {/* Bottom 1-Tap Select Buttons */}
                <div className="grid grid-cols-2 p-3 gap-2 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => {
                      onClose();
                      if (onProduct) onProduct(topTwoToCompare[0].product.id);
                    }}
                    className="py-2 px-2 bg-[#8586f2] hover:bg-[#7375e8] text-white text-[11px] font-bold rounded-xl active:scale-95 transition-transform text-center shadow-xs"
                  >
                    Select Option 1
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      if (onProduct) onProduct(topTwoToCompare[1].product.id);
                    }}
                    className="py-2 px-2 bg-[#8586f2] hover:bg-[#7375e8] text-white text-[11px] font-bold rounded-xl active:scale-95 transition-transform text-center shadow-xs"
                  >
                    Select Option 2
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
