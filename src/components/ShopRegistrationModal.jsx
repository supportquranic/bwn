import { useState, useRef, useEffect } from 'react';
import { 
  X, Store, MapPin, Phone, MessageSquare, ShieldCheck, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, Building, Layers, Check, ChevronDown 
} from 'lucide-react';

const BAHAWALNAGAR_MARKETS = [
  'City Center Shopping Mall',
  'Main Bazar / Rail Bazar',
  'Baldia Road Mobile Market',
  'Circular Road',
  'Model Town / Minchinabad Road',
  'Haroonabad Road',
  'Jail Road / Qasim Market',
  'Other Bahawalnagar Location',
];

const CATEGORIES = [
  { id: 'box-pack', label: 'Box Pack Phones', sub: 'iPhone, Samsung, Xiaomi, Vivo, Infinix' },
  { id: 'used-phones', label: 'Used & Tested Phones', sub: '10/10 condition, verified IMEI' },
  { id: 'covers-glass', label: 'Covers & Screen Protectors', sub: 'Tempered glass, matte ceramic, shockproof' },
  { id: 'chargers-audio', label: 'Chargers & Earbuds', sub: 'Fast adapters, cables, wireless pods' },
  { id: 'repairing', label: 'Mobile Repairing Lab', sub: 'Display replacement, IC, glass change' },
];

export default function ShopRegistrationModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onRegisterShopSuccess,
  onOpenShop
}) {
  const [step, setStep] = useState(1); // 1: Shop info, 2: Contact & CNIC, 3: Categories & Submit, 4: Success
  const [shopName, setShopName] = useState('');
  const [marketArea, setMarketArea] = useState(BAHAWALNAGAR_MARKETS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [shopAddress, setShopAddress] = useState('');
  const [ownerName, setOwnerName] = useState(currentUser?.name || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [cnic, setCnic] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['box-pack', 'used-phones', 'covers-glass']);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const [createdShopId, setCreatedShopId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const toggleCategory = (id) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const validateStep1 = () => {
    if (!shopName.trim()) {
      setError('Please enter your shop name');
      return false;
    }
    if (!shopAddress.trim()) {
      setError('Please enter your shop number / complete market address');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!ownerName.trim()) {
      setError('Please enter owner full name');
      return false;
    }
    if (!whatsapp.trim() || whatsapp.trim().length < 10) {
      setError('Please enter a valid WhatsApp number for buyer orders');
      return false;
    }
    if (!cnic.trim() || cnic.trim().replace(/\D/g, '').length < 13) {
      setError('Please enter a valid 13-digit CNIC (e.g. 31102-1234567-1)');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please accept the seller terms & IMEI verification guarantee');
      return;
    }
    if (selectedCategories.length === 0) {
      setError('Please select at least one product category');
      return;
    }

    const newShopId = `shop-bw-${Date.now()}`;
    const formattedCategories = selectedCategories.map(catId => {
      const found = CATEGORIES.find(c => c.id === catId);
      return found ? found.label : catId;
    });

    const newShopData = {
      id: newShopId,
      name: shopName.trim(),
      ownerName: ownerName.trim(),
      address: `${shopAddress.trim()}, ${marketArea}, Bahawalnagar`,
      city: 'Bahawalnagar',
      market: marketArea,
      phone: phone.trim() || whatsapp.trim(),
      whatsapp: whatsapp.trim(),
      rating: 5.0,
      ratingCount: 1,
      verified: true,
      distance: 'In City',
      status: 'approved',
      logo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=400&q=80',
      banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      featuredQuote: `Premier mobile store in ${marketArea}`,
      categories: formattedCategories,
      viewsCount: 1,
      callClicks: 0,
      whatsappClicks: 0,
      createdAt: new Date().toISOString()
    };

    setCreatedShopId(newShopId);
    onRegisterShopSuccess(newShopData, cnic.trim());
    setStep(4);
  };

  const stepTitles = {
    1: 'Register Your Shop',
    2: 'Owner & WhatsApp',
    3: 'Shop Categories',
    4: 'Shop Registered!',
  };

  const stepSubtitles = {
    1: 'Step 1 of 3: Shop & Location',
    2: 'Step 2 of 3: Direct WhatsApp Orders',
    3: 'Step 3 of 3: Products Sold',
    4: 'Bahawal Market · Bahawalnagar',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[370px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Solid Brand Purple Header (Bahawal Market Identity) ── */}
        <div 
          className="relative px-6 pt-6 pb-6 text-white text-center flex-shrink-0"
          style={{ background: '#8586f2' }}
        >
          {/* Close button */}
          {step !== 4 && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white transition-colors"
              title="Close"
            >
              <X size={17} />
            </button>
          )}

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-2">
            <Sparkles size={12} />
            Sell on Bahawal Market
          </div>

          <h2 className="text-2xl font-black text-white leading-tight">
            {stepTitles[step]}
          </h2>
          <p className="text-white/80 text-xs mt-1">
            {stepSubtitles[step]}
          </p>

          {/* Step Pill Indicators */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    step === i ? 'w-6 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Form Body ── */}
        <div className="p-6 overflow-y-auto flex-1 hide-scrollbar">
          {error && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold leading-snug">
              {error}
            </div>
          )}

          {/* ── STEP 1: Shop & Market Location ── */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  placeholder="e.g. Al-Madina Mobiles"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-all"
                  autoFocus
                />
              </div>

              {/* Custom Rounded Dropdown with Chevron Icon */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Bahawalnagar Market Hub
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-black flex items-center justify-between transition-all cursor-pointer ${
                    isDropdownOpen ? 'border-[#8586f2] bg-white ring-2 ring-[#8586f2]/10' : 'border-gray-200 hover:bg-gray-100/70'
                  }`}
                >
                  <span className="truncate">{marketArea}</span>
                  <ChevronDown 
                    size={15} 
                    className={`text-gray-500 transition-transform duration-200 flex-shrink-0 ml-2 ${
                      isDropdownOpen ? 'rotate-180 text-[#8586f2]' : ''
                    }`} 
                  />
                </button>

                {/* Popover Menu with Rounded Corners & Soft Elevation */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-52 overflow-y-auto hide-scrollbar p-1.5 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                    {BAHAWALNAGAR_MARKETS.map(m => {
                      const isSelected = marketArea === m;
                      return (
                        <div
                          key={m}
                          onClick={() => {
                            setMarketArea(m);
                            setIsDropdownOpen(false);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-[#8586f2]/10 text-[#8586f2] font-bold' 
                              : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                          }`}
                        >
                          <span className="truncate">{m}</span>
                          {isSelected && <Check size={14} className="text-[#8586f2] flex-shrink-0 ml-1.5" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Shop # & Exact Address
                </label>
                <textarea
                  rows={2}
                  value={shopAddress}
                  onChange={e => setShopAddress(e.target.value)}
                  placeholder="e.g. Shop #14, Ground Floor, City Center Mall"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-all resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full mt-2 py-3.5 bg-[#8586f2] hover:bg-[#7375e8] active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
              >
                Continue to Owner Details
              </button>
            </div>
          )}

          {/* ── STEP 2: Owner & WhatsApp Contact ── */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Owner Full Name
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  placeholder="e.g. Tariq Mahmood"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Shop WhatsApp for Orders</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Direct Orders
                  </span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="e.g. 0300 1234567"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Owner CNIC (13 Digits)
                </label>
                <input
                  type="text"
                  value={cnic}
                  onChange={e => setCnic(e.target.value)}
                  placeholder="e.g. 31102-1234567-1"
                  maxLength={15}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3.5 bg-[#8586f2] hover:bg-[#7375e8] active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  Continue to Categories
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Categories & Agreement ── */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Select Categories Sold at Your Shop:
              </label>

              <div className="space-y-1.5 max-h-48 overflow-y-auto hide-scrollbar">
                {CATEGORIES.map(cat => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#8586f2]/10 border-[#8586f2]' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? 'text-[#8586f2]' : 'text-black'}`}>
                          {cat.label}
                        </p>
                        <p className="text-[10px] text-gray-400">{cat.sub}</p>
                      </div>
                      <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#8586f2] border-[#8586f2] text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Terms Checkbox */}
              <div 
                onClick={() => setAgreed(!agreed)}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer mt-1"
              >
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#8586f2] focus:ring-[#8586f2]"
                />
                <label className="text-[10.5px] text-gray-600 leading-snug cursor-pointer select-none">
                  I agree to provide authentic device specs, valid IMEI records, and genuine warranty details on Bahawal Market.
                </label>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#8586f2] hover:bg-[#7375e8] active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 4: Live Confirmation Screen ── */}
          {step === 4 && (
            <div className="py-2 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h3 className="text-base font-black text-black">Congratulations!</h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  <strong>{shopName}</strong> is now live on Bahawal Market!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-left space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-bold text-black">{marketArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">WhatsApp Orders:</span>
                  <span className="font-bold text-emerald-600">{whatsapp}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {createdShopId && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenShop(createdShopId);
                    }}
                    className="w-full py-3.5 bg-[#8586f2] hover:bg-[#7375e8] text-white font-bold text-sm rounded-xl transition-all shadow-xs active:scale-[0.98]"
                  >
                    Visit My Live Shop Page
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
